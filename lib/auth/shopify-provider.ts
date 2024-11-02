// File: lib/auth/shopify-provider.ts
import { OAuthConfig, OAuthUserConfig } from 'next-auth/providers';

export interface ShopifyProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export default function ShopifyProvider<P extends ShopifyProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: 'shopify',
    name: 'Shopify',
    type: 'oauth',
    authorization: {
      url: `https://${options.storeDomain}/oauth/authorize`,
      params: {
        scope: 'read_customers write_customers',
        response_type: 'code',
        client_id: options.clientId
      }
    },
    token: {
      url: `https://${options.storeDomain}/oauth/token`,
      async request({ client, params, checks }) {
        const response = await client.oauthCallback(options.storeDomain, params, checks);
        return { tokens: response };
      }
    },
    userinfo: {
      url: `https://${options.storeDomain}/api/2023-01/graphql.json`,
      async request({ tokens, client }) {
        const response = await client.userinfo(tokens.access_token);
        return response;
      }
    },
    profile(profile) {
      return {
        id: profile.id,
        email: profile.email,
        name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
        image: null
      };
    },
    style: {
      logo: '/shopify-logo.svg',
      logoDark: '/shopify-logo-dark.svg',
      bg: '#fff',
      text: '#000',
      bgDark: '#000',
      textDark: '#fff'
    },
    options
  };
}
