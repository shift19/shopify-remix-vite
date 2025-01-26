import { graphql, type ResultOf, type VariablesOf } from 'gql.tada';
import { print } from 'graphql';

const productCreate = graphql(`
    #graphql
    mutation productCreate($product: ProductCreateInput!) {
        productCreate(product: $product) {
            product {
                id
                title
                handle
                status
                variants(first: 10) {
                    edges {
                        node {
                            id
                            price
                            barcode
                            createdAt
                        }
                    }
                }
            }
            userErrors {
                field
                message
            }
        }
    }
`);

export const productCreateMutation = print(productCreate);
export type ProductCreateMutationVariables = VariablesOf<typeof productCreate>;
export type ProductCreateMutationResult = ResultOf<typeof productCreate>;

export type Product = NonNullable<ProductCreateMutationResult['productCreate']>['product'];
