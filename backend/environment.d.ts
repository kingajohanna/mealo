declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    HOST: string;
    DB_URL: string;
    SCRAPER_URL: string;
  }
}
