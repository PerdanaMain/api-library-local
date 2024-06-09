import { PrismaClient } from "@prisma/client";
import { borrowBook, getBorrowByUser } from "./BorrowController.js";
const prisma = new PrismaClient();

export const getMembers = async (req, res) => {
  const members = await prisma.users.findMany({
    select: {
      user_id: true,
      user_name: true,
      user_email: true,
      _count: {
        select: { borrowedBooks: true },
      },
      borrowedBooks: {
        select: {
          borrowed_id: true,
          borrowed_at: true,
          returned_at: true,
          returned_expected_at: true,
          Books: {
            select: {
              book_id: true,
              book_title: true,
              book_author: true,
              book_stock: true,
            },
          },
          bookStatus: {
            select: {
              status_desc: true,
            },
          },
        },
      },
    },
  });

  res.json({
    status: true,
    message: "Members data",
    data: members,
  });
};

export const getMember = async (req, res) => {
  const user = req.user;
  const member = await prisma.users.findFirst({
    where: {
      user_id: user.user_id,
    },
    select: {
      user_id: true,
      user_name: true,
      user_email: true,
      _count: {
        select: { borrowedBooks: true },
      },
      borrowedBooks: {
        select: {
          borrowed_id: true,
          borrowed_at: true,
          returned_at: true,
          returned_expected_at: true,
          Books: {
            select: {
              book_id: true,
              book_title: true,
              book_author: true,
              book_stock: true,
            },
          },
          bookStatus: {
            select: {
              status_desc: true,
            },
          },
        },
      },
    },
  });

  res.json({
    status: true,
    message: "Member data",
    data: member,
  });
};
