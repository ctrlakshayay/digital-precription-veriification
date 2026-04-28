const bcrypt = require('bcryptjs');
const { createUser, findUserByEmail } = require('../models/authModel');
const { signToken } = require('../utils/jwt');

const roleTableMap = {
  doctor: 'Doctor',
  patient: 'Patient',
  pharmacy: 'Pharmacy',
};

const register = async (req, res, next) => {
  try {
    const { role, name, email, password, ...rest } = req.body;

    if (!roleTableMap[role]) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const data = { name, email, password: hashedPassword, ...rest };
    const id = await createUser(roleTableMap[role], data);

    const token = signToken({ id, role });

    res.status(201).json({ token, user: { id, role, name, email } });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken({ id: user.id, role: user.role });

    res.json({
      token,
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
