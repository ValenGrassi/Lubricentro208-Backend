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
    if (error?.code === "P2002") {
      return res.status(409).json({
        message:
          "Ya existe un vehículo con esa patente. Buscalo para editarlo.",
      })
    }
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

      // recontacto no se modifica de forma directa desde el form de edición:
      // se maneja con markRecontacted y con el reset automático de acá abajo.
      const { recontacto, ...body } = req.body

      const existing =
        await prisma.vehicle.findUnique({
          where: { id: Number(id) },
        })

      if (!existing) {
        return res.status(404).json({
          message: "Vehículo no encontrado",
        })
      }

      let serviceDate = undefined
      let resetRecontacto = undefined

      if (body.serviceDate) {
        serviceDate = new Date(
          `${body.serviceDate}T12:00:00`
        )

        const currentDay = existing.serviceDate
          .toISOString()
          .split("T")[0]

        const incomingDay = serviceDate
          .toISOString()
          .split("T")[0]

        // Si cambió la fecha de service, se reinicia el recontacto.
        if (currentDay !== incomingDay) {
          resetRecontacto = false
        }
      }

      const vehicle =
        await prisma.vehicle.update({
          where: {
            id: Number(id),
          },

          data: {
            ...body,

            mileage: body.mileage
              ? Number(body.mileage)
              : undefined,

            serviceDate,

            nextServiceMileage:
              body.nextServiceMileage
                ? Number(
                    body.nextServiceMileage
                  )
                : null,

            recontacto: resetRecontacto,

            // Al reiniciar el recontacto también se limpia su fecha.
            recontactedAt:
              resetRecontacto === false
                ? null
                : undefined,
          },
        })

      res.json(vehicle)
    } catch (error) {
      res.status(500).json(error)
    }
  }

// Marca el vehículo como recontactado (se llama cuando el admin
// hace click en el link de WhatsApp del panel de recontacto).
export const markRecontacted =
  async (req, res) => {
    try {
      const { id } = req.params

      const vehicle =
        await prisma.vehicle.update({
          where: {
            id: Number(id),
          },
          data: {
            recontacto: true,
            recontactedAt: new Date(),
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