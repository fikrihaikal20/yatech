import jwt from 'jsonwebtoken';

export function accessToken(id) {
  const expiresIn = '60s';
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const payload = {
    sub: id,
  };
  const Token = jwt.sign(payload, secret, {
    expiresIn: expiresIn,
  });
  return {
    token: Token,
    expiresIn: expiresIn,
  };
}

export function refreshToken(id) {
    const expiresIn = '1d';
    const secret =  process.env.REFRESH_TOKEN_SECRET;
    const payload = {
      sub: id,
    };
    const Token = jwt.sign(payload, secret, {
      expiresIn: expiresIn,
    });
    return {
      token: Token,
      expiresIn: expiresIn,
    };
  }
