// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // allow global prisma to avoid too many clients in dev
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({ log: ["error"] });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
