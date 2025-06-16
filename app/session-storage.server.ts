import type { PrismaClient, Shop } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { InvalidSession, Session as BaseSession, type SessionParams } from '@shopify/shopify-api';
import { SessionStorage } from '@shopify/shopify-app-session-storage';

interface PrismaSessionStorageOptions {
    tableName?: string;
    connectionRetries?: number;
    connectionRetryIntervalMs?: number;
}

const UNIQUE_KEY_CONSTRAINT_ERROR_CODE = 'P2002';

// eslint-disable-next-line no-warning-comments
// TODO: Remove this when all session storages have implemented the isReady method
export interface PrismaSessionStorageInterface extends SessionStorage {
    isReady(): Promise<boolean>;
}

export interface OnlineAccessInfo {
    /**
     * How long the access token is valid for, in seconds.
     */
    expires_in: number;
    /**
     * The effective set of scopes for the session.
     */
    associated_user_scope: string;
    /**
     * The user associated with the access token.
     */
    associated_user: OnlineAccessUser;
}

export interface OnlineAccessUser {
    /**
     * The user's ID.
     */
    id: number;
    /**
     * The user's first name.
     */
    first_name: string;
    /**
     * The user's last name.
     */
    last_name: string;
    /**
     * The user's email address.
     */
    email: string;
    /**
     * Whether the user has verified their email address.
     */
    email_verified: boolean;
    /**
     * Whether the user is the account owner.
     */
    account_owner: boolean;
    /**
     * The user's locale.
     */
    locale: string;
    /**
     * Whether the user is a collaborator.
     */
    collaborator: boolean;
}

export class Session extends BaseSession {
    constructor(params: SessionParams & { shopId: number }) {
        super(params);
        this.shopId = params.shopId;
    }

    public static fromPropertyArray(entries: [string, string | number | boolean][], returnUserData = false): Session {
        if (!Array.isArray(entries)) {
            throw new InvalidSession('The parameter is not an array: a Session cannot be created from this object.');
        }

        const obj = Object.fromEntries(
            entries
                .filter(([_key, value]) => value !== null && value !== undefined)
                // Sanitize keys
                .map(([key, value]) => {
                    switch (key.toLowerCase()) {
                        case 'isonline':
                            return ['isOnline', value];
                        case 'accesstoken':
                            return ['accessToken', value];
                        case 'onlineaccessinfo':
                            return ['onlineAccessInfo', value];
                        case 'userid':
                            return ['userId', value];
                        case 'firstname':
                            return ['firstName', value];
                        case 'lastname':
                            return ['lastName', value];
                        case 'accountowner':
                            return ['accountOwner', value];
                        case 'emailverified':
                            return ['emailVerified', value];
                        case 'shopid':
                            return ['shopId', value];
                        default:
                            return [key.toLowerCase(), value];
                    }
                }),
        );

        const sessionData = {} as SessionParams;
        const onlineAccessInfo = {
            associated_user: {},
        } as OnlineAccessInfo;

        Object.entries(obj).forEach(([key, value]) => {
            switch (key) {
                case 'isOnline':
                    if (typeof value === 'string') {
                        sessionData[key] = value.toString().toLowerCase() === 'true';
                    } else if (typeof value === 'number') {
                        sessionData[key] = Boolean(value);
                    } else {
                        sessionData[key] = value;
                    }
                    break;
                case 'scope':
                    sessionData[key] = value.toString();
                    break;
                case 'expires':
                    sessionData[key] = value ? new Date(Number(value)) : undefined;
                    break;
                case 'onlineAccessInfo':
                    onlineAccessInfo.associated_user.id = Number(value);
                    break;
                case 'userId':
                    if (returnUserData) {
                        onlineAccessInfo.associated_user.id = Number(value);
                        break;
                    }
                case 'firstName':
                    if (returnUserData) {
                        onlineAccessInfo.associated_user.first_name = String(value);
                        break;
                    }
                case 'lastName':
                    if (returnUserData) {
                        onlineAccessInfo.associated_user.last_name = String(value);
                        break;
                    }
                case 'email':
                    if (returnUserData) {
                        onlineAccessInfo.associated_user.email = String(value);
                        break;
                    }
                case 'accountOwner':
                    if (returnUserData) {
                        onlineAccessInfo.associated_user.account_owner = Boolean(value);
                        break;
                    }
                case 'locale':
                    if (returnUserData) {
                        onlineAccessInfo.associated_user.locale = String(value);
                        break;
                    }
                case 'collaborator':
                    if (returnUserData) {
                        onlineAccessInfo.associated_user.collaborator = Boolean(value);
                        break;
                    }
                case 'emailVerified':
                    if (returnUserData) {
                        onlineAccessInfo.associated_user.email_verified = Boolean(value);
                        break;
                    }
                // Return any user keys as passed in
                default:
                    sessionData[key] = value;
            }
        });
        if (sessionData.isOnline) {
            sessionData.onlineAccessInfo = onlineAccessInfo;
        }
        return new Session(sessionData as SessionParams & { shopId: number });
    }

    readonly shopId: number;
}

export class PrismaSessionStorage<T extends PrismaClient> implements PrismaSessionStorageInterface {
    private ready: Promise<boolean>;
    private readonly tableName: string = 'session';
    private connectionRetries = 2;
    private connectionRetryIntervalMs = 5000;

    constructor(
        private prisma: T,
        { tableName, connectionRetries, connectionRetryIntervalMs }: PrismaSessionStorageOptions = {},
    ) {
        if (tableName) {
            this.tableName = tableName;
        }

        if (connectionRetries !== undefined) {
            this.connectionRetries = connectionRetries;
        }

        if (connectionRetryIntervalMs !== undefined) {
            this.connectionRetryIntervalMs = connectionRetryIntervalMs;
        }

        if (this.getSessionTable() === undefined) {
            throw new Error(`PrismaClient does not have a ${this.tableName} table`);
        }

        this.ready = this.pollForTable()
            .then(() => true)
            .catch((cause) => {
                throw new MissingSessionTableError(
                    `Prisma ${this.tableName} table does not exist. This could happen for a few reasons, see https://github.com/Shopify/shopify-app-js/tree/main/packages/apps/session-storage/shopify-app-session-storage-prisma#troubleshooting for more information`,
                    cause,
                );
            });
    }

    public async storeSession(session: Session): Promise<boolean> {
        await this.ensureReady();
        const data = this.sessionToRow(session);

        try {
            await this.getSessionTable().upsert({
                where: { id: session.id },
                update: data,
                create: data,
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === UNIQUE_KEY_CONSTRAINT_ERROR_CODE
            ) {
                console.log('Caught PrismaClientKnownRequestError P2002 - Unique Key Key Constraint, retrying upsert.');
                await this.getSessionTable().upsert({
                    where: { id: session.id },
                    update: data,
                    create: data,
                });
                return true;
            }
            throw error;
        }

        return true;
    }

    public async loadSession(id: string): Promise<Session | undefined> {
        await this.ensureReady();
        const row = await this.getSessionTable().findUnique({
            where: { id },
        });

        if (!row) {
            return undefined;
        }

        return this.rowToSession(row);
    }

    public async deleteSession(id: string): Promise<boolean> {
        await this.ensureReady();
        try {
            await this.getSessionTable().delete({ where: { id } });
        } catch {
            return true;
        }

        return true;
    }

    public async deleteSessions(ids: string[]): Promise<boolean> {
        await this.ensureReady();
        await this.getSessionTable().deleteMany({ where: { id: { in: ids } } });

        return true;
    }

    public async findSessionsByShop(shop: string): Promise<Session[]> {
        await this.ensureReady();
        const sessions = await this.getSessionTable().findMany({
            where: { shop },
            take: 25,
            orderBy: [{ expires: 'desc' }],
        });

        return sessions.map((session) => this.rowToSession(session));
    }

    public async isReady(): Promise<boolean> {
        try {
            await this.pollForTable();
            this.ready = Promise.resolve(true);
        } catch (_error) {
            this.ready = Promise.resolve(false);
        }
        return this.ready;
    }

    private async ensureReady(): Promise<void> {
        if (!(await this.ready))
            throw new MissingSessionStorageError(
                'Prisma session storage is not ready. Use the `isReady` method to poll for the table.',
            );
    }

    private async pollForTable(): Promise<void> {
        for (let i = 0; i < this.connectionRetries; i++) {
            try {
                await this.getSessionTable().count();
                return;
            } catch (error) {
                console.log(`Error obtaining session table: ${error}`);
            }
            await sleep(this.connectionRetryIntervalMs);
        }
        throw Error(`The table \`${this.tableName}\` does not exist in the current database.`);
    }

    private sessionToRow(session: Session): Shop {
        const sessionParams = session.toObject();

        return {
            id: session.id,
            shop: session.shop,
            shopId: session.shopId,
            state: session.state,
            isOnline: session.isOnline,
            scope: session.scope || null,
            expires: session.expires || null,
            accessToken: session.accessToken || '',
            userId: (sessionParams.onlineAccessInfo?.associated_user.id as unknown as bigint) || null,
            firstName: sessionParams.onlineAccessInfo?.associated_user.first_name || null,
            lastName: sessionParams.onlineAccessInfo?.associated_user.last_name || null,
            email: sessionParams.onlineAccessInfo?.associated_user.email || null,
            accountOwner: sessionParams.onlineAccessInfo?.associated_user.account_owner || false,
            locale: sessionParams.onlineAccessInfo?.associated_user.locale || null,
            collaborator: sessionParams.onlineAccessInfo?.associated_user.collaborator || false,
            emailVerified: sessionParams.onlineAccessInfo?.associated_user.email_verified || false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }

    private rowToSession(row: Shop): Session {
        const sessionParams: Record<string, boolean | string | number> = {
            id: row.id,
            shop: row.shop,
            shopId: row.shopId,
            state: row.state,
            isOnline: row.isOnline,
            userId: String(row.userId),
            firstName: String(row.firstName),
            lastName: String(row.lastName),
            email: String(row.email),
            locale: String(row.locale),
        };

        if (row.accountOwner !== null) {
            sessionParams.accountOwner = row.accountOwner;
        }

        if (row.collaborator !== null) {
            sessionParams.collaborator = row.collaborator;
        }

        if (row.emailVerified !== null) {
            sessionParams.emailVerified = row.emailVerified;
        }

        if (row.expires) {
            sessionParams.expires = row.expires.getTime();
        }

        if (row.scope) {
            sessionParams.scope = row.scope;
        }

        if (row.accessToken) {
            sessionParams.accessToken = row.accessToken;
        }

        return Session.fromPropertyArray(Object.entries(sessionParams), true) as Session;
    }

    private getSessionTable(): T['shop'] {
        return (this.prisma as any)[this.tableName];
    }
}

export class MissingSessionTableError extends Error {
    constructor(
        message: string,
        public readonly cause: Error,
    ) {
        super(message);
    }
}

export class MissingSessionStorageError extends Error {
    constructor(message: string) {
        super(message);
    }
}

async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
