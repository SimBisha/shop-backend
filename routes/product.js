const router = require("express").Router();
 const Product = require("../models/Product");
 const {
   verifyToken,
   verifyTokenAndAuthorization,
   verifyTokenAndAdmin,
 } = require("./verifyToken");
 
 //CREATE
 router.post("/", verifyTokenAndAdmin, async (req, res) => {
   const newProduct = new Product(req.body);
   try {
     const savedProduct = await newProduct.save();
     res.status(200).json(savedProduct);
   } catch (err) {
     res.status(500).json(err);
   }
 });
 
 //UPDATE
 router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
   try {
     const updatedProduct = await Product.findByIdAndUpdate(
       req.params.id,
       {
         $set: req.body,
       },
       { new: true }
     );
     res.status(200).json(updatedProduct);
   } catch (err) {
     res.status(500).json(err);
   }
 });
 
 //DELETE
 router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
   try {
     await Product.findByIdAndDelete(req.params.id);
     res.status(200).json("Produkti eshte fshire nga sistemi . . .");
   } catch (err) {
     res.status(500).json(err);
   }
 });
 //GET Product
 router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;




























































































// // router.get("/find/:id", async (req, res) => {
// //   try {
// //     const product = await Product.findById(req.params.id);

// //     res.status(200).json(product);
// //   } catch (err) {
// //     res.status(500).json(err);
// //   }
// // });
// router.get("/", async (req, res) => {
//   try {
//     const products = await Product.find();
//     console.log(products); // Log products to check the data
//     res.status(200).json(products);
//   } catch (err) {
//     console.error("Error fetching products:", err);
//     res.status(500).json({ message: "Error fetching products", error: err.message });
//   }
// });

// //GET ALL PRODUCTS
// router.get("/", async (req, res) => {
//   const qNew = req.query.new;
//   const qCategory = req.query.category;
//   try {
//     let products;

//     if (qNew) {
//       products = await Product.find().sort({ createdAt: -1 }).limit(1);
//     } else if (qCategory) {
//       products = await Product.find({
//         categories: {
//           $in: [qCategory],
//         },
//       });
//     } else {
//       products = await Product.find();
//     }

//     res.status(200).json(products);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// module.exports = router;