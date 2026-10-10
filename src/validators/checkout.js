import { z } from "zod";


export const checkoutSchema = z.object({

  name: z
    .string()
    .trim()
    .min(
      2,
      "Please enter your full name.",
    ),


  email: z
    .string()
    .trim()
    .email(
      "Please provide a valid email address.",
    ),


  phone: z
    .string()
    .trim()
    .min(
      7,
      "Please enter a valid phone number.",
    ),


  deliveryMethod: z.enum([
    "delivery",
    "pickup",
  ]),


  deliveryLocation: z
    .object({
      addressText: z.string().optional(),

      latitude: z.number().nullable().optional(),

      longitude: z.number().nullable().optional(),
    })
    .optional(),


  instructions: z
    .string()
    .optional(),

});