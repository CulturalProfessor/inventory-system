import { Request, Response } from "express";
import Product from "../schema/productSchema";
import axios from "axios";

export const addProduct = async (req: Request, res: Response) => {
  try {
    const { store, dept, size, type } = req.body;
    if (!(store || dept || size || type)) {
      return res.status(401).json({ message: "Please fill all fields" });
    }
    const product = new Product({
      store,
      dept,
      size,
      type,
    });
    await product.save();

    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Internal server error" });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Internal server error" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { _id } = req.body;
    const products = await Product.find({ _id });
    if (products.length == 0) {
      return res.status(401).json({ message: "Product not found" });
    } else {
      await Product.deleteOne({ _id });
      return res.status(200).json({ message: "Product deleted successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Internal server error" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { _id, store, dept, size } = req.body;
    const products = await Product.find({ _id });
    if (products.length == 0) {
      return res.status(401).json({ message: "Product not found" });
    } else {
      if (size) {
        await Product.findOne({ _id }).updateOne({ size });
      }
      if (store) {
        await Product.findOne({ _id }).updateOne({ store });
      }
      if (dept) {
        await Product.findOne({ _id }).updateOne({ dept });
      }
      return res.status(200).json({ message: "Product updated successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Internal server error" });
  }
};

export const predictProduct = async (req: Request, res: Response) => {
  try {
    const response = await axios.post(
      "http://model:8000/predictSales",
      req.body
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
