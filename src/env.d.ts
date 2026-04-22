/// <reference path="../.astro/types.d.ts" />

/**
 * Environment Variable Type Definitions
 * Extends Astro's ImportMeta interface with custom environment variables
 */

interface ImportMetaEnv {
  // Standard Astro environment variables
  readonly NODE_ENV: 'development' | 'production';
  readonly DEPLOYMENT_ENVIRONMENT: 'development' | 'staging' | 'production';
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
  readonly SITE: string;
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}