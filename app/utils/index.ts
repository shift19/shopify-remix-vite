export const getRequestIntent = async (request: Request): Promise<string> => {
    const { _intent } = await request.clone().json();
    return _intent;
};
