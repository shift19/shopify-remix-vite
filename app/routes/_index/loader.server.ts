import { json, type LoaderFunctionArgs, redirect } from '@remix-run/node';
import { login } from '~/shopify.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);

    if (url.searchParams.get('shop')) {
        throw redirect(`/app?${url.searchParams.toString()}`);
    }

    return json({ showForm: Boolean(login) });
};

export type LoaderData = typeof loader;
