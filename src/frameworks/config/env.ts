import {z} from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('3000').transform(Number),
    DATABASE_URL: z.string().optional(),
    USE_IN_MEMORY_DB: z.string().default('true').transform(val => val === 'true'),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;