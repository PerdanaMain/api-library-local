import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getBooks = async (req, res) => {
  const books = await prisma.books.findMany({
    select: {
      book_id: true,
      book_title: true,
      book_author: true,
      book_stock: true,
      borrowedBooks: {
        where: {
          status_id: 2,
        },
        select: {
          borrowed_id: true,
          borrowed_at: true,
          returned_at: true,
          returned_expected_at: true,
          Users: {
            select: {
              user_id: true,
              user_name: true,
              user_email: true,
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
    message: "Books data",
    data: books,
  });
};

export const getBook = async (req, res) => {
  const { id } = req.params;

  const book = await prisma.books.findFirst({
    where: {
      book_id: parseInt(id),
    },
    include: {
      borrowedBooks: {
        select: {
          borrowed_id: true,
          borrowed_at: true,
          returned_at: true,
          returned_expected_at: true,
          Users: {
            select: {
              user_id: true,
              user_name: true,
              user_email: true,
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

  if (!book) {
    return res.status(404).json({
      status: false,
      message: "Book not found",
    });
  }

  res.json({
    status: true,
    message: "Book data",
    data: book,
  });
};
