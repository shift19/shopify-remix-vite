import { CREATE_PRODUCT } from '~/actions/_intents';
import { authenticateRequestIntent } from '~/actions/utils.server';
import {
    type Product,
    productCreateMutation,
    type ProductCreateMutationResult,
} from '~/graphql/mutations/productCreateMutation';
import {
    type ProductVariant,
    productVariantsBulkUpdateMutation,
    type ProductVariantsBulkUpdateMutationResult,
} from '~/graphql/mutations/productVariantsBulkUpdateMutation';
import { authenticate } from '~/shopify.server';
import type { GraphqlApiResponse } from '~/types/graphql-api.types';
import { nodesFromEdges } from '~/utils/graphql';

type CreateProductProps = {
    request: Request;
};

type CreateProductResult = {
    message?: string;
    product?: Product | null;
    variants?: ProductVariant[] | null;
};

export const createProduct = async ({ request }: CreateProductProps): Promise<CreateProductResult> => {
    await authenticateRequestIntent(request, CREATE_PRODUCT);

    const { admin } = await authenticate.admin(request);
    const color = ['Red', 'Orange', 'Yellow', 'Green'][Math.floor(Math.random() * 4)];

    const { data: productData } = await admin
        .graphql(productCreateMutation, {
            variables: {
                product: {
                    title: `${color} Snowboard`,
                },
            },
        })
        .then((res) => res.json() as Promise<GraphqlApiResponse<ProductCreateMutationResult>>);

    const product = productData.productCreate?.product;

    if (!product) {
        return {
            message: 'Product not created',
        };
    }

    const [variant] = nodesFromEdges(product.variants.edges);

    const { data: updatedVariantsData } = await admin
        .graphql(productVariantsBulkUpdateMutation, {
            variables: {
                productId: product.id,
                variants: [{ id: variant.id, price: '100.00' }],
            },
        })
        .then((res) => res.json() as Promise<GraphqlApiResponse<ProductVariantsBulkUpdateMutationResult>>);

    const variants = updatedVariantsData.productVariantsBulkUpdate?.productVariants;

    return {
        product,
        variants,
    };
};
