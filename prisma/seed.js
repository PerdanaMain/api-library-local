import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const salt = bcrypt.genSaltSync(10);

async function main() {
  await seedRoles();
  await seedUsers();
  await seedBooks();
  await bookStatus();
}

const seedRoles = async () => {
  await prisma.roles.createMany({
    data: [
      {
        role_name: "admin",
      },
      {
        role_name: "member",
      },
    ],
  });
};

const seedUsers = async () => {
  await prisma.users.createMany({
    data: [
      {
        user_email: "admin@admin",
        user_password: bcrypt.hashSync("12345", salt),
        user_name: "admin",
        role_id: 1,
      },
      {
        user_email: "angga@gmail.com",
        user_password: bcrypt.hashSync("12345", salt),
        user_name: "Angga",
        role_id: 2,
      },
      {
        user_email: "ferry@gmail.com",
        user_password: bcrypt.hashSync("12345", salt),
        user_name: "Ferry",
        role_id: 2,
      },
      {
        user_email: "putri@gmail.com",
        user_password: bcrypt.hashSync("12345", salt),
        user_name: "Putri",
        role_id: 2,
      },
    ],
  });
};

const seedBooks = async () => {
  await prisma.books.createMany({
    data: [
      {
        book_title: "Harry Potter",
        book_author: "J.K Rowling",
        book_stock: 10,
      },
      {
        book_title: "A Study in Scarlet",
        book_author: "Arthur Conan Doyle",
        book_stock: 10,
      },
      {
        book_title: "Twilight",
        book_author: "Stephenie Meyer",
        book_stock: 10,
      },
      {
        book_title: "The Hobbit, or There and Back Again",
        book_author: "J.R.R. Tolkien",
        book_stock: 10,
      },
      {
        book_title: "The Lion, the Witch and the Wardrobe",
        book_author: "C.S. Lewis",
        book_stock: 10,
      },
    ],
  });
};

const bookStatus = async () => {
  await prisma.bookStatus.createMany({
    data: [
      {
        status_desc: "Penalty",
      },
      {
        status_desc: "Borrowed",
      },
      {
        status_desc: "Returned",
      },
    ],
  });
};

main()
  .then(async () => {
    console.log("Seed data success!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
