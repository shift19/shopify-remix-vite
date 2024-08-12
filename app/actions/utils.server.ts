export const getRequestIntent = async (request: Request): Promise<string> => {
    const { _intent } = await request.clone().json();
    return _intent;
};

export const InvalidIntentError = {
    errors: [
        {
            field: '_intent',
            message: 'Invalid intent'
        }
    ]
};

export const checkRequestIntent = async (request: Request, intent: string) => {
    const _intent = await getRequestIntent(request);
    return _intent === intent;
};
