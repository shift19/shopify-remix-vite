import { graphql, type ResultOf, type VariablesOf } from 'gql.tada';
import { print } from 'graphql';

const productVariantsBulkUpdate = graphql(`
    #graphql
    mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
            productVariants {
                id
                price
                barcode
                createdAt
            }
            userErrors {
                field
                message
            }
        }
    }
`);

export const productVariantsBulkUpdateMutation = print(productVariantsBulkUpdate);
export type ProductVariantsBulkUpdateMutationVariables = VariablesOf<typeof productVariantsBulkUpdate>;
export type ProductVariantsBulkUpdateMutationResult = ResultOf<typeof productVariantsBulkUpdate>;

export type ProductVariants = NonNullable<
    ProductVariantsBulkUpdateMutationResult['productVariantsBulkUpdate']
>['productVariants'];

export type ProductVariant = NonNullable<ProductVariants>[number];
