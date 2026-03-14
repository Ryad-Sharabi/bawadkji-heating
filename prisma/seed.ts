import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import * as bcrypt from "bcrypt";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

// Parse mysql://user:password@host:port/database or mysql://user@host:port/database
let user = "";
let password = "";
let host = "";
let port = "3306";
let database = "";
try {
  const u = new URL(url);
  user = decodeURIComponent(u.username);
  password = u.password ? decodeURIComponent(u.password) : "";
  host = u.hostname;
  port = u.port || "3306";
  database = u.pathname.replace(/^\//, "").replace(/\?.*$/, "");
} catch {
  throw new Error("Invalid DATABASE_URL format");
}
const adapter = new PrismaMariaDb({
  host,
  port: parseInt(port, 10),
  user,
  password: password || undefined,
  database,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@bawadkji.com";
  const name = "Mohamad Bawadekji";
  const plainPassword = "Mohamad@933204343";
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("User already exists:", email);
    await prisma.user.update({
      where: { email },
      data: { name, passwordHash },
    });
    console.log("Updated user:", name);
  } else {
    await prisma.user.create({
      data: { email, name, passwordHash },
    });
    console.log("Created user:", name, "| Login:", email);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
