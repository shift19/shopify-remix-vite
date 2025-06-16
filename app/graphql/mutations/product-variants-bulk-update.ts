export const productVariantsBulkUpdate = `
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
`;
