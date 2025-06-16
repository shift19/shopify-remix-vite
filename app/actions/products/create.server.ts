import { CREATE_PRODUCT } from '~/actions/intents';
import { authenticateRequestIntent } from '~/actions/utils.server';
import type { ProductCreateMutation, ProductVariantsBulkUpdateMutation } from '~/graphql/admin.generated';
import { productCreate } from '~/graphql/mutations/product-create';
import { productVariantsBulkUpdate } from '~/graphql/mutations/product-variants-bulk-update';
import { authenticate } from '~/shopify.server';
import { nodesFromEdges } from '~/utils/graphql';

type CreateProductProps = {
    request: Request;
};

export { CREATE_PRODUCT } from '~/actions/intents';

export type CreateProductResult = {
    product: NonNullable<NonNullable<ProductCreateMutation['productCreate']>['product']>;
    variants: NonNullable<
        NonNullable<NonNullable<ProductVariantsBulkUpdateMutation['productVariantsBulkUpdate']>['productVariants']>
    >;
};

export const createProduct = async ({ request }: CreateProductProps): Promise<CreateProductResult> => {
    await authenticateRequestIntent(request, CREATE_PRODUCT);

    const { admin } = await authenticate.admin(request);
    const color = ['Red', 'Orange', 'Yellow', 'Green'][Math.floor(Math.random() * 4)];

    const { data: productData } = await admin
        .graphql(productCreate, {
            variables: {
                product: {
                    //title: `${color} Snowboard`,
                },
            },
        })
        .then((res) => res.json());

    const product = productData?.productCreate?.product;

    if (!product) {
        throw Response.json({
            error: 'Failed to create product',
        });
    }

    const [variant] = nodesFromEdges(product.variants.edges);

    const { data: updatedVariantsData } = await admin
        .graphql(productVariantsBulkUpdate, {
            variables: {
                productId: product.id,
                variants: [{ id: variant.id, price: '100.00' }],
            },
        })
        .then((res) => res.json());

    const variants = updatedVariantsData?.productVariantsBulkUpdate?.productVariants ?? [];

    return {
        product,
        variants,
    };
};
