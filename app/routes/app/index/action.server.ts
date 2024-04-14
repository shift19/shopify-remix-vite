import { type ActionFunctionArgs, json } from '@remix-run/node';
import { StatusCode } from '@shopify/network';
import {
    productOperationQuery,
    type ProductOperationResult,
    type ProductOperationVariables,
    setProductMutation,
    type SetProductResult,
    type SetProductVariables,
} from '~/graphql';
import { authenticate } from '~/shopify.server';
import type { ReturnType } from '~/types';

export const action = async ({ request }: ActionFunctionArgs) => {
    const { admin } = await authenticate.admin(request);
    const color = ['Red', 'Orange', 'Yellow', 'Green'][Math.floor(Math.random() * 4)];

    const {
        data: { productSet: productSetResponse },
    } = (await admin
        .graphql(setProductMutation, {
            variables: {
                input: {
                    title: `${color} Snowboard`,
                    productOptions: [{ name: 'Title', values: [{ name: 'Default Title' }] }],
                    variants: [
                        {
                            optionValues: [
                                {
                                    optionName: 'Title',
                                    name: 'Default Title',
                                },
                            ],
                            // @ts-expect-error - price is required
                            price: '199.99',
                        },
                    ],
                },
            } satisfies SetProductVariables,
        })
        .then((res) => res.json())) as ReturnType<SetProductResult>;

    if (!productSetResponse?.productSetOperation) {
        return json(
            {
                errors: productSetResponse?.userErrors,
            },
            StatusCode.BadRequest,
        );
    }

    let productOperationResponse: ProductOperationResult | undefined;
    do {
        // ...
        const { data } = (await admin
            .graphql(productOperationQuery, {
                variables: {
                    id: productSetResponse.productSetOperation.id,
                } satisfies ProductOperationVariables,
            })
            .then((res) => res.json())) as ReturnType<ProductOperationResult>;
        productOperationResponse = data;

        // wait for 1 second before checking the status again
        await new Promise((resolve) => setTimeout(resolve, 1000));
    } while (productOperationResponse?.productOperation?.status !== 'COMPLETE');

    return json(
        {
            product: productOperationResponse?.productOperation?.product,
        },
        StatusCode.Ok,
    );
};

export type ActionData = typeof action;
