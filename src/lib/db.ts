/**
 * عميل Prisma singleton – يمنع فتح اتصالات متعددة بقاعدة البيانات
 * (مهم في Next.js وبيئات serverless لتجنب استنزاف الاتصالات)
 * Prisma 7: يستخدم adapter لـ MySQL.
 *
 * Prisma Client singleton – prevents opening multiple DB connections.
 * Prisma 7: uses adapter for MySQL.
 */

import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrisma() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  let host = "";
  let port = 3306;
  let user = "";
  let password = "";
  let database = "";
  try {
    const u = new URL(url);
    user = decodeURIComponent(u.username);
    password = u.password ? decodeURIComponent(u.password) : "";
    host = u.hostname;
    port = u.port ? parseInt(u.port, 10) : 3306;
    database = u.pathname.replace(/^\//, "").replace(/\?.*$/, "");
  } catch {
    throw new Error("Invalid DATABASE_URL format");
  }
  const adapter = new PrismaMariaDb({
    host,
    port,
    user,
    password: password || undefined,
    database,
    connectionLimit: 5,
  });
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
