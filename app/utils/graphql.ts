const GID_REGEXP = /\/(\w[\w-]*)(?:\?(.*))*$/;

export type Gid<Namespace extends string, Type extends string> = `gid://${Namespace}/${Type}/${number | string}`;
export type ShopifyGid<T extends string> = Gid<'shopify', T>;

export const parseGid = (gid: string): string => {
    const matches = GID_REGEXP.exec(`/${gid}`);
    if (matches?.[1]) return matches[1];
    return '';
};

export const composeGidFactory =
    <N extends string>(namespace: N) =>
    <T extends string>(key: T, id: number | string, params: Record<string, string> = {}): Gid<N, T> => {
        const gid = `gid://${namespace}/${key}/${id}`;
        const paramString = new URLSearchParams(params).toString();
        return paramString ? (`${gid}?${paramString}` as Gid<N, T>) : (gid as Gid<N, T>);
    };

export const composeGid = composeGidFactory('shopify');

type Edge<T> = {
    node: T;
};

export const nodesFromEdges = <T>(edges: Edge<T>[]): T[] => edges.map(({ node }) => node);

export const keyFromEdges = <T, K extends keyof T>(edges: Edge<T>[], key: K): T[K][] =>
    edges.map(({ node }) => node[key]);
