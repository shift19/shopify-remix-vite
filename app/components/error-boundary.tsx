import { isRouteErrorResponse, useRouteError } from '@remix-run/react';
import { TitleBar } from '@shopify/app-bridge-react';
import { BlockStack, Button, Card, Layout, Page, Text } from '@shopify/polaris';

export const ErrorBoundary = () => {
    const error = useRouteError();
    let message = "We've encountered a problem, please try again. Sorry!";

    if (error instanceof Error) {
        message = error.message;
    }

    if (isRouteErrorResponse(error)) {
        message = error.data;
    }

    return (
        <Page>
            <Layout>
                <Layout.Section>
                    <TitleBar title='Error' />
                    <Card>
                        <BlockStack
                            gap='400'
                            align='center'
                        >
                            <Text
                                as='h1'
                                variant='headingMd'
                                tone={'critical'}
                            >
                                Oops! Something went wrong.
                            </Text>
                            <Text
                                as='p'
                                variant='bodyLg'
                                tone='subdued'
                            >
                                {message}
                            </Text>
                            <Button
                                url='/app'
                                variant='primary'
                                size='large'
                            >
                                Go back to the app
                            </Button>
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
};
