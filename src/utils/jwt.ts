import { sign, verify } from "jsonwebtoken";
import { Response } from "express";
import { JWTSECRET } from "../../config/default";

const issueJWTToken = async (payLoad) => {
  let token = await sign(payLoad, JWTSECRET);
  return token;
};

export const isTokenValid = (token) => verify(token, JWTSECRET);

export const attachCookiesToResponse = async (res: Response, user: any) => {
  const accessTokenJWT = await issueJWTToken({ payload: { user } });
  const refreshTokenJWT = await issueJWTToken({ payload: { user } });

  const oneDay = 1000 * 60 * 60 * 24;
  const longerExp = 1000 * 60 * 60 * 24 * 30;

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    signed: false,
    expires: new Date(Date.now() + oneDay),
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    signed: false,
    expires: new Date(Date.now() + longerExp),
  });
};
