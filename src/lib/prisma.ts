import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const adapter = new PrismaPg(pool);

const PrismaClientAdapter = () => {
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof PrismaClientAdapter>;
}

export const prisma = globalThis.prismaGlobal ?? PrismaClientAdapter(); // Check if it exists else create a new client

if (!globalThis.prismaGlobal) {
  globalThis.prismaGlobal = prisma;
}
