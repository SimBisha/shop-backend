const router = require("express").Router();
import Order, { findByIdAndUpdate, findByIdAndDelete, find, aggregate } from "../models/Order";
import { verifyToken, verifyTokenOptional, verifyTokenAndAuthorization, verifyTokenAndAdmin } from "./verifyToken";
import express from "express";
import { sendOrderNotification } from "../utils/mailer";  

// CREATE ORDER
router.post("/", verifyTokenOptional, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
     // Save the new order to MongoDB
    const savedOrder = await newOrder.save();

   
    await sendOrderNotification(savedOrder);

    
    res.status(200).json(savedOrder);
  } catch (err) {
    console.error('❌ Error creating order:', err);
    res.status(500).json(err);
  }
});

// UPDATE ORDER
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE ORDER
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await findByIdAndDelete(req.params.id);
    res.status(200).json("Porosia eshte fshire nga sistemi . . .");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL ORDERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET TOTAL INCOME
router.get("/income/all", verifyTokenAndAdmin, async (req, res) => {
  try {
    const income = await aggregate([
      {
        $project: {
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$sales" },
        },
      },
    ]);

    const result = income.length > 0 ? income[0].totalIncome : 0;
    res.status(200).json({ totalIncome: result });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET INCOME (with product filter)
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const productId = req.query.pid;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const prevMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await aggregate([
      {
        $match: {
          createdAt: { $gte: prevMonth },
          ...(productId && {
            products: { $elemMatch: { productId: productId } },
          }),
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET INCOME FOR ALL MONTHS
router.get("/income/all-months", verifyTokenAndAdmin, async (req, res) => {
  try {
    const income = await aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
