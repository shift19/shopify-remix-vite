import '@shopify/shopify-app-remix/adapters/node';
import { restResources } from '@shopify/shopify-api/rest/admin/2024-07';
import { ApiVersion, AppDistribution, shopifyApp } from '@shopify/shopify-app-remix/server';
import prisma from '~/db.server';
import { PrismaSessionStorage } from '~/session.server';

export const apiVersion = ApiVersion.July24;

const shopify = shopifyApp({
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
    apiVersion,
    scopes: process.env.SCOPES?.split(','),
    appUrl: process.env.SHOPIFY_APP_URL || '',
    authPathPrefix: '/auth',
    sessionStorage: new PrismaSessionStorage(prisma),
    distribution: AppDistribution.AppStore,
    restResources,
    future: {
        unstable_newEmbeddedAuthStrategy: true,
    },
    ...(process.env.SHOP_CUSTOM_DOMAIN ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] } : {}),
});

export default shopify;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const sessionStorage = shopify.sessionStorage;
