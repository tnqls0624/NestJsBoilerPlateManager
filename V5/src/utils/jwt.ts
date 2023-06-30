import jwt from 'jsonwebtoken';

export const jwtSign = (data: string | Buffer | object) =>
  jwt.sign(data, process.env.JWT_ACCESS_TOKEN_SECRET || '', {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  });

export const jwtParse = (token: string) => {
  return jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET || '', {
    algorithms: ['HS256'],
  }) as any;
};
