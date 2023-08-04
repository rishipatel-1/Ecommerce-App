import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrls: {
    type: [String],
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.pre("remove", async function (next) {
  const productId = this._id;
  const CartModel = mongoose.model("Cart");

  try {
    const cartsWithItem = await CartModel.find({ "items.product": productId });

    for (const cart of cartsWithItem) {
      const itemIndex = cart.items.findIndex(item => item.product.equals(productId));
      if (itemIndex !== -1) {
        cart.items.splice(itemIndex, 1);
        await cart.save();
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});


const Product = mongoose.model("Product", productSchema);

export default Product;
