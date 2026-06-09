import prisma from "../lib/prisma.js";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

export const login = async (
  req,
  res
) => {
  try {
    const { email, password } = req.body;

    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (!user) {
      return res.status(401).json({
        message: "Usuario incorrecto",
      });
    }

    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!validPassword) {
      return res.status(401).json({
        message: "Password incorrecta",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};