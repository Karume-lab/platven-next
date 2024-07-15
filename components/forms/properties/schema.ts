import { z } from "zod";


export const propertyFormSchema = z.object({
  title: z.string().min(1, "Title required"),
  status: z.enum(["onRent", "onSale"]).default("onRent"),
  price: z.number({ coerce: true }),
  features: z.string(),
  county: z.string().min(1, "County Required"),
  subCounty: z.string().min(1, "Sub county required"),
  landMark: z.string().min(1, "Landmark required"),
  roadAccessNature: z.enum(["Highway", "Tarmac", "Murram"]),
  size: z.string().optional(),
  listed: z.boolean({ coerce: true }),
});


export const basePropertyFormSchema = z.object({
  title: z.string().min(1, "Title required"),
  typeId: z.string().uuid("Invalid property type").optional(),
  status: z.enum(["onRent", "onSale"]).default("onRent"),
  features: z.string(),
  county: z.string().min(1, "County Required"),
  subCounty: z.string().min(1, "Sub county required"),
  landMark: z.string().min(1, "Landmark required"),
  listed: z.boolean({ coerce: true }),
  price: z.number({ coerce: true }),
});

export const landFormSchema = basePropertyFormSchema.merge(z.object({
  roadAccessNature: z.enum(["Highway", "Tarmac", "Murram"]),
  size: z.string().optional(),
}));

export const appartmentFormSchema = basePropertyFormSchema.merge(z.object({
  noOfBedRooms: z.number().min(1, "Number of bedrooms must be at least 1"),
  size: z.string().optional(),
  rentPerMonth: z.number().positive("Rent must be a positive number"),
  depositAmount: z.number().nonnegative("Deposit amount cannot be negative"),
  availableFrom: z.date().min(new Date(), "Available date must be in the future"),
  furnished: z.boolean().default(false),
  utilities: z.array(z.enum(['Water', 'Electricity', 'Internet', 'Gas', 'Heating'])).optional(),
  amenities: z.array(z.enum(['Parking', 'Gym', 'Swimming Pool', 'Security', 'Elevator'])).optional(),
}));


export const homeFormSchema = basePropertyFormSchema.merge(z.object({
  noOfBedRooms: z.number().min(1, "Number of bedrooms must be at least 1"),
  noOfBathrooms: z.number().min(1, "Number of bathrooms must be at least 1"),
  plotSize: z.string().optional(),
  size: z.string().min(1, "Size is required"),
  yearBuilt: z.number().min(1800, "Year built must be after 1800").max(new Date().getFullYear(), "Year built cannot be in the future"),
  homeType: z.enum(['Single Family', 'Bungalow', 'Condo', 'Multi-Family']),
  parkingSpaces: z.number().nonnegative("Number of parking spaces cannot be negative"),
  basement: z.boolean().default(false),
  flooring: z.array(z.enum(['Hardwood', 'Carpet', 'Tile', 'Vinyl', 'Concrete'])).optional(),
  exteriorMaterial: z.array(z.enum(['Brick', 'Vinyl', 'Wood', 'Stucco', 'Stone'])).optional(),
  roof: z.enum(['Asphalt', 'Metal', 'Tile', 'Slate', 'Other']).optional(),
  nearbyAmenities: z.array(z.string()).optional(),
}));

export const propertyTypeSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  isActive: z.boolean({ coerce: true }),
  // .transform(str => str === 'true' ? true : str === 'false' ? false : undefined),
});

export const propertyFilterSchema = z.object({
  search: z.string().optional(),
  county: z.string().optional(),
  status: z.enum(["onRent", "onSale"]).default("onRent").optional(),
  typeId: z.string().uuid("Invalid property type").optional(),
  subCounty: z.string().optional(),
  minPrice: z.number({ coerce: true }).optional(),
  maxPrice: z.number({ coerce: true }).optional(),
});

export const propertyRequestFormSchema = z.object({
  propertyId: z.string().uuid(),
  name: z.string().min(1, { message: "Name required" }),
  email: z.string().email(),
  phoneNumber: z.coerce.number().refine((numb) => {
    const n = String(numb);
    return n.length === 9 && (n.startsWith("1") || n.startsWith("7"));
  }, "Invalid number, must follow 710000000"),
  message: z.string().min(1, { message: "You must leave your message" }),
  isAddressed: z.boolean().optional(),
});

export const propertyRejectionSchema = z.object({
  reason: z.string().min(1, { message: "Reason for rejection required" }),
});
