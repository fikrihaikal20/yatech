import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../providers/client.js';
import { accessToken, refreshToken } from '../providers/utils.js';
import Users from '@prisma/client';
import {
  registerValidator,
  loginFormValidator
} from '../providers/validators/AuthValidator.js';

// @desc    Register a user
// @route   POST /api/register
// @access  Public
export const register = async (req, res) => {
  const valid = await registerValidator(req.body);
  if (!valid) {
    return res.status(400).json({ message: registerValidator.errors });
  }

  try {
    const existingUser = await prisma.Users.findFirst({
      where: {
        email: req.body.email
      },
    });

    if (existingUser) {
      return res.status(409).json({
        status: 'Error',
        message: 'Email already exists',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    await prisma.Users.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      status: 'Success',
      message: 'User created successfully',
    });

  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      error: 'Internal server error',
      message: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/login
// @access  Public
export const login = async (req, res) => {
  const valid = await loginFormValidator(req.body);
  if (!valid) {
    return res.status(400).json({ message: loginFormValidator.errors });
  }

  try {
    const user = await prisma.Users.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 'Error',
        message: 'User not found',
      });
    }

    const passwordMatch = bcrypt.compareSync(
      req.body.password,
      user.password
    );


    if (!passwordMatch) {
      return res.status(401).json({
        status: 'Error',
        message: 'Password does not match',
      });
    }

    const AccessToken = accessToken(user.id);
    const RefreshToken = refreshToken(user.id);

    await prisma.Users.update({
      where: {
        id: user.id,
      },
      data: {
        refresh_token: RefreshToken.token,
      },
    });

    res.cookie('refreshToken', RefreshToken.token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return res.status(200).json({
      status: 'OK',
      message: 'User berhasil login',
      data: AccessToken
    });
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      error: 'Internal server error',
      message: error.message,
    });
  }
};

// @desc    Logout user
// @route   DELETE /api/logout
// @access  Public
export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.sendStatus(204);

  try {
    const user = await prisma.Users.findFirst({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 'Error',
        message: 'User not found',
      });
    }

    const { id } = user;

    await prisma.Users.update({
      where: {
        id: id,
      },
      data: {
        refresh_token: null,
      },
    });

    res.clearCookie('refreshToken');
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// @desc    Refresh token
// @route   GET /api/token
// @access  Public
export const token = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'Unauthorized' });

    const user = await prisma.Users.findFirst({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const AccessToken = accessToken(user.id);

      return res.status(200).json({
        status: 'OK',
        data: AccessToken.token,
      });

    });
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      error: 'Internal server error',
      message: error.message,
    });
  }
};

