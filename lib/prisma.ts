import { PrismaClient } from "@prisma/client";

let prismaInstance: PrismaClient | null = null;

function getPrisma(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
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
