import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { authenticate } from '~/shopify.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    await authenticate.admin(request);

    return json({ apiKey: process.env.SHOPIFY_API_KEY || '' });
};

export type LoaderData = typeof loader;
