/**
 * Change an administrator's password and sign them out everywhere.
 *
 *   npm run admin:set-password -- roni@gmail.com
 *
 * The new password is read from NEW_PASSWORD, or typed at a hidden prompt.
 */
import { PrismaClient } from "@prisma/client";

import { hashPassword } from "../lib/auth/password";

const prisma = new PrismaClient();

function promptHidden(question: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!process.stdin.isTTY) return reject(new Error("No TTY available. Set NEW_PASSWORD instead."));
    process.stdout.write(question);
    let value = "";
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    const onData = (chunk: string) => {
      for (const char of chunk) {
        if (char === "\u0003") process.exit(130); // Ctrl+C
        if (char === "\r" || char === "\n") {
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdin.off("data", onData);
          process.stdout.write("\n");
          return resolve(value);
        }
        if (char === "\u007f" || char === "\b") value = value.slice(0, -1);
        else value += char;
      }
    };
    process.stdin.on("data", onData);
  });
}

async function main() {
  const email = (process.argv[2] ?? process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  if (!email) throw new Error("Usage: npm run admin:set-password -- <email>");

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) throw new Error(`No user found with email ${email}.`);

  const password = process.env.NEW_PASSWORD ?? (await promptHidden("New password (min 12 characters): "));
  if (password.length < 12) throw new Error("Password must be at least 12 characters.");

  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(password) } });
  const { count } = await prisma.session.deleteMany({ where: { userId: user.id } });
  console.log(`Password updated for ${email}. ${count} active session(s) were signed out.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
