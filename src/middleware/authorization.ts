import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../types/myContext";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const user = context.user;
  if (!user) {
    throw new Error("Not authenticated");
  }
  return next();
};
