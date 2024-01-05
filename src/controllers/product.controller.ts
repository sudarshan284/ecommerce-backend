import { Request, Response } from "express";
import Product from "../models/productModel";

const addProduct = async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getSpecificProduct = async (req: Request, res: Response) => {
  try {
    const product = (await Product.findOne({ _id: req.params.id })) as any;
    if (!product) return res.status(404).json("Product not found");
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete({ _id: req.params.id });
    if (!product) return res.status(404).json("Product not found");
    res.status(200).json({ message: `product deletion successful ${product}` });
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateProduct = async (req: Request, res: Response) => {
  Product.findByIdAndUpdate({ _id: req.params.id }, { $set: { $eq: req.body } })
    .then((product) =>
      res.status(200).json({ message: "Product updated successfully", product })
    )
    .catch((err) => res.status(400).json(err));
};

export default {
  addProduct,
  getAllProducts,
  getSpecificProduct,
  deleteProduct,
  updateProduct,
};
