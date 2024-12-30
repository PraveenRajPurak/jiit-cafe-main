// routes/adminAuth.mjs

import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/admins.mjs';
import Stock from '../models/stock.mjs';
import User from '../models/users.mjs';

const router = express.Router();

const JWT_ADMIN_SECRET = 'helloworld';

router.post('/signIn', async (req, res) => {
  console.log('inside admin signup route');
  const { adminNo, password } = req.body;
  console.log('adminNo:', adminNo);
  console.log('password:', password);
  try {
    const admin = await Admin.findOne({ adminNo, password });
    if (admin) {
      // Generate JWT token for admin
      const token = jwt.sign({ adminId: admin._id }, JWT_ADMIN_SECRET, { expiresIn: '1h' });

      res.status(200).json({
        message: 'Admin login successful',
        admin: { adminId: admin._id, adminNo: admin.adminNo },
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/stockfetch', async (req, res) => {
  try {
    let query = {}; // Default query to fetch all items

    // Check if search query is provided
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query = {
        $or: [
          { itemName: { $regex: searchRegex } },
          { itemid: { $regex: searchRegex } },
        ],
      };
    }

    const stockItems = await Stock.find(query);
    res.json(stockItems);
  } catch (error) {
    console.error('Error fetching stockish items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/addStock', async (req, res) => {
  const { itemId, updatedStock } = req.body;

  try {
    const item = await Stock.findOne({ itemid: itemId });
    
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    // Find the stock item by itemId and update the quantity
    const updatedItem = await Stock.findOneAndUpdate(
      { itemid: itemId },
      { 
        quantity: item.quantity + updatedStock,
        isAvailable: item.quantity + updatedStock > 0 ? true : false,
      },
      { new: true }
    );

    res.json({ success: true, updatedItem });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

router.post('/deleteStock', async (req, res) => {
  const { itemId, deletedStock } = req.body;

  try {
    const item = await Stock.findOne({ itemid: itemId });
    
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    // Ensure that item.quantity is a valid number
    const currentQuantity = typeof item.quantity === 'number' ? item.quantity : 0;

    // Find the stock item by itemId and update the quantity
    const updatedItem = await Stock.findOneAndUpdate(
      { itemid: itemId },
      { 
        quantity: Math.max(currentQuantity - deletedStock, 0),
        isAvailable: Math.max(currentQuantity - deletedStock, 0) > 0 ? true : false,
      },
      { new: true }
    );

    res.json({ success: true, updatedItem });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


router.post('/userDetails', async (req, res) => {
  const enrollmentNo = req.body.enrollmentNo;
  console.log('enrollmentNo:', enrollmentNo);

  try {
    // Fetch user details based on the user ID
    const user = await User.findOne({ enrollmentNo: enrollmentNo });

    if (user) {
      // Send user details as the response
      res.status(200).json({
        enrollmentNo: user.enrollmentNo,
        name: user.name,
        jCoins: user.jCoins,
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/rechargeJCoins', async (req, res) => {
  const { enrollmentNo, amount } = req.body;

  try {
    // Fetch user details based on the user ID
    const user = await User.findOne({ enrollmentNo: enrollmentNo });

    if (user) {
      const oldJcoins = user.jCoins;
      const updatedUser = await User.findOneAndUpdate(
        { enrollmentNo: enrollmentNo }, // Criteria for finding the document
        { $set: { jCoins: oldJcoins + amount } }, // Update operation
        { new: true }
      );

      res.status(200).json({
        enrollmentNo: updatedUser.enrollmentNo,
        name: updatedUser.name,
        jCoins: updatedUser.jCoins,
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error recharging JCoins:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;
