import { json } from '@remix-run/node';
import { StatusCode } from '@shopify/network';
import { CREATE_PRODUCT } from '~/actions/_intents';
import { checkRequestIntent, InvalidIntentError } from '~/actions/utils.server';
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

type CreateProductProps = {
    request: Request;
};

export const createProduct = async ({ request }: CreateProductProps) => {
    if (await checkRequestIntent(request, CREATE_PRODUCT)) {
        return json(
            {
                product: null,
                ...InvalidIntentError,
            },
            StatusCode.BadRequest,
        );
    }

    const { admin } = await authenticate.admin(request);
    const color = ['Red', 'Orange', 'Yellow', 'Green'][Math.floor(Math.random() * 4)];

    const {
        data: { productSet: productSetResponse },
    } = await admin
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
                            price: '199.99',
                        },
                    ],
                },
            } as SetProductVariables,
        })
        .then((res) => res.json())
        .catch((error) => {
            console.error('Error creating product:', error);
            return {
                productSet: {
                    productSetOperation: null,
                    userErrors: [{ field: 'product', message: 'Error creating product' }],
                },
            };
        })
        .then((data) => data as ReturnType<SetProductResult>);

    if (!productSetResponse?.productSetOperation) {
        return json(
            {
                product: null,
                errors: productSetResponse?.userErrors,
            },
            StatusCode.BadRequest,
        );
    }

    let productOperationResponse: ProductOperationResult | undefined;
    do {
        const { data } = await admin
            .graphql(productOperationQuery, {
                variables: {
                    id: productSetResponse.productSetOperation.id,
                } as ProductOperationVariables,
            })
            .then(async (res) => res.json())
            .catch((error) => {
                console.error('Error fetching product operation:', error);
                return {
                    productOperation: {
                        product: null,
                        status: 'COMPLETE',
                        userErrors: [{ field: 'product', message: 'Error fetching product operation' }],
                    },
                };
            })
            .then((data) => data as ReturnType<ProductOperationResult>);

        productOperationResponse = data;

        // wait for 1 second before checking the status again
        await new Promise((resolve) => setTimeout(resolve, 1000));
    } while (productOperationResponse?.productOperation?.status !== 'COMPLETE');

    return json(
        {
            product: productOperationResponse?.productOperation?.product,
            errors: productOperationResponse?.productOperation?.userErrors,
        },
        StatusCode.Ok,
    );
};
