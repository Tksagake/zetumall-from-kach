require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../../models/Product");

let mongo_connection = mongoose.createConnection(process.env.MONGO_URI, {
  // Removed deprecated options
  keepAlive: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 30000,
});

// decrease product quantity after a order created
const handleProductQuantity = async (cart) => {
  try {
    for (const p of cart) {
      if (p?.isCombination) {
        await Product.findOneAndUpdate(
          {
            _id: p._id,
            "variants.productId": p?.variant?.productId || "",
          },
          {
            $inc: {
              stock: -p.quantity,
              "variants.$.quantity": -p.quantity,
              sales: p.quantity,
            },
          },
          {
            new: true,
          }
        );
      } else {
        await Product.findOneAndUpdate(
          {
            _id: p._id,
          },
          {
            $inc: {
              stock: -p.quantity,
              sales: p.quantity,
            },
          },
          {
            new: true,
          }
        );
      }
    }
  } catch (err) {
    console.log("err on handleProductQuantity", err.message);
  }
};

const handleProductAttribute = async (key, value, multi) => {
  try {
    const products = await Product.find({ isCombination: true });

    if (multi) {
      for (const p of products) {
        await Product.updateOne(
          { _id: p._id },
          {
            $pull: {
              variants: { [key]: { $in: value } },
            },
          }
        );
      }
    } else {
      for (const p of products) {
        await Product.updateOne(
          { _id: p._id },
          {
            $pull: {
              variants: { [key]: value },
            },
          }
        );
      }
    }
  } catch (err) {
    console.log("err, when delete product variants", err.message);
  }
};

module.exports = {
  handleProductQuantity,
  handleProductAttribute,
};
