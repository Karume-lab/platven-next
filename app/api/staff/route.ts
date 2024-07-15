import { staffFormSchema } from "@/components/forms/staff/schema";
import {
  generateStrongPassword,
  getSessionUser,
  hashPassword,
  saveMediaFileName,
  strToBool,
} from "@/lib/auth-utils";
import config from "@/lib/config";
import prisma from "@/prisma/client";
import { parseMessage } from "@/services";
import { sendMail } from "@/services/mail-service";
import { isEmpty } from "lodash";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const POST = async (request: NextRequest) => {
  const user = await getSessionUser();
  const formData = await request.formData();
  const data = Array.from(formData.entries()).reduce<any>(
    (prev, [key, value]) => {
      if (key === "image") return prev;
      return { ...prev, [key]: value };
    },
    {},
  );
  const validation = await staffFormSchema.safeParseAsync({
    ...data,
    isActive: strToBool(data.isActive),
    isStaff: strToBool(data.isStaff),
    isSuperUser: strToBool(data.isSuperUser),
  });

  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const {
    position,
    email,
    phoneNumber,
    address,
    isActive,
    name,
    identificationNumber,
    type,
    isStaff,
    isSuperUser,
  } = validation.data;

  const errors: any = {};

  let user_ = await prisma.user.findUnique({ where: { email } });
  if (user_) errors["email"] = { _errors: ["User with email exists"] };
  user_ = await prisma.user.findUnique({
    where: { phoneNumber: String(phoneNumber) },
  });
  if (user_) errors["phoneNumber"] = { _errors: ["User with phone exists"] };
  user_ = await prisma.user.findUnique({ where: { identificationNumber } });
  if (user_)
    errors["identificationNumber"] = { _errors: ["User with number exists"] };

  if (!isEmpty(errors)) {
    return NextResponse.json(errors, { status: 400 });
  }

  let image;
  const imageFile = formData.get("image");
  if (imageFile) {
    const { absolutePath, relativePath } = saveMediaFileName(
      "avatar/staff",
      (imageFile as File).name ?? "",
      "jpeg",
    );
    image = relativePath;
    await sharp(await (imageFile as File).arrayBuffer())
      .toFormat("jpeg", { mozjpeg: true })
      .resize(400, 400, { fit: "cover" })
      .toFile(absolutePath);
  } else {
    return NextResponse.json(
      { image: { _errors: ["Image required"] } },
      { status: 400 },
    );
  }

  const password = generateStrongPassword();

  const hash = await hashPassword(password);

  const newUser = await prisma.user.create({
    data: {
      email,
      phoneNumber: String(phoneNumber),
      address,
      name,
      isStaff,
      isSuperUser,
      team: { create: { image, position, isActive: isActive } },
      password: hash,
      identificationNumber,
      type,
      accountVerified: true,
    },
  });

  const message = parseMessage<{
    staff_name: string;
    staff_email: string;
    staff_password: string;
    platven_login_url: string;
    support_email: string;
  }>(
    {
      staff_email: newUser.email,
      staff_name: newUser.name,
      staff_password: password,
      support_email: "support@platven.ke",
      platven_login_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/sign-in`,
    },
    config.MESSAGE.STAFF_ACCOUNT_SETUP,
  );

  const info = await sendMail({
    toEmail: email,
    text: message,
  });

  return NextResponse.json(newUser);
};
