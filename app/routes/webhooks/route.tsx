import type { ActionFunctionArgs } from '@remix-run/node';
import { StatusCode } from '@shopify/network';
import db from '~/db.server';
import { authenticate } from '~/shopify.server';

export const action = async ({ request }: ActionFunctionArgs) => {
    const { topic, shop, session, admin, webhookId } = await authenticate.webhook(request);

    if (!admin) {
        // The admin context isn't returned if the webhook fired after a shop was uninstalled.
        throw new Response();
    }

    console.log('Webhook received:', webhookId, topic, shop);

    // The topics handled here should be declared in the shopify.app.toml.
    // More info: https://shopify.dev/docs/apps/build/cli-for-apps/app-configuration
    switch (topic) {
        case 'APP_UNINSTALLED':
            if (session) {
                await db.session.deleteMany({ where: { shop } });
            }

            break;
        case 'PRODUCTS_CREATE':
            console.log('Product created');
            break;
        case 'CUSTOMERS_DATA_REQUEST':
        case 'CUSTOMERS_REDACT':
        case 'SHOP_REDACT':
        default:
            throw new Response('Unhandled webhook topic', { status: StatusCode.NotFound });
    }

    throw new Response();
};
