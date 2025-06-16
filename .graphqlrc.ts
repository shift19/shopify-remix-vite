import { ApiType, shopifyApiProject } from '@shopify/api-codegen-preset';
import { ApiVersion } from '@shopify/shopify-api';
import * as fs from 'fs';
import type { IGraphQLConfig } from 'graphql-config';

const apiVersion = ApiVersion.July25;

function getConfig() {
    const config: IGraphQLConfig = {
        projects: {
            default: shopifyApiProject({
                apiType: ApiType.Admin,
                apiVersion: apiVersion,
                documents: ['./app/**/*.{js,ts,jsx,tsx}'],
                outputDir: './app/graphql',
            }),
        },
    };

    let extensions: string[] = [];
    try {
        extensions = fs.readdirSync('./extensions');
    } catch {
        // ignore if no extensions
    }

    for (const entry of extensions) {
        const extensionPath = `./extensions/${entry}`;
        const schema = `${extensionPath}/schema.graphql`;
        if (!fs.existsSync(schema)) {
            continue;
        }
        config.projects[entry] = {
            schema,
            documents: [`${extensionPath}/**/*.graphql`],
        };
    }

    return config;
}

export default getConfig();
