import { json, type LoaderFunctionArgs } from '@remix-run/node';

import polarisTranslations from '@shopify/polaris/locales/en.json';
import { loginErrorMessage } from '~/routes/auth/login/error.server';
import { login } from '~/shopify.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const errors = loginErrorMessage(await login(request));

    return json({ errors, polarisTranslations });
};

export type LoaderData = typeof loader;
