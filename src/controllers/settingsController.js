import prisma from "../lib/prisma.js";

// Devuelve la config (creándola con valores por defecto si todavía no existe).
export const getSettings = async (req, res) => {
  try {
    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });

    res.json(settings);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { serviceIntervalMonths } = req.body;

    const months = Number(serviceIntervalMonths);

    if (!Number.isInteger(months) || months < 1 || months > 60) {
      return res.status(400).json({
        message: "El intervalo debe ser un número entre 1 y 60 meses.",
      });
    }

    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: { serviceIntervalMonths: months },
      create: { id: 1, serviceIntervalMonths: months },
    });

    res.json(settings);
  } catch (error) {
    res.status(500).json(error);
  }
};
