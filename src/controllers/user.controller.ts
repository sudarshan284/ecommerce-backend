import express, { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.Jwt_secret_key;
const EXPIRES_IN = process.env.expires;
const createUser = async (req: Request, res: Response) => {
  try {
    const user = new User(req.body);
    console.log(user);
    const ChkUser = await User.findOne({
      email: { $eq: req.body.email },
    }).exec();

    if (ChkUser) return res.status(400).json("user already exist");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    user.password = hashedPassword;
    await user.save();
    const token = jwt.sign({ _id: user }, JWT_SECRET as string, {
      expiresIn: EXPIRES_IN,
    });
    res.header("x-auth-header", token);
    res.status(200).json("user added successfully");
  } catch (error) {
    res.status(500).json({ message: "Internal server error: ", error });
  }
};
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const getSpecificUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) res.status(400).json({ message: "User does not exist" });
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const authUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = (await User.findOne({
      email: { $eq: email },
    })) as any;
    if (!user) return res.status(404).json("user credential");
    if (!bcrypt.compareSync(password, user.password))
      return res.status(404).json("Wrong credentials");
    const token = jwt.sign({ _id: user }, JWT_SECRET as string, {
      expiresIn: EXPIRES_IN,
    });
    res.header("x-auth-header", token);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  User.findByIdAndDelete({ _id: req.params.id })
    .then((user) =>
      res.status(200).json({ message: "User deleted successfully", user })
    )
    .catch((err) => res.status(400).json(err));
};

const updateUser = async (req: Request, res: Response) => {
  User.findByIdAndUpdate({ _id: req.params.id }, { $set: { $eq: req.body } })
    .then((user) =>
      res.status(200).json({ message: "User updated successfully", user })
    )
    .catch((err) => res.status(400).json(err));
};

const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const user = (await User.findOne({ _id: req.params.id })) as any;
    console.log(user);

    if (!bcrypt.compareSync(currentPassword, user.password))
      return res.status(404).json({ message: "Wrong password", user });
    if (newPassword.length < 8)
      return res
        .status(404)
        .json({ message: "Password must be of at-least 8 characters" });
    if (newPassword.localeCompare(confirmNewPassword))
      return res.status(404).json({ message: "Password does not match" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json("Password updated successfully");
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export default {
  createUser,
  getAllUsers,
  getSpecificUser,
  authUser,
  deleteUser,
  updateUser,
  changePassword,
};
