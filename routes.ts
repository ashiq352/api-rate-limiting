// NPM Dependencies
import * as express from "express";
import * as status from "http-status";
import * as StandardError from "standard-error";
import * as bcrypt from "bcrypt";
import * as jwt from "jwt-simple";
import { config } from "../../config";
import { getJwtPayload } from "./helpers";
import { User } from "../../db";

export class AuthRoutes {
  static JWT_SECRET = config.JWT_SECRET || "i am a tea pot";

  public static async register(
    req: express.Request,
    res: express.Response,
    next
  ) {
    try {
      const {
        email,
        password,
        oauth,
        name,
        type,
        organizationName,
        eighteenPlusConsent,
        receiveEmailConsent,
        termsConsent,
        dialCode,
        phoneNumber,
        country,
        zipcode,
        timezone,
        hearAboutUs,
      } = req.body.user;

      

      let emailToLowerCase = email.toLowerCase();

      if (!email) {
        throw new StandardError({
          message: "Email is required",
          code: status.CONFLICT,
        });
      }

      if (!password) {
        throw new StandardError({
          message: "Password is required",
          code: status.CONFLICT,
        });
      }
      const existingUser = await User.findOne({ email: emailToLowerCase });
      if (existingUser) {
        throw new StandardError({
          message: "Email already in use",
          code: status.CONFLICT,
        });
      }

      if (password) {
        const pass = /^(?=.*?[A-Z])(?=.*?[0-9]).{6,}$/;
        if (!pass.test(password)) {
          throw new StandardError({
            message:
              "Password must contain at least 6 characters, including one uppercase characters and number.",
            code: status.CONFLICT,
          });
        }
      }
      const hashedPassword = await bcrypt.hash(password, 8);
      const user = await User.create({
        email,
        password: hashedPassword,
        name,
        type,
        organizationName,
        oauth,
        eighteenPlusConsent,
        receiveEmailConsent,
        termsConsent,
        dialCode,
        phoneNumber,
        country,
        zipcode,
        hearAboutUs,
        timezone,
      });

      res.json({
        token: jwt.encode(getJwtPayload(user), AuthRoutes.JWT_SECRET),
        user,
      });
    } catch (error) {
      next(error);
    }
  }
}
