const bcrypt = require('bcryptjs');
const { Router } = require('express');
const { check, validationResult, body } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = Router();
const User = require('../models/User');

const resMessages = require('../constants');
// /api/auth/register
router.post(
  '/register',
  [
    check('username', 'Please enter username'),
    check('email', 'Invalid email').isEmail(),
    check('password', 'Please enter password').isLength({
      min: 1,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Incorrect registration data',
        });
      }
      const { email, password, username } = req.body;
      const candidate = await User.findOne({ email });
      if (candidate) {
        return res.status(400).json({ message: 'This user already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, password: hashedPassword, username });

      await user.save();

      res.status(201).json({ message: 'User created' });
    } catch (e) {
      res
        .status(500)
        .json({ message: 'Something went wrong, please try again' });
    }
  }
);

// /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Please enter correct email').normalizeEmail().isEmail(),
    check('password', 'Please enter password').exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Incorrect login details',
        });
      }
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User is not found' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: 'Wrong password, please try again' });
      }

      const isUserBlocked = (await user.status) === 'inactive';
      if (isUserBlocked) {
        return res.status(401).send({ message: 'This user is blocked' });
      }

      user.lastLoginDate = new Date().toLocaleDateString();
      user.save();
      // const token = jwt.sign({ userId: user.id }, config.get('jwtSecret'), {
      const token = jwt.sign({ userId: user.id }, 'nastya ex4 authorization', {
        expiresIn: '1h',
      });
      res.json({ token, userId: user.id });
    } catch (e) {
      res
        .status(500)
        .json({ message: 'Something went wrong, please try again' });
    }
  }
);

router.get('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .send({ message: `User with id ${id} is not found` });
    }
    res.json({ user });
  } catch (e) {
    res
      .status(500)
      .json({ message: 'Something went wrong, please try againа' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
});

router.put('/user', async (req, res) => {
  try {
    const { ids, status } = req.body;
    ids.forEach(async (id) => {
      const user = await User.findByIdAndUpdate(id, { status });
      user.save();
    });
    res.json({ message: 'Users were succefuly updated' });
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
});

router.delete('/users', async (req, res) => {
  try {
    const { ids } = req.body;
    await User.deleteMany({ _id: { $in: ids } });
    res.json({ message: `Selected users was successfully deleted` });
  } catch (e) {
    res.status(500).json({ message: resMessages.basicError });
  }
});
module.exports = router;
