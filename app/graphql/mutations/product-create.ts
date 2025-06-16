export const productCreate = `
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
`;
