import { Request, Response } from "express";
import prismaClient from "../db/index.js";
import {Quantity} from '@prisma/client'
import {
  perfumeData,
  perfumeGetData,
  perfumeUpdateData,
  perfumeDeleteData,
} from "../parsers/Parsers.js";
// @desc    Register new user
// @route   POST /api/users
// @access  Public
export const createPerfume = async (req: Request, res: Response) => {
  const parsedBody = perfumeData.safeParse(req.body);
  console.log(parsedBody);
  if (!parsedBody.success) {
    res.status(411).json({
      message: "The perfume data is invalid. Please check",
    });
    return;
  }

  const Perfume = await prismaClient.perfume.findFirst({
    where: {
      name: parsedBody.data.name,
    },
  });

  if (Perfume) {
    res
      .status(404)
      .json({ message: `Pefume ${parsedBody.data.name} already exist.` });
    return;
  }

  const newPerfume = await prismaClient.perfume.create({
    data: {
      name: parsedBody.data.name,
      price: parsedBody.data.price,
      quantity: parsedBody.data.quantity as Quantity,
      imageUrl: parsedBody.data.imageUrl,
    },
  });

  res.status(200).send(newPerfume);
};

export const getPerfume = async (req: Request, res: Response) => {
  const parsedBody = perfumeGetData.safeParse({ name: req.query.name });
  if (!parsedBody.success) {
    res.status(411).json({
      message: "The perfume data is invalid. Please check",
    });
    return;
  }
  const Perfume = await prismaClient.perfume.findFirst({
    where: {
      name: parsedBody.data.name,
    },
  });
  if (Perfume) {
    res.status(404).send(Perfume);
    return;
  }

  res.status(404).send({ message: "Perfume not found." });
};

export const getAllPerfumes = async (req: Request, res: Response) => {
  const Perfumes = await prismaClient.perfume.findMany({});
  if (Perfumes) {
    res.status(200).send(Perfumes);
    return;
  }

  res.status(404).send({ message: "No perfume found" });
};

export const updatePerfume = async (req: Request, res: Response) => {
  const parsedBody = perfumeUpdateData.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(411).json({
      message: "The perfume data is invalid. Please check",
    });
    return;
  }

  const perfume = await prismaClient.perfume.findFirst({
    where: { name: parsedBody.data.name },
  });

  if (!perfume) {
    res
      .status(404)
      .json({ message: `Pefume "${parsedBody.data.name}" does not exist.` });
    return;
  }

  // Step 2: Update the found user
  const updatedPerfume = await prismaClient.perfume.update({
    where: { id: perfume.id }, // Use the unique id from findFirst
    data: {
      ...(parsedBody.data.name && {name: parsedBody.data.newName}),
      ...(parsedBody.data.price && {price: parsedBody.data.price}),
      ...(parsedBody.data.discription && {discription: parsedBody.data.discription}),
      ...(parsedBody.data.imageUrl && { imageUrl: parsedBody.data.imageUrl }),
    },
  });

  res.status(200).send(updatedPerfume);
};

export const deletePerfume = async (req: Request, res: Response) => {
  const parsedBody = perfumeDeleteData.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(411).json({
      message: "The perfume data is invalid. Please check",
    });
    return;
  }

  const perfume = await prismaClient.perfume.findFirst({
    where: { name: parsedBody.data.name },
  });

  if (!perfume) {
    res
      .status(404)
      .json({ message: `Perfume ${parsedBody.data.name} does not exist.` });
    return;
  }

  const deletedPerfume = await prismaClient.perfume.delete({
    where: { id: perfume.id },
  });

  res.status(200).json({ message: "Perfume deleted", data: deletedPerfume });
};
