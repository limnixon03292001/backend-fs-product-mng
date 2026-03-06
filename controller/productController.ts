import type { NextFunction, Request, Response } from "express";
import { db } from "../db.js";
import { productTable } from "../model/schema.js";
import { asc, desc, eq } from "drizzle-orm";
import { AppError } from "../middleware/error/appError.js";
import type { NewProduct, updateProduct } from "../types/productTypes.js";

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const data: NewProduct = req.body;

  console.log(data);

  try {
    const result = await db.insert(productTable).values(data).returning();
    console.log(result);
    res
      .status(201)
      .send({ message: "Product added successfully.", data: result });
  } catch (error) {
    next(error);
  }
}

export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await db
      .select()
      .from(productTable)
      .orderBy(asc(productTable.id));

    res.status(200).send({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function getProductsDetails(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = Number(req.params);

  try {
    const result = await db
      .select()
      .from(productTable)
      .where(eq(productTable.id, id));

    if (result.length === 0) {
      return next(new AppError("Product not found", 404));
    }

    res.status(200).send({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = Number(req.params.id);
  const data: updateProduct = req.body;

  try {
    const product = await db
      .select()
      .from(productTable)
      .where(eq(productTable.id, id));

    if (product.length === 0) {
      return next(new AppError(`Product ID: ${id} not found`, 404));
    }

    await db.update(productTable).set(data).where(eq(productTable.id, id));

    res.status(200).send({ messsage: "Product updated successfully." });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = Number(req.params.id);

  try {
    const product = await db
      .select()
      .from(productTable)
      .where(eq(productTable.id, id));

    if (product.length === 0) {
      return next(new AppError(`Product ID: ${id} not found`, 404));
    }

    await db.delete(productTable).where(eq(productTable.id, id));

    res.status(200).send({ message: "Successfully deleted." });
  } catch (error) {
    next(error);
  }
}
