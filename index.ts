import * as express from "express";
import { AuthRoutes } from "./routes";
import apiCallRateLimiter from "./rateLimitter";

export class AuthRouter {
  router: express.Router;
  constructor() {
    this.router = express.Router();
    this.router.post(
      "/registerOauth",
      apiCallRateLimiter,
      AuthRoutes.registerOauth
    );
    this.router.post("/register", apiCallRateLimiter, AuthRoutes.register);
  }
}
