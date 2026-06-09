import bcrypt from "bcrypt";
import prisma from "./lib/prisma.js";

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash(
    "123456",
    10
  );

  await prisma.user.create({
    data: {
      email: "admin@test.com",
      password: hashedPassword,
    },
  });

  console.log("Admin creado");
};

createAdmin();