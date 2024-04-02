import { vitePlugin as remix } from '@remix-run/dev';

export default () =>
    remix({
        ignoredRouteFiles: ['**/*.*'],
        future: {},
        routes: (defineRoutes) =>
            defineRoutes((route) => {
                route('', 'routes/index/route.tsx', { index: true });

                route('app', 'layouts/app/route.tsx', () => {
                    route('', 'routes/app/index/route.tsx', { index: true });
                    route('additional', 'routes/app/additional/route.tsx');
                });

                route('auth', 'layouts/auth/route.tsx', () => {
                    route('*', 'routes/auth/$auth/route.tsx');
                    route('login', 'routes/auth/login/route.tsx');
                });

                route('webhooks', 'routes/webhooks/route.tsx');
            }),
    });
