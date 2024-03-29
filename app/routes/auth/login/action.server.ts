import { type ActionFunctionArgs, json } from '@remix-run/node';
import { loginErrorMessage } from '~/routes/auth/login/error.server';
import { login } from '~/shopify.server';

export const action = async ({ request }: ActionFunctionArgs) => {
    const errors = loginErrorMessage(await login(request));

    return json({
        errors,
    });
};

export type ActionData = typeof action;
