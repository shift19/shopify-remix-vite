import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import { BlockStack, Box, Button, Card, InlineStack, Layout, Link, List, Page, Text } from '@shopify/polaris';
import { useEffect } from 'react';
import { CREATE_PRODUCT } from '~/actions/intents';
import { createProduct } from '~/actions/products/create.server';
import { handleIntentAction } from '~/actions/utils.server';
import { authenticate } from '~/shopify.server';
import { parseGid } from '~/utils/graphql';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const { session } = await authenticate.admin(request);

    return {
        session,
        shopId: { shopId: session.shopId },
    };
};

export const action = async ({ request }: ActionFunctionArgs) =>
    handleIntentAction(request, {
        [CREATE_PRODUCT]: createProduct,
    });

export { ErrorBoundary } from '~/components/error-boundary';

const IndexPage = () => {
    const loaderData = useLoaderData<typeof loader>();

    const fetcher = useFetcher<typeof action>();

    const shopify = useAppBridge();
    const isLoading = ['loading', 'submitting'].includes(fetcher.state) && fetcher.formMethod === 'POST';

    const product = fetcher.data?.product;
    const variants = fetcher.data?.variants;

    const productId = parseGid(product?.id || '');

    useEffect(() => {
        console.log('Product created:', productId);

        if (productId) {
            shopify.toast.show('Product created');
        }
    }, [productId, shopify]);

    const generateProduct = () =>
        fetcher.submit(
            {
                _intent: CREATE_PRODUCT,
            },
            {
                method: 'POST',
                encType: 'application/json',
            },
        );

    return (
        <Page>
            <TitleBar title='Remix app template' />
            <BlockStack gap='500'>
                <Layout>
                    <Layout.Section>
                        <Card>
                            <BlockStack gap='500'>
                                <BlockStack gap='200'>
                                    <Text
                                        as='h2'
                                        variant='headingMd'
                                    >
                                        Congrats on creating a new Shopify app 🎉
                                    </Text>
                                    <Text
                                        variant='bodyMd'
                                        as='p'
                                    >
                                        This embedded app template uses{' '}
                                        <Link
                                            url='https://shopify.dev/docs/apps/tools/app-bridge'
                                            target='_blank'
                                            removeUnderline
                                        >
                                            App Bridge
                                        </Link>{' '}
                                        interface examples like an{' '}
                                        <Link
                                            url='/app/additional'
                                            removeUnderline
                                        >
                                            additional page in the app nav
                                        </Link>
                                        , as well as an{' '}
                                        <Link
                                            url='https://shopify.dev/docs/api/admin-graphql'
                                            target='_blank'
                                            removeUnderline
                                        >
                                            Admin GraphQL
                                        </Link>{' '}
                                        mutation demo, to provide a starting point for app development.
                                    </Text>
                                </BlockStack>
                                <BlockStack gap='200'>
                                    <Text
                                        as='h3'
                                        variant='headingMd'
                                    >
                                        Get started with products
                                    </Text>
                                    <Text
                                        as='p'
                                        variant='bodyMd'
                                    >
                                        Generate a product with GraphQL and get the JSON output for that product. Learn
                                        more about the{' '}
                                        <Link
                                            url='https://shopify.dev/docs/api/admin-graphql/latest/mutations/productCreate'
                                            target='_blank'
                                            removeUnderline
                                        >
                                            productCreate
                                        </Link>{' '}
                                        mutation in our API references.
                                    </Text>
                                </BlockStack>
                                <InlineStack gap='300'>
                                    <Button
                                        loading={isLoading}
                                        onClick={generateProduct}
                                    >
                                        Generate a product
                                    </Button>
                                    {product && (
                                        <Button
                                            url={`shopify:admin/products/${productId}`}
                                            target='_blank'
                                            variant='plain'
                                        >
                                            View product
                                        </Button>
                                    )}
                                </InlineStack>
                                {product && (
                                    <>
                                        <Text
                                            as='h3'
                                            variant='headingMd'
                                        >
                                            {' '}
                                            productCreate mutation
                                        </Text>
                                        <Box
                                            padding='400'
                                            background='bg-surface-active'
                                            borderWidth='025'
                                            borderRadius='200'
                                            borderColor='border'
                                            overflowX='scroll'
                                        >
                                            <pre style={{ margin: 0 }}>
                                                <code>{JSON.stringify(product, null, 2)}</code>
                                            </pre>
                                        </Box>
                                        <Text
                                            as='h3'
                                            variant='headingMd'
                                        >
                                            {' '}
                                            productVariantsBulkUpdate mutation
                                        </Text>
                                        <Box
                                            padding='400'
                                            background='bg-surface-active'
                                            borderWidth='025'
                                            borderRadius='200'
                                            borderColor='border'
                                            overflowX='scroll'
                                        >
                                            <pre style={{ margin: 0 }}>
                                                <code>{JSON.stringify(variants, null, 2)}</code>
                                            </pre>
                                        </Box>
                                    </>
                                )}
                                <BlockStack gap='200'>
                                    <Text
                                        as='h2'
                                        variant='headingMd'
                                    >
                                        Session data
                                    </Text>
                                    {loaderData && (
                                        <Box
                                            padding='400'
                                            background='bg-surface-active'
                                            borderWidth='025'
                                            borderRadius='200'
                                            borderColor='border'
                                            overflowX='scroll'
                                        >
                                            <pre style={{ margin: 0 }}>
                                                <code>{JSON.stringify(loaderData?.session, null, 2)}</code>
                                            </pre>
                                        </Box>
                                    )}
                                </BlockStack>
                            </BlockStack>
                        </Card>
                    </Layout.Section>
                    <Layout.Section variant='oneThird'>
                        <BlockStack gap='500'>
                            <Card>
                                <BlockStack gap='200'>
                                    <Text
                                        as='h2'
                                        variant='headingMd'
                                    >
                                        App template specs
                                    </Text>
                                    <BlockStack gap='200'>
                                        <InlineStack align='space-between'>
                                            <Text
                                                as='span'
                                                variant='bodyMd'
                                            >
                                                Framework
                                            </Text>
                                            <Link
                                                url='https://remix.run'
                                                target='_blank'
                                                removeUnderline
                                            >
                                                Remix
                                            </Link>
                                        </InlineStack>
                                        <InlineStack align='space-between'>
                                            <Text
                                                as='span'
                                                variant='bodyMd'
                                            >
                                                Database
                                            </Text>
                                            <Link
                                                url='https://www.prisma.io/'
                                                target='_blank'
                                                removeUnderline
                                            >
                                                Prisma
                                            </Link>
                                        </InlineStack>
                                        <InlineStack align='space-between'>
                                            <Text
                                                as='span'
                                                variant='bodyMd'
                                            >
                                                Interface
                                            </Text>
                                            <span>
                                                <Link
                                                    url='https://polaris.shopify.com'
                                                    target='_blank'
                                                    removeUnderline
                                                >
                                                    Polaris
                                                </Link>
                                                {', '}
                                                <Link
                                                    url='https://shopify.dev/docs/apps/tools/app-bridge'
                                                    target='_blank'
                                                    removeUnderline
                                                >
                                                    App Bridge
                                                </Link>
                                            </span>
                                        </InlineStack>
                                        <InlineStack align='space-between'>
                                            <Text
                                                as='span'
                                                variant='bodyMd'
                                            >
                                                API
                                            </Text>
                                            <Link
                                                url='https://shopify.dev/docs/api/admin-graphql'
                                                target='_blank'
                                                removeUnderline
                                            >
                                                GraphQL API
                                            </Link>
                                        </InlineStack>
                                    </BlockStack>
                                </BlockStack>
                            </Card>
                            <Card>
                                <BlockStack gap='200'>
                                    <Text
                                        as='h2'
                                        variant='headingMd'
                                    >
                                        Next steps
                                    </Text>
                                    <List>
                                        <List.Item>
                                            Build an{' '}
                                            <Link
                                                url='https://shopify.dev/docs/apps/getting-started/build-app-example'
                                                target='_blank'
                                                removeUnderline
                                            >
                                                {' '}
                                                example app
                                            </Link>{' '}
                                            to get started
                                        </List.Item>
                                        <List.Item>
                                            Explore Shopify’s API with{' '}
                                            <Link
                                                url='https://shopify.dev/docs/apps/tools/graphiql-admin-api'
                                                target='_blank'
                                                removeUnderline
                                            >
                                                GraphiQL
                                            </Link>
                                        </List.Item>
                                    </List>
                                </BlockStack>
                            </Card>
                        </BlockStack>
                    </Layout.Section>
                </Layout>
            </BlockStack>
        </Page>
    );
};

export default IndexPage;
