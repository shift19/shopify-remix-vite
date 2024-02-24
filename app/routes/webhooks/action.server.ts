import type { ActionFunctionArgs } from '@remix-run/node';
import { authenticate } from '~/shopify.server';

export const action = async ({ request }: ActionFunctionArgs) => {
    const { topic, admin } = await authenticate.webhook(request);

    if (!admin) {
        // The admin context isn't returned if the webhook fired after a shop was uninstalled.
        throw new Response();
    }

    switch (topic) {
        case 'APP_UNINSTALLED':
        case 'CUSTOMERS_DATA_REQUEST':
        case 'CUSTOMERS_REDACT':
        case 'SHOP_REDACT':
            break;
        default:
            throw new Response('Unhandled webhook topic', { status: 404 });
    }

    throw new Response();
};

export type ActionData = typeof action;
