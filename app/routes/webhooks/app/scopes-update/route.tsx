import type { ActionFunctionArgs } from '@remix-run/node';
import { StatusCode } from '@shopify/network';
import db from '~/db.server';
import { authenticate } from '~/shopify.server';

export const action = async ({ request }: ActionFunctionArgs) => {
    const { payload, session, topic, shop } = await authenticate.webhook(request);

    console.log(`Received ${topic} webhook for ${shop}`);

    const current: string[] = payload.current;

    if (session) {
        await db.shop.update({
            where: {
                id: session.id,
            },
            data: {
                scope: current.toString(),
            },
        });
    }

    return Response.json({ message: 'Webhook received' }, { status: StatusCode.Ok });
};
