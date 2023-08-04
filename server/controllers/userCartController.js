import ProductModel from '../models/Product.js';
import CartModel from '../models/Cart.js';

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      cart = new CartModel({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      const existingCartItem = cart.items.find(item => item.product.equals(productId));
      if (existingCartItem) {
        existingCartItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.product.equals(productId));

    if (itemIndex !== -1) {
      cart.items.splice(itemIndex, 1);
      await cart.save();
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await CartModel.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
