import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const Login = async (req, res) => {
  const { user_email, user_password } = req.body;
  const user = await prisma.users.findFirst({
    where: {
      user_email: user_email,
    },
    include: {
      Roles: true,
    },
  });

  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User not found",
    });
  }

  const checkPassword = bcrypt.compareSync(user_password, user.user_password);

  if (!checkPassword) {
    return res.status(401).json({
      status: false,
      message: "Password is wrong",
    });
  }

  const token = jwt.sign(
    {
      user_id: user.user_id,
      user_email: user.user_email,
      user_name: user.user_name,
      Roles: {
        role_id: user.role_id,
        role_name: user.Roles.role_name,
      },
    },
    process.env.JWT_SECRET
  );

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  });

  res.json({
    status: true,
    message: "Login success",
    data: {
      token: token,
    },
  });
};

export const Logout = async (req, res) => {
  res.clearCookie("token");

  res.json({
    status: true,
    message: "Logout success",
  });
};
