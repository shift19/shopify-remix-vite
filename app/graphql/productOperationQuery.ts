import { graphql, type ResultOf, type VariablesOf } from 'gql.tada';
import { print } from 'graphql';

const productOperation = graphql(`
    #graphql
    query productOperation($id: ID!) {
        productOperation(id: $id) {
            ... on ProductSetOperation {
                id
                status
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
    }
`);

export const productOperationQuery = print(productOperation);
export type ProductOperationVariables = VariablesOf<typeof productOperation>;
export type ProductOperationResult = ResultOf<typeof productOperation>;
