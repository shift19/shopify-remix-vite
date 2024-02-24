export type Extensions = {
    cost: ExtensionCost;
};

export type ExtensionCost = {
    requestedQueryCost: number;
    actualQueryCost: number;
    throttleStatus: ExtensionTrottleStatus;
};

export type ExtensionTrottleStatus = {
    maximumAvailable: number;
    currentlyAvailable: number;
    restoreRate: number;
};

export type ReturnType<T> = {
    data: T;
    extensions: Extensions;
};
