import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { AppProvider as PolarisAppProvider, Button, Card, FormLayout, Page, Text, TextField } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import { useState } from 'react';
import type { ActionData } from '~/routes/auth/login/action.server';
import type { LoaderData } from '~/routes/auth/login/loader.server';

export { loader } from '~/routes/auth/login/loader.server';
export { action } from '~/routes/auth/login/action.server';

const Login = () => {
    const loaderData = useLoaderData<LoaderData>();
    const actionData = useActionData<ActionData>();

    const [shop, setShop] = useState('');
    const { errors } = actionData || loaderData;

    return (
        <PolarisAppProvider i18n={loaderData.polarisTranslations}>
            <Page>
                <Card>
                    <Form method='post'>
                        <FormLayout>
                            <Text
                                variant='headingMd'
                                as='h2'
                            >
                                Log in
                            </Text>
                            <TextField
                                type='text'
                                name='shop'
                                label='Shop domain'
                                helpText='example.myshopify.com'
                                value={shop}
                                onChange={setShop}
                                autoComplete='on'
                                error={errors.shop}
                            />
                            <Button submit>Log in</Button>
                        </FormLayout>
                    </Form>
                </Card>
            </Page>
        </PolarisAppProvider>
    );
};

export default Login;
