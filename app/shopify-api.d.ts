/**
 * Overwrite the Session class from the Shopify API to add some missing properties and methods.
 */

import { OnlineAccessInfo } from '@shopify/shopify-api/dist/ts/lib/auth/oauth/types';
import { AuthScopes } from '@shopify/shopify-api/dist/ts/lib/auth/scopes';

declare module '@shopify/shopify-api' {
    export class Session {
        static fromPropertyArray(entries: [string, string | number | boolean][], returnUserData?: boolean): Session;
        /**
         * The unique identifier for the session.
         */
        readonly id: string;
        /**
         * The unique identifier for the session.
         */
        readonly shopId: number;
        /**
         * The Shopify shop domain, such as `example.myshopify.com`.
         */
        shop: string;
        /**
         * The state of the session. Used for the OAuth authentication code flow.
         */
        state: string;
        /**
         * Whether the access token in the session is online or offline.
         */
        isOnline: boolean;
        /**
         * The desired scopes for the access token, at the time the session was created.
         */
        scope?: string;
        /**
         * The date the access token expires.
         */
        expires?: Date;
        /**
         * The access token for the session.
         */
        accessToken?: string;
        /**
         * Information on the user for the session. Only present for online sessions.
         */
        onlineAccessInfo?: OnlineAccessInfo;

        constructor(params: SessionParams);
        /**
         * Whether the session is active. Active sessions have an access token that is not expired, and has has the given
         * scopes if scopes is equal to a truthy value.
         */
        isActive(scopes: AuthScopes | string | string[] | undefined): boolean;
        /**
         * Whether the access token includes the given scopes if they are provided.
         */
        isScopeChanged(scopes: AuthScopes | string | string[] | undefined): boolean;
        /**
         * Whether the access token includes the given scopes.
         */
        isScopeIncluded(scopes: AuthScopes | string | string[]): boolean;
        /**
         * Whether the access token is expired.
         */
        isExpired(withinMillisecondsOfExpiry?: number): boolean;
        /**
         * Converts an object with data into a Session.
         */
        toObject(): SessionParams;
        /**
         * Checks whether the given session is equal to this session.
         */
        equals(other: Session | undefined): boolean;
        /**
         * Converts the session into an array of key-value pairs.
         */
        toPropertyArray(returnUserData?: boolean): [string, string | number | boolean][];
    }
}
