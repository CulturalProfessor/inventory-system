import { Request, Response } from "express";
import Product from "../schema/productSchema";
import axios from "axios";
import { ObjectId } from "mongodb";

export const addProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { store, dept, size, type } = req.body;
    if (!(store && dept && size && type)) {
      res.status(400).json({ message: "Please fill all fields" });
      return;
    }

    const product = new Product({
      store,
      dept,
      size,
      type,
    });
    await product.save();

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addBulkProductsWithCSV = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const csvData: Record<string, any>[] = [];
    const fileContent = req.file.buffer.toString("utf-8");
    const lines = fileContent.split("\n").filter((line) => line.trim() !== "");
    const headers = lines[0].split(",").map((header) => header.trim());

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const values = line.split(",").map((value) => value.trim());

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const row: Record<string, any> = {};
      headers.forEach((header, index) => {
        const value = values[index] || "";
        switch (header) {
        case "Store":
          row.store = Number(value);
          break;
        case "Dept":
          row.dept = Number(value);
          break;
        case "Size":
          row.size = Number(value);
          break;
        case "Type":
          row.type = Number(value);
          break;
        case "Date":
          row.date = value ? new Date(value) : new Date();
          break;
        default:
          break;
        }
      });

      if (!row.store || !row.dept || !row.size || !row.type) {
        res
          .status(400)
          .json({ message: `Missing required fields in row ${i + 1}` });
        return;
      }

      csvData.push(row);
    }

    const products = await Product.insertMany(csvData);
    res.status(201).json({
      message: "Products added successfully",
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error processing CSV data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { _id } = req.body;
    const product_id = new ObjectId(_id);

    const product = await Product.findById(product_id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    await Product.deleteOne({ _id: product_id });
    res
      .status(200)
      .json({ message: "Product deleted successfully", deleted: true });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { _id, store, dept, size } = req.body;

    const product = await Product.findById(_id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const updates: Partial<typeof product> = {};
    if (store) updates.store = store;
    if (dept) updates.dept = dept;
    if (size) updates.size = size;

    await Product.updateOne({ _id }, updates);
    res.status(200).json({ message: "Product updated successfully" });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const predictProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const response = await axios.post("http://model:8000/predictSales", {
      products: req.body,
    });

    response.data.predicted_sales = response.data.predicted_sales.map(
      (value: number) => Math.round(value)
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadCSV = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const csvData: Record<string, string>[] = [];
    const fileContent = req.file.buffer.toString("utf-8");
    const lines = fileContent.split("\n");
    const headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const values = line.split(",");
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index]?.trim() || "";
      });
      csvData.push(row);
    }

    const response = await axios.post("http://model:8000/uploadData", {
      data: csvData,
    });

    res.status(200).json({
      message: "CSV file processed successfully",
      success: response.data.success,
      data: response.data,
    });
  } catch (error) {
    console.error("Error processing the file", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
