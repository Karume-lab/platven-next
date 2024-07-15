import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const {
      Body: {
        stkCallback: {
          MerchantRequestID,
          CheckoutRequestID,
          ResultCode,
          ResultDesc,
          CallbackMetadata: { Item },
        },
      },
    } = await request.json();
    if (!MerchantRequestID || !CheckoutRequestID)
      return NextResponse.json({ detail: "Bad REquest" }, { status: 400 });
    const data = (Item as any[]).reduce((prev, curr) => {
      if (curr.Name === "Amount") return { ...prev, amount: curr.Value };
      else if (curr.Name === "MpesaReceiptNumber")
        return { ...prev, mpesareceiptNumber: curr.Value };
      else if (curr.Name === "TransactionDate")
        return { ...prev, transactionDate: `${curr.Value}` };
      else if (curr.Name === "PhoneNumber")
        return { ...prev, phoneNumber: `${curr.Value}` };
      else return prev;
    }, {});
    const payload = {
      merchantRequestId: MerchantRequestID,
      checkoutRequestId: CheckoutRequestID,
      resultCode: String(ResultCode),
      resultDescription: ResultDesc,
      ...data,
    };

    /*
         {
              "merchantRequestId": "29115-34620561-1",
              "checkoutRequestId": "ws_CO_191220191020363925",
              "resultCode": 0,
              "resultDescription": "The service request is processed successfully.",
              "amount": 1,
              "mpesareceiptNumber": "NLJ7RT61SV",
              "transactionDate": 20191219102115,
              "phoneNumber": 254708374149
           }
         */
    let payment = await prisma.payment.update({
      where: {
        merchantRequestId: payload.merchantRequestId,
        checkoutRequestId: payload.checkoutRequestId,
      },
      data: {
        complete: true,
        ...payload,
      },
    });

    return NextResponse.json(payment);
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      { detail: error.message ?? "Internal server error" },
      { status: error?.status ?? 500 },
    );
  }
};
