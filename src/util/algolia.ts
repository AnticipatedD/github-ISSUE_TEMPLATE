import algoliasearch from 'algoliasearch';

const algoliaApiKey = import.meta.env.PUBLIC_ALGOLIA_API_KEY;

if (!algoliaApiKey) {
  throw new Error(
    "CRITICAL: PUBLIC_ALGOLIA_API_KEY is not defined in the environment. " +
    "Please check your local .env configuration."
  );
}

export const searchClient = algoliasearch(
  import.meta.env.PUBLIC_ALGOLIA_APP_ID || 'fallback_app_id',
  algoliaApiKey
);
