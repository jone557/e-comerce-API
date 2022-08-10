const User = require('../../models/User');
const jwt = require('jsonwebtoken'); // to generate token
const bcrypt = require('bcryptjs'); // encrypt password
const { check, validationResult } = require('express-validator');

const secret = 'test';
//register an admin
exports.signup =  async (req, res) => {
   
  const { email, password, firstName, lastName } = req.body;

  try {
    const oldUser = await User.findOne({ email, role:'admin' });

    if (oldUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({ email: email, password: hashedPassword, name: `${firstName} ${lastName}`, role: 'admin' });

    const token = jwt.sign( { email: result.email, id: result._id }, secret, { expiresIn: "1h" } );

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    
    console.log(error);
  }
};
//signin a user
exports.signin = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const oldUser = await User.findOne({ email, role:'admin' });

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};