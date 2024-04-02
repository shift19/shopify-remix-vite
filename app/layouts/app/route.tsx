import type { HeadersFunction } from '@remix-run/node';
import { Link, Outlet, useLoaderData, useRouteError } from '@remix-run/react';
import { NavMenu } from '@shopify/app-bridge-react';
import polarisStyles from '@shopify/polaris/build/esm/styles.css?url';
import { AppProvider } from '@shopify/shopify-app-remix/react';
import { boundary } from '@shopify/shopify-app-remix/server';
import type { LoaderData } from '~/layouts/app/loader.server';

export { loader } from '~/layouts/app/loader.server';
export const ErrorBoundary = () => boundary.error(useRouteError());
export const headers: HeadersFunction = (headersArgs) => boundary.headers(headersArgs);
export const links = () => [{ rel: 'stylesheet', href: polarisStyles }];

const App = () => {
    const { apiKey } = useLoaderData<LoaderData>();

    return (
        <AppProvider
            isEmbeddedApp
            apiKey={apiKey}
        >
            <NavMenu>
                <Link
                    to='/app'
                    rel='home'
                >
                    Home
                </Link>
                <Link to='/app/additional'>Additional page</Link>
            </NavMenu>
            <Outlet />
        </AppProvider>
    );
};

export default App;
