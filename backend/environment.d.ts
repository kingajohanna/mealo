declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    HOST: string;
    DB_URL: string;
    SCRAPER_URL: string;
    API_KEY: string;
    AUTH_DOMAIN: string;
    PROJECT_ID: string;
    STORAGE_BUCKET: string;
    MESSAGING_SENDER_ID: string;
    DATABASE_URL: string;
    APP_ID: string;
  }
}
