import { CookieSerializeOptions } from "cookie";
export const authCookieConfig = {
  name: "session-token",
  config: {
    MAX_AGE: 30 * 24 * 60 * 60,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  } as CookieSerializeOptions,
};
