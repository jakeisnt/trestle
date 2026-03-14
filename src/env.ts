import type { z } from "zod";
import { z as zod } from "zod";

type EnvSchema<T extends string> = Record<
  T,
  {
    type: z.ZodType;
    fallback: z.infer<z.ZodType>;
  }
>;

type EnvType<T extends EnvSchema<string>> = {
  [K in keyof T]: T[K]["type"] extends z.ZodType ? z.infer<T[K]["type"]> : never;
};

const createEnv = <T extends EnvSchema<string>>(schema: T): EnvType<T> => {
  const env = {
    _cache: {} as EnvType<T>,
  };

  for (const [key, config] of Object.entries(schema) as [keyof T, T[keyof T]][]) {
    Object.defineProperty(env, key, {
      get() {
        if (this._cache[key]) {
          return this._cache[key];
        }

        const rawValue = process.env[String(key)] || String(config.fallback);
        const parsedValue = config.type.safeParse(rawValue);

        if (!parsedValue.success) {
          return config.fallback;
        }

        this._cache[key] = parsedValue.data;
        return this._cache[key];
      },
    });
  }

  return env as EnvType<T>;
};

export const env = createEnv({
  ARENA_PAT: { type: zod.string().min(1), fallback: "" },
});
