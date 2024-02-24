import type { HeadersFunction } from '@remix-run/node';
import { Link, Outlet, useLoaderData, useRouteError } from '@remix-run/react';
import { AppProvider } from '@shopify/shopify-app-remix/react';
import '@shopify/polaris/build/esm/styles.css';
import { boundary } from '@shopify/shopify-app-remix/server';
import type { LoaderData } from '~/routes/app/loader.server';

export { loader } from '~/routes/app/loader.server';
export const ErrorBoundary = () => boundary.error(useRouteError());
export const headers: HeadersFunction = (headersArgs) => boundary.headers(headersArgs);

const App = () => {
    const { apiKey } = useLoaderData<LoaderData>();

    return (
        <AppProvider
            isEmbeddedApp
            apiKey={apiKey}
        >
            <ui-nav-menu>
                <Link
                    to='/app'
                    rel='home'
                >
                    Home
                </Link>
                <Link to='/app/additional'>Additional page</Link>
            </ui-nav-menu>
            <Outlet />
        </AppProvider>
    );
};

export default App;
