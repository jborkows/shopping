/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly FIREBASE_PRIVATE_KEY_ID: string;
  readonly FIREBASE_PRIVATE_KEY: string;
  readonly FIREBASE_PROJECT_ID: string;
  readonly FIREBASE_CLIENT_EMAIL: string;
  readonly FIREBASE_CLIENT_ID: string;
  readonly FIREBASE_AUTH_URI: string;
  readonly FIREBASE_TOKEN_URI: string;
  readonly FIREBASE_AUTH_CERT_URL: string;
  readonly FIREBASE_CLIENT_CERT_URL: string;

  readonly STRO_API_KEY: string;
  readonly PUBLIC_AUTH_DOMAIN: string;
  readonly PUBLIC_PROJECT_ID: string;
  readonly PUBLIC_STORAGE_BUCKET: string;
  readonly PUBLIC_MESSAGING_SENDER_ID: string;
  readonly PUBLIC_APP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
