import jwt from 'jsonwebtoken';
import prisma from '../providers/client.js';
import Users from '@prisma/client';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, data) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });

      const user = await prisma.Users.findUnique({
        where: {
          id: data.sub
        },
        select: {
          name: true,
          email: true,
        }
      })

      req.user = user;
      next();
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
