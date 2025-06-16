import type { ActionFunctionArgs } from '@remix-run/node';
import { StatusCode } from '@shopify/network';

export type InvalidIntentResponse = {
    message: string;
};

/**
 * Response to send when the intent of a request is not the expected one
 *
 * @type InvalidIntentResponse
 */
export const INVALID_INTENT_RESPONSE: InvalidIntentResponse = {
    message: 'Intent not allowed for this request - Unauthorized',
};

/**
 * Get the intent of a request from the request body
 *
 * @param {Request} request
 * @returns {Promise<string | undefined>}
 */
export const getRequestIntent = async (request: Request): Promise<string | undefined> => {
    const { _intent } = (await request.clone().json()) as { _intent?: string };
    return _intent;
};

/**
 * Check if the intent of a request is the expected one
 *
 * @param {Request} request
 * @param {string} intent
 * @returns {Promise<boolean>}
 */
export const checkRequestIntent = async (request: Request, intent: string): Promise<boolean> => {
    const _intent = await getRequestIntent(request);
    return _intent === intent;
};

/**
 * Authenticate the intent of a request, throwing a response if it is not the expected one
 *
 * @param {Request} request
 * @param {string} intent
 */
export const authenticateRequestIntent = async (request: Request, intent: string) => {
    const isValid = await checkRequestIntent(request, intent);
    if (!isValid) {
        throw Response.json(INVALID_INTENT_RESPONSE, {
            status: StatusCode.Unauthorized,
            statusText: 'Unauthorized',
        });
    }
};

/**
 * Handles an action based on the intent provided in the request body.
 * Makes sure the intent is valid at compile time and runtime
 * Returns the same type as the handler that gets called
 */
export const handleIntentAction = async <THandlers extends Record<string, (args: ActionFunctionArgs) => Promise<any>>>(
    request: Request,
    handlers: THandlers,
): Promise<Awaited<ReturnType<THandlers[keyof THandlers]>>> => {
    const intent = await getRequestIntent(request);

    if (!intent) {
        throw Response.json(INVALID_INTENT_RESPONSE, {
            status: StatusCode.Unauthorized,
            statusText: 'Unauthorized',
        });
    }

    if (intent in handlers) {
        return handlers[intent]({ request } as ActionFunctionArgs);
    }

    throw Response.json(INVALID_INTENT_RESPONSE, {
        status: StatusCode.Unauthorized,
        statusText: 'Unauthorized',
    });
};
