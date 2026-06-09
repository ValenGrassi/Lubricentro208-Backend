import prisma from "../lib/prisma.js";

export const createVehicle = async (
  req,
  res
) => {
  try {
    const {
      plate,
      mileage,
      nextServiceMileage,

      brand,
      model,

      ownerName,
      phone,

      oilType,

      oilFilter,
      airFilter,
      fuelFilter,
      cabinFilter,

      notes,

      serviceDate,
    } = req.body

    if (!plate || !mileage) {
      return res.status(400).json({
        message:
          "Patente y kilometraje son obligatorios",
      })
    }

    const normalizedPlate = plate
      .toUpperCase()
      .replace(/-/g, "")
      .replace(/\s/g, "")

    const vehicle =
      await prisma.vehicle.create({
        data: {
          plate: normalizedPlate,

          mileage:
            Number(mileage),
          
          nextServiceMileage:
            nextServiceMileage
              ? Number(nextServiceMileage)
              : null,

          brand,
          model,

          ownerName,
          phone,

          oilType,

          oilFilter:
            oilFilter || false,

          airFilter:
            airFilter || false,

          fuelFilter:
            fuelFilter || false,
          
          cabinFilter:
            cabinFilter || false,

          notes,

          serviceDate:
          serviceDate
          ? new Date(`${serviceDate}T12:00:00`)
          : new Date(),
        },
      })

    res.status(201).json(vehicle)
  } catch (error) {
    res.status(500).json(error)
  }
}

export const getVehicles = async (
  req,
  res
) => {
  try {
    const vehicles =
      await prisma.vehicle.findMany({
        orderBy: {
          id: "desc",
        },
      });

    res.json(vehicles);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const searchVehicle =
  async (req, res) => {
    try {
      const { plate } = req.params;

      const normalizedPlate = plate
        .toUpperCase()
        .replace(/-/g, "")
        .replace(/\s/g, "");

      const vehicle =
        await prisma.vehicle.findUnique({
          where: {
            plate: normalizedPlate,
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

  export const updateVehicle =
  async (req, res) => {
    try {
      const { id } = req.params

      const vehicle =
        await prisma.vehicle.update({
          where: {
            id: Number(id),
          },

          data: {
            ...req.body,

            mileage: req.body
              .mileage
              ? Number(
                  req.body
                    .mileage
                )
              : undefined,

              serviceDate:
              req.body.serviceDate
                ? new Date(
                    `${req.body.serviceDate}T12:00:00`
                  )
                : undefined,
              nextServiceMileage:
                req.body
                  .nextServiceMileage
                  ? Number(
                      req.body
                        .nextServiceMileage
                    )
                  : null,
          },
        })

      res.json(vehicle)
    } catch (error) {
      res.status(500).json(error)
    }
  }

export const deleteVehicle =
  async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.vehicle.delete({
        where: {
          id: Number(id),
        },
      });

      res.json({
        message:
          "Vehículo eliminado",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  };