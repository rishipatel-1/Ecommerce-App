import ProductModel from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    let query = ProductModel.find();
    const { sortBy, sortOrder } = req.query;

    if (sortBy === 'price' || sortBy === 'name') {
      const sortDirection = sortOrder === 'desc' ? -1 : 1;
      query = query.sort({ [sortBy]: sortDirection });
    }

    const products = await query.exec();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await ProductModel.findById(productId);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, imageUrls, description, status } = req.body;
    const newProduct = new ProductModel({
      name,
      price,
      imageUrls,
      status,
      description,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, price, imageUrls, description , status} = req.body;
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      { name, price, imageUrls, description,status, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedProduct) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.status(200).json(updatedProduct);
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await ProductModel.findByIdAndDelete(productId);
    if (!deletedProduct) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.status(204).end();
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
