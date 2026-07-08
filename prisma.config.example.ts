import { defineConfig } from 'prisma/config';

// Copy this to prisma.config.ts and fill in your DATABASE_URL
// (This file IS committed — prisma.config.ts is NOT)
export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL ?? '',
  },
});
