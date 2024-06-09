import { PrismaClient } from "@prisma/client";
import { getPenaltiesByUser } from "./PenaltyController.js";
const prisma = new PrismaClient();

export const getBorrowByUser = async (user_id) => {
  const borrow = await prisma.borrowedBooks.findMany({
    where: {
      user_id,
      status_id: 2,
    },
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
      Users: {
        select: {
          user_id: true,
          user_name: true,
          user_email: true,
        },
      },
      bookStatus: {
        select: {
          status_id: true,
          status_desc: true,
        },
      },
    },
  });

  return borrow;
};

export const borrowBook = async (req, res) => {
  const { book_id } = req.body;
  const user = req.user;

  const book = await prisma.books.findFirst({
    where: {
      book_id: book_id,
    },
  });

  const penalties = await getPenaltiesByUser(user.user_id);
  const borrowedBooks = await getBorrowByUser(user.user_id);

  if (!book) {
    return res.status(404).json({
      status: false,
      message: "Book not found",
    });
  }

  if (book.book_stock === 0) {
    return res.status(400).json({
      status: false,
      message: "Book out of stock",
    });
  }

  if (penalties.length > 0) {
    return res.status(400).json({
      status: false,
      message:
        "You have penalties, you are not allowed to borrow books for 3 days",
      data: penalties,
    });
  }

  if (borrowedBooks.length >= 2) {
    return res.status(400).json({
      status: false,
      message: "You have borrowed 2 books, you are not allowed to borrow more",
      data: borrowedBooks,
    });
  }

  const borrow = await prisma.borrowedBooks.create({
    data: {
      book_id: book_id,
      user_id: user.user_id,
      status_id: 2,
      borrowed_at: new Date(),
      returned_expected_at: new Date(
        new Date().setDate(new Date().getDate() + 7)
      ),
    },
    include: {
      Books: {
        select: {
          book_id: true,
          book_title: true,
          book_author: true,
          book_stock: true,
        },
      },
      Users: {
        select: {
          user_id: true,
          user_name: true,
          user_email: true,
        },
      },
      bookStatus: {
        select: {
          status_id: true,
          status_desc: true,
        },
      },
    },
  });

  await prisma.books.update({
    where: {
      book_id: book_id,
    },
    data: {
      book_stock: book.book_stock - 1,
    },
  });

  res.json({
    status: true,
    message: "Book borrowed",
    data: borrow,
  });
};

export const returnBook = async (req, res) => {
  const { return_date } = req.body;
  const { borrowed_id } = req.params;
  const user = req.user;
  const r_date = new Date(return_date + "T00:00:00.000Z");

  const borrow = await prisma.borrowedBooks.findFirst({
    where: {
      borrowed_id: parseInt(borrowed_id),
      user_id: user.user_id,
      status_id: 2,
    },
    include: {
      Books: {
        select: {
          book_id: true,
          book_stock: true,
        },
      },
    },
  });

  if (!borrow) {
    return res.status(404).json({
      status: false,
      message: "Borrowed book not found",
    });
  }

  if (r_date > borrow.returned_expected_at) {
    const late = r_date.getDate() - borrow.returned_expected_at.getDate();
    await prisma.borrowedBooks.update({
      where: {
        borrowed_id: parseInt(borrowed_id),
      },
      data: {
        status_id: 1,
        returned_at: r_date,
      },
    });

    await prisma.books.update({
      where: {
        book_id: borrow.book_id,
      },
      data: {
        book_stock: borrow.Books.book_stock + 1,
      },
    });

    const penalty = await prisma.penalties.create({
      data: {
        user_id: user.user_id,
        penalty_desc: "Book return more than " + late + " days late",
        is_deleted: false,
      },
    });

    return res.status(201).json({
      status: true,
      message: "Book return overdue",
      data: {
        penalty,
      },
    });
  } else {
    await prisma.borrowedBooks.update({
      where: {
        borrowed_id: parseInt(borrowed_id),
      },
      data: {
        status_id: 3,
        returned_at: r_date,
      },
    });

    await prisma.books.update({
      where: {
        book_id: borrow.book_id,
      },
      data: {
        book_stock: borrow.Books.book_stock + 1,
      },
    });

    res.json({
      status: true,
      message: "Book returned",
    });
  }
};
