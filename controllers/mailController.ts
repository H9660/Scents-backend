import { emailData, NumberRecord } from "../parsers/Parsers.js";
import { z } from "zod";
import asyncHandler from "express-async-handler";
import { Send } from "../utils/emailClient.js";
type Cart = z.infer<typeof NumberRecord>;
export const sendMail = asyncHandler(async (req: any, res: any, next: any) => {
  const parsedBody = emailData.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(411).json({
      message: "Please check the email data.",
    });
    return;
  }

  const cartItems = renderCartItemsHTML(parsedBody.data.cartdata.cart);
  const templatedata = {
    transactionId: parsedBody.data.transactionId,
    email: parsedBody.data.email,
    name: parsedBody.data.name,
    city: parsedBody.data.address.city,
    street: parsedBody.data.address.street,
    state: parsedBody.data.address.state,
    pincode: parsedBody.data.address.pincode,
    country: parsedBody.data.address.country,
    total: parsedBody.data.cartdata.price,
    cartItemsHTML: cartItems,
  };
  
  try{
  const response = await Send(templatedata, parsedBody.data.email);
  console.log(response);
  res.status(200).send(response);
  }catch(error){
    console.log(error)
    res.state(500)
    throw new Error("Internal server error!")
  }
});

function renderCartItemsHTML(items: Cart) {
  return Object.entries(items)
    .map(
      ([ele, item]) => `
      <li style="display: flex; align-items: center; padding: 15px 0; border-bottom: 1px solid #e0e0e0;">
        <img src="${item.imageUrl}" alt="${item.price}" width="100" height="60" />
        <div style="flex: 1; margin-left: 15px;">
          <p style="font-size: 16px; font-weight: 600; color: #1a1a1a; margin: 0 0 5px;">${item.price}</p>
          <p style="font-size: 14px; color: #555555; margin: 0 0 5px;">₹ ${item.price}</p>
          <p style="font-size: 12px; color: #888888; margin: 0;">Quantity: ${item.quantity}</p>
        </div>
      </li>
    `
    )
    .join("");
}
