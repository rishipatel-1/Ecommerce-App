import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/envConfig.js';

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, config.SECRET_KEY_USER);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createUser = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, email });
    await user.save();

    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
