import { useActionData, useNavigation, useSubmit } from '@remix-run/react';
import { TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import { BlockStack, Box, Button, Card, InlineStack, Layout, Link, List, Page, Text } from '@shopify/polaris';
import { useEffect } from 'react';
import type { ActionData } from '~/routes/app/index/action.server';

export { loader } from '~/routes/app/index/loader.server';
export { action } from '~/routes/app/index/action.server';

const Index = () => {
    const nav = useNavigation();
    const actionData = useActionData<ActionData>();
    const submit = useSubmit();
    const shopify = useAppBridge();

    const isLoading = ['loading', 'submitting'].includes(nav.state) && nav.formMethod === 'POST';
    const productId = String(actionData?.product?.id).replace('gid://shopify/Product/', '');

    useEffect(() => {
        if (productId) {
            shopify.toast.show('Product created');
        }
    }, [productId]);

    const generateProduct = () => submit({}, { replace: true, method: 'POST' });

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
                                    {actionData?.product && (
                                        <Button
                                            url={`shopify:admin/products/${productId}`}
                                            target='_blank'
                                            variant='plain'
                                        >
                                            View product
                                        </Button>
                                    )}
                                </InlineStack>
                                {actionData?.product && (
                                    <Box
                                        padding='400'
                                        borderWidth='025'
                                        borderRadius='200'
                                        borderColor='border'
                                        overflowX='scroll'
                                    >
                                        <pre style={{ margin: 0 }}>
                                            <code>{JSON.stringify(actionData.product, null, 2)}</code>
                                        </pre>
                                    </Box>
                                )}
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

export default Index;