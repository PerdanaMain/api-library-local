import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPenaltiesByUser = async (user_id) => {
  const penalties = await prisma.penalties.findMany({
    where: {
      user_id,
      is_deleted: false,
    },
    include: {
      Users: {
        select: {
          user_id: true,
          user_name: true,
          user_email: true,
        },
      },
    },
  });

  return penalties;
};
