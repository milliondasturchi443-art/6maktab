import "./_env";
import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import * as readline from "readline/promises";

async function main() {
  const envUser = process.env.ADMIN_USERNAME;
  const envPass = process.env.ADMIN_PASSWORD;
  const envName = process.env.ADMIN_NAME;
  const envEmail = process.env.ADMIN_EMAIL;

  let username = envUser;
  let password = envPass;
  let name = envName;
  let email = envEmail;

  if (!username || !password) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    username = username || (await rl.question("Login: ")).trim();
    const p1 = password || (await rl.question("Parol (kamida 10 ta belgi): "));
    const p2 = password || (await rl.question("Parolni takrorlang: "));
    name = name || (await rl.question("Ism (ixtiyoriy): ")).trim();
    email = email || (await rl.question("Email (ixtiyoriy): ")).trim();
    rl.close();
    if (p1 !== p2) {
      console.error("Xato: parollar mos emas.");
      process.exit(1);
    }
    password = p1;
  }

  if (!username || username.length < 3) {
    console.error("Xato: login kamida 3 ta belgidan iborat bo'lishi kerak.");
    process.exit(1);
  }
  if (!password || password.length < 10) {
    console.error("Xato: parol kamida 10 ta belgidan iborat bo'lishi kerak.");
    process.exit(1);
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error("Xato: email noto'g'ri formatda.");
    process.exit(1);
  }

  const existing = await prisma.admin.findUnique({ where: { username } });
  if (existing) {
    console.error(`Xato: "${username}" nomli administrator allaqachon mavjud.`);
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);
  const admin = await prisma.admin.create({
    data: {
      username,
      password: hash,
      name: name || null,
      email: email || null,
    },
  });
  console.log(`Administrator yaratildi: ${admin.username} (id: ${admin.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
