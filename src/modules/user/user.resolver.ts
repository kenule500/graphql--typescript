import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { User } from "./user.entity";
import { EmailVerifyInput, LoginInput, RegisterInput, ResetPasswordInput } from "./user.input";
import { MyContext } from "../../types/myContext";
import { attachCookiesToResponse } from "../../utils/jwt";
import { isAuth } from "../../middleware/authorization";
import crypto from "crypto";
import { sendVerificationEmail } from "../../utils/sendVerificationEmail";
import { sendResetPasssword } from "../../utils/sendResetPassword";
import { creatHash } from "../../utils/createHash";

@Resolver(User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  async hello(@Ctx() ctx: MyContext): Promise<User | null> {
    if (!ctx.user) return null;

    return User.findOne({ where: { id: ctx.user.id } });
  }

  @UseMiddleware(isAuth)
  @Query(() => User, { nullable: true, complexity: 6 })
  async me(@Ctx() ctx: MyContext): Promise<User | null> {
    if (!ctx.user!) return null;

    return User.findOne({ where: { id: ctx.user.id } });
  }

  @Mutation(() => String)
  async register(@Arg("input", { validate: true }) input: RegisterInput): Promise<string> {
    const verificationToken = crypto.randomBytes(40).toString("hex");
    const user = User.create({ ...input });
    user.verificationToken = verificationToken;
    await user.save();

    const name = `${input.firstName} ${input.lastName}`;
    await sendVerificationEmail(input.email, name, verificationToken);

    return "Confirmation message sent to your email";
  }

  @Mutation(() => Boolean)
  async verifyEmail(@Arg("input", { validate: true }) input: EmailVerifyInput): Promise<boolean> {
    const user = await User.findOne({ where: { email: input.email, verificationToken: input.token } });
    if (!user) return false;
    user.verificationToken = "";
    user.confirmed = true;
    await user.save();
    return true;
  }

  @Mutation(() => User, { nullable: true })
  async login(@Arg("input", { validate: true }) input: LoginInput, @Ctx() ctx: MyContext): Promise<User | null> {
    const user = await User.findOne({ where: { email: input.email } });
    if (!user) return null;
    const valid = await user.comparePassword(input.password);
    console.log("user", valid);

    delete user.password;
    if (!valid) return null;
    if (!user.confirmed) return null;
    await attachCookiesToResponse(ctx.res, user);
    return user;
  }

  @Mutation(() => String)
  async forgotPassword(@Arg("email") email: string): Promise<string> {
    const user = await User.findOne({ where: { email } });
    if (!user) return "Reset password sent";
    const passwordToken = crypto.randomBytes(40).toString("hex");
    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);
    user.passwordToken = creatHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();

    const name = `${user.firstName} ${user.lastName}`;
    await sendResetPasssword(email, name, passwordToken);
    return "Reset password link sent";
  }

  @Mutation(() => String, { nullable: true })
  async resetPassword(@Arg("input") { email, password, token }: ResetPasswordInput): Promise<String> {
    const user = await User.findOne({ where: { email } });
    if (user) {
      const curremDate = new Date();

      if (user.passwordToken === creatHash(token) && user.passwordTokenExpirationDate > curremDate) {
        user.password = password;
        user.passwordToken = "";
        user.passwordTokenExpirationDate = null;
        await user.save();
      }
    }
    return "Password reset successfully";
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: MyContext): Promise<boolean> {
    res.cookie("accessToken", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.cookie("refreshToken", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    return true;
  }
}
