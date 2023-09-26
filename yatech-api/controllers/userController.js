import prisma from '../providers/client.js';
import bcrypt from 'bcrypt';
import Users from '@prisma/client';
import { updateUserValidator } from '../providers/validators/UserValidator.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Authenticated 
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.Users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return res.status(200).json({
      status: 'Success',
      message: 'Success get all users',
      data : users,
    });

  } catch (error) {
    return res.status(500).json({
        status: 'Error',
        error: 'Internal server error',
        message: error.message,
      });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Authenticated 
export const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        email: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Success get user by Id',
      data : user,
    });

  } catch (error) {
    return res.status(500).json({
        status: 'Error',
        error: 'Internal server error',
        message: error.message,
      });
  }
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Authenticated 
export const updateUser = async (req, res) => {
  const userId = parseInt(req.params.id);

  const valid = updateUserValidator(req.body);
  if (!valid){
    return res.status(400).json({ message: updateUserValidator.errors });
  }

  const { name, no_handphone, alamat } = req.body;
  try {
    await prisma.Users.update({
      where: {
        id: userId,
      },
      data: {
        name,
        no_handphone,
        alamat
      },
    });

    return res.status(200).json({
        status: 'Success',
        message: 'User updated successfully',
      });

  } catch (error) {
    return res.status(500).json({
        status: 'Error',
        error: 'Internal server error',
        message: error.message,
      });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Authenticated 
export const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    await prisma.users.delete({
      where: {
        id: userId,
      },
    });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({
        status: 'Error',
        error: 'Internal server error',
        message: error.message,
      });
  }
};
