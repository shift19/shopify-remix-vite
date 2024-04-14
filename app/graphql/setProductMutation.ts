import { graphql, type ResultOf, type VariablesOf } from 'gql.tada';
import { print } from 'graphql';

const setProduct = graphql(`
    #graphql
    mutation setProduct($input: ProductSetInput!) {
        productSet(input: $input) {
            productSetOperation {
                id
                status
                userErrors {
                    code
                    field
                    message
                }
            }
            userErrors {
                field
                message
            }
        }
    }
`);

export const setProductMutation = print(setProduct);
export type SetProductVariables = VariablesOf<typeof setProduct>;
export type SetProductResult = ResultOf<typeof setProduct>;
