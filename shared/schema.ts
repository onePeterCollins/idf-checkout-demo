import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  avatar: text("avatar"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  avatar: true,
});

// Products Schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  cost: doublePrecision("cost").notNull(),
  imageUrl: text("image_url"),
  stock: integer("stock").notNull().default(0),
  userId: integer("user_id").notNull(),
  categoryId: integer("category_id"),
  source: text("source").default("manual"), // manual, facebook, instagram, whatsapp, tiktok
  sourceId: text("source_id"), // ID from the original platform
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  price: true,
  cost: true,
  imageUrl: true,
  stock: true,
  userId: true,
  categoryId: true,
  source: true,
  sourceId: true,
});

// Categories Schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  userId: integer("user_id").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  description: true,
  imageUrl: true,
  userId: true,
});

// Tags Schema
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: integer("user_id").notNull(),
});

export const insertTagSchema = createInsertSchema(tags).pick({
  name: true,
  userId: true,
});

// Product Tags Relation
export const productTags = pgTable("product_tags", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  tagId: integer("tag_id").notNull(),
});

export const insertProductTagSchema = createInsertSchema(productTags).pick({
  productId: true,
  tagId: true,
});

// Discounts Schema
export const discounts = pgTable("discounts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // percentage, fixed
  value: doublePrecision("value").notNull(), // percentage or amount
  code: text("code"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  scope: text("scope").notNull(), // all, category, product, tag
  scopeId: integer("scope_id"), // category_id, product_id, or tag_id based on scope
  userId: integer("user_id").notNull(),
});

export const insertDiscountSchema = createInsertSchema(discounts).pick({
  name: true,
  description: true,
  type: true,
  value: true,
  code: true,
  startDate: true,
  endDate: true,
  isActive: true,
  scope: true,
  scopeId: true,
  userId: true,
});

// Orders Schema
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id"),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  shippingAddress: text("shipping_address").notNull(),
  total: doublePrecision("total").notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, shipped, delivered, completed, cancelled, refunded
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, refunded
  escrowStatus: text("escrow_status").notNull().default("pending"), // pending, released, refunded
  trackingNumber: text("tracking_number"),
  shippingCarrier: text("shipping_carrier"),
  createdAt: timestamp("created_at").defaultNow(),
  userId: integer("user_id").notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  customerName: true,
  customerEmail: true,
  customerPhone: true,
  shippingAddress: true,
  total: true,
  status: true,
  paymentStatus: true,
  escrowStatus: true,
  trackingNumber: true,
  shippingCarrier: true,
  userId: true,
});

// Order Items Schema
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  productName: text("product_name").notNull(),
  price: doublePrecision("price").notNull(),
  quantity: integer("quantity").notNull(),
  total: doublePrecision("total").notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  productId: true,
  productName: true,
  price: true,
  quantity: true,
  total: true,
});

// Returns Schema
export const returns = pgTable("returns", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected, completed
  refundAmount: doublePrecision("refund_amount"),
  createdAt: timestamp("created_at").defaultNow(),
  requestedItems: json("requested_items").notNull(), // Array of order item IDs to be returned
});

export const insertReturnSchema = createInsertSchema(returns).pick({
  orderId: true,
  reason: true,
  status: true,
  refundAmount: true,
  requestedItems: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Tag = typeof tags.$inferSelect;
export type InsertTag = z.infer<typeof insertTagSchema>;

export type ProductTag = typeof productTags.$inferSelect;
export type InsertProductTag = z.infer<typeof insertProductTagSchema>;

export type Discount = typeof discounts.$inferSelect;
export type InsertDiscount = z.infer<typeof insertDiscountSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type Return = typeof returns.$inferSelect;
export type InsertReturn = z.infer<typeof insertReturnSchema>;
