import { graphql, type ResultOf, type VariablesOf } from 'gql.tada';
import { print } from 'graphql';

const PopulateProduct = graphql(`
    #graphql
    mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
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
        }
    }
`);

export const PopulateProductMutation = print(PopulateProduct);
export type PopulateProductVariables = VariablesOf<typeof PopulateProduct>;
export type PopulateProductResult = ResultOf<typeof PopulateProduct>;
