import { authCookieConfig } from "@/constants";
import { User } from "@prisma/client";
import { serialize } from "cookie";
import fs from "fs";
import { sign, verify } from "jsonwebtoken";
import { pick } from "lodash";
import { NextRequest, NextResponse } from "next/server";
import path from "path/posix";
import slugify from "slugify";

export const checkPassword = async (userPassword: string, password: string) => {
  const bcrypt = await import("bcrypt");
  const valid = await bcrypt.compare(password, userPassword);
  return valid;
};

export const hashPassword = async (password: string) => {
  const bcrypt = await import("bcrypt");
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const generateUserToken = (user: User) => {
  const token = sign(
    pick(user, [
      "id",
      "name",
      "email",
      "phoneNumber",
      "isStaff",
      "accountVerified",
    ]),
    process.env.NEXTAUTH_SECRET as string,
    {
      expiresIn: "1d",
    },
  );
  return token;
};

export async function getHeaderWithCookie() {
  const cookiesModule = await import("next/headers");
  const userCookie = cookiesModule.cookies().get(authCookieConfig.name)?.value;
  const myHeaders = new Headers();
  if (userCookie) {
    myHeaders.append("Cookie", `${authCookieConfig.name}=${userCookie}`);
  }
  return myHeaders;
}

export const getExpiredCookieHeader = (request: NextRequest) => {
  const authCookie = request.cookies.get(authCookieConfig.name)?.value;

  const serializedCookieToken = serialize(
    authCookieConfig.name,
    authCookie ?? "",
    {
      ...authCookieConfig.config,
      maxAge: -1,
    },
  );

  const headers = new Headers();
  headers.append("Set-Cookie", serializedCookieToken);
  return headers;
};

export const redirectToAuth = (request: NextRequest) => {
  const callbackUrl = request.nextUrl.pathname;

  const headers = getExpiredCookieHeader(request);
  return NextResponse.redirect(
    new URL(
      `/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`,
      request.url,
    ),
    { headers },
  );
};

export async function getUserIdFromToken() {
  const cookiesModule = await import("next/headers");
  const userCookie = cookiesModule.cookies().get(authCookieConfig.name)?.value;

  if (!userCookie) {
    return null;
  }
  try {
    const { id }: any = verify(
      userCookie as string,
      process.env.NEXTAUTH_SECRET as string,
    );
    return id as string;
  } catch (error) {
    return null;
  }
}

export async function getSessionUser() {
  const prisma = await import("@/prisma/client");
  const userId = await getUserIdFromToken();
  if (!userId) return null;
  return await prisma.prisma.user.findUnique({
    where: { id: userId },
    include: { team: true },
  });
}

export function saveMediaFileName(
  uploadPath: string,
  fileName: string,
  extension?: string,
) {
  const mediaPath = path.join(process.cwd(), "public", "media", uploadPath);
  if (!fs.existsSync(mediaPath)) {
    fs.mkdirSync(mediaPath, { recursive: true });
  }

  let name;
  if (extension) {
    const fileNameWithoutExtension = fileName.slice(
      0,
      fileName.lastIndexOf("."),
    );
    name = `${fileNameWithoutExtension}.${extension}`;
  } else name = fileName;

  const parsedName = `patven-${Date.now()}-${slugify(name, {
    lower: true,
    trim: true,
  })}`;

  return {
    absolutePath: path.join(mediaPath, parsedName),
    relativePath: path.join("media", uploadPath, parsedName),
  };
}

export const strToBool = (bool: string) =>
  bool === "true" ? true : bool === "false" ? false : undefined;

export function generateStrongPassword(length = 16): string {
  /**
  Generates a strong random password of the specified length.

  Args:
      length (int, optional): The desired length of the password. Defaults to 16.

  Returns:
      string: The generated strong random password.
  */

  const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseLetters = lowercaseLetters.toUpperCase();
  const digits = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{};':\"\\|,.<>/?";

  // Combine all character sets
  const allChars = `${lowercaseLetters}${uppercaseLetters}${digits}${symbols}`;

  let password = "";
  const charSets = [lowercaseLetters, uppercaseLetters, digits, symbols];
  let requiredSets = charSets.length;

  while (password.length < length) {
    // Choose a random character set
    const randomSetIndex = Math.floor(Math.random() * charSets.length);
    const randomCharSet = charSets[randomSetIndex];

    // Pick a random character from the chosen set
    const charIndex = Math.floor(Math.random() * randomCharSet.length);
    password += randomCharSet.charAt(charIndex);

    // Track used character sets
    if (password.includes(randomCharSet[0])) {
      requiredSets--;
    }

    // Exit loop if all required sets are included
    if (requiredSets === 0) {
      break;
    }
  }

  return password;
}
