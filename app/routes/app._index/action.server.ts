import { type ActionFunctionArgs, json } from '@remix-run/node';
import {
    PopulateProductMutation,
    type PopulateProductResult,
    type PopulateProductVariables,
} from '~/graphql/PopulateProductMutation';
import { authenticate } from '~/shopify.server';
import type { ReturnType } from '~/types';

export const action = async ({ request }: ActionFunctionArgs) => {
    const { admin } = await authenticate.admin(request);
    const color = ['Red', 'Orange', 'Yellow', 'Green'][Math.floor(Math.random() * 4)];

    const {
        data: { productCreate: response },
    } = (await admin
        .graphql(PopulateProductMutation, {
            variables: {
                input: {
                    title: `${color} Snowboard`,
                    variants: [{ price: Math.random() * 100 }],
                },
            } as PopulateProductVariables,
        })
        .then((res) => res.json())) as ReturnType<PopulateProductResult>;

    return json({
        product: response?.product,
    });
};

export type ActionData = typeof action;
