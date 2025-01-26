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
 * @returns {Promise<string>}
 */
export const getRequestIntent = async (request: Request): Promise<string> => {
    const { _intent } = await request.clone().json();
    return _intent;
};

/**
 * Check if the intent of a request is the expected one
 *
 * @param {Request} request
 * @param {string} intent
 * @returns {Promise<boolean>}
 */
export const checkRequestIntent = async (request: Request, intent: string) => {
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
