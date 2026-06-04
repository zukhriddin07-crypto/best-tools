import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

let prismaInstance: PrismaClient | null = null;

function getPrisma(): PrismaClient {
  if (!prismaInstance) {
    const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    prismaInstance = new PrismaClient({
      adapter,
      log: ["query"],
    });
  }
  return prismaInstance;
}

// Lazy-loaded Prisma Client proxy to avoid constructor evaluation during Next.js build-time
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    const instance = getPrisma();
    const value = Reflect.get(instance, prop);
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});
