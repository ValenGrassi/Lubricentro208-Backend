import prisma from "../lib/prisma.js";

export const searchPlate = async (
  req,
  res
) => {
  try {
    const { plate } = req.params;

    const vehicle =
      await prisma.vehicle.findUnique({
        where: {
          plate: plate.toUpperCase(),
        },
        include: {
          services: {
            orderBy: {
              date: "desc",
            },
            take: 1,
          },
        },
      });

    if (!vehicle) {
      return res.status(404).json({
        message:
          "Vehículo no encontrado",
      });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(500).json(error);
  }
};