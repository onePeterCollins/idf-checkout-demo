import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProductSchema, 
  insertCategorySchema, 
  insertTagSchema,
  insertProductTagSchema,
  insertDiscountSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertReturnSchema
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Products API
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      // For demo purposes, using a fixed userId
      const userId = 1;
      const products = await storage.getProducts(userId);
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req: Request, res: Response) => {
    try {
      // Validate request body against schema
      const validData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validData);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: err.format() });
      }
      console.error(err);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.patch("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      // Partial validation
      const validData = insertProductSchema.partial().parse(req.body);
      const updatedProduct = await storage.updateProduct(id, validData);
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(updatedProduct);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: err.format() });
      }
      console.error(err);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Categories API
  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      // For demo purposes, using a fixed userId
      const userId = 1;
      const categories = await storage.getCategories(userId);
      res.json(categories);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  app.post("/api/categories", async (req: Request, res: Response) => {
    try {
      const validData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validData);
      res.status(201).json(category);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: err.format() });
      }
      console.error(err);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.patch("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const validData = insertCategorySchema.partial().parse(req.body);
      const updatedCategory = await storage.updateCategory(id, validData);
      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(updatedCategory);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: err.format() });
      }
      console.error(err);
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const success = await storage.deleteCategory(id);
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Get products by category
  app.get("/api/categories/:id/products", async (req: Request, res: Response) => {
    try {
      const categoryId = Number(req.params.id);
      const products = await storage.getProductsByCategory(categoryId);
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch products by category" });
    }
  });

  // Tags API
  app.get("/api/tags", async (req: Request, res: Response) => {
    try {
      // For demo purposes, using a fixed userId
      const userId = 1;
      const tags = await storage.getTags(userId);
      res.json(tags);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch tags" });
    }
  });

  app.post("/api/tags", async (req: Request, res: Response) => {
    try {
      const validData = insertTagSchema.parse(req.body);
      const tag = await storage.createTag(validData);
      res.status(201).json(tag);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid tag data", errors: err.format() });
      }
      console.error(err);
      res.status(500).json({ message: "Failed to create tag" });
    }
  });

  app.delete("/api/tags/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const success = await storage.deleteTag(id);
      if (!success) {
        return res.status(404).json({ message: "Tag not found" });
      }
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete tag" });
    }
  });

  // Product Tags API
  app.get("/api/products/:id/tags", async (req: Request, res: Response) => {
    try {
      const productId = Number(req.params.id);
      const tags = await storage.getProductTags(productId);
      res.json(tags);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch product tags" });
    }
  });

  app.post("/api/products/:id/tags", async (req: Request, res: Response) => {
    try {
      const productId = Number(req.params.id);
      const validData = insertProductTagSchema.parse({ ...req.body, productId });
      const productTag = await storage.addTagToProduct(validData);
      res.status(201).json(productTag);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product tag data", errors: err.format() });
      }
      console.error(err);
      res.status(500).json({ message: "Failed to add tag to product" });
    }
  });

  app.delete("/api/products/:productId/tags/:tagId", async (req: Request, res: Response) => {
    try {
      const productId = Number(req.params.productId);
      const tagId = Number(req.params.tagId);
      const success = await storage.removeTagFromProduct(productId, tagId);
      if (!success) {
        return res.status(404).json({ message: "Product tag not found" });
      }
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to remove tag from product" });
    }
  });

  // Discounts API
  app.get("/api/discounts", async (req: Request, res: Response) => {
    try {
      // For demo purposes, using a fixed userId
      const userId = 1;
      const discounts = await storage.getDiscounts(userId);
      res.json(discounts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch discounts" });
    }
  });

  app.get("/api/discounts/active", async (req: Request, res: Response) => {
    try {
      // For demo purposes, using a fixed userId
      const userId = 1;
      const discounts = await storage.getActiveDiscounts(userId);
      res.json(discounts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch active discounts" });
    }
  });

  app.get("/api/discounts/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const discount = await storage.getDiscount(id);
      if (!discount) {
        return res.status(404).json({ message: "Discount not found" });
      }
      res.json(discount);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch discount" });
    }
  });

  app.post("/api/discounts", async (req: Request, res: Response) => {
    try {
      const validData = insertDiscountSchema.parse(req.body);
      const discount = await storage.createDiscount(validData);
      res.status(201).json(discount);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid discount data", errors: err.format() });
      }
      console.error(err);
      res.status(500).json({ message: "Failed to create discount" });
    }
  });

  app.patch("/api/discounts/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const validData = insertDiscountSchema.partial().parse(req.body);
      const updatedDiscount = await storage.updateDiscount(id, validData);
      if (!updatedDiscount) {
        return res.status(404).json({ message: "Discount not found" });
      }
      res.json(updatedDiscount);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid discount data", errors: err.format() });
      }
      console.error(err);
      res.status(500).json({ message: "Failed to update discount" });
    }
  });

  app.delete("/api/discounts/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const success = await storage.deleteDiscount(id);
      if (!success) {
        return res.status(404).json({ message: "Discount not found" });
      }
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete discount" });
    }
  });

  // Orders API
  app.get("/api/orders", async (req: Request, res: Response) => {
    try {
      // For demo purposes, using a fixed userId
      const userId = 1;
      const orders = await storage.getOrders(userId);
      res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/recent", async (req: Request, res: Response) => {
    try {
      // For demo purposes, using a fixed userId
      const userId = 1;
      const limit = Number(req.query.limit) || 5;
      const orders = await storage.getRecentOrders(userId, limit);
      
      // Enhance orders with item counts
      const enhancedOrders = await Promise.all(orders.map(async (order) => {
        const items = await storage.getOrderItems(order.id);
        return {
          ...order,
          itemCount: items.length,
          items: items
        };
      }));
      
      res.json(enhancedOrders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch recent orders" });
    }
  });

  app.get("/api/orders/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Include order items
      const orderItems = await storage.getOrderItems(id);
      
      res.json({
        ...order,
        items: orderItems
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const validData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validData);
      
      // Create order items if included
      if (req.body.items && Array.isArray(req.body.items)) {
        for (const item of req.body.items) {
          const validItemData = insertOrderItemSchema.parse({
            ...item,
            orderId: order.id
          });
          await storage.createOrderItem(validItemData);
        }
      }
      
      res.status(201).json(order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: err.format() });
      }
      console.error(err);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.patch("/api/orders/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const validData = insertOrderSchema.partial().parse(req.body);
      const updatedOrder = await storage.updateOrder(id, validData);
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(updatedOrder);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: err.format() });
      }
      console.error(err);
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // Returns API
  app.get("/api/returns", async (req: Request, res: Response) => {
    try {
      // For demo purposes, using a fixed userId
      const userId = 1;
      const returns = await storage.getReturns(userId);
      
      // Enhance returns with order information
      const enhancedReturns = await Promise.all(returns.map(async (returnItem) => {
        const order = await storage.getOrder(returnItem.orderId);
        return {
          ...returnItem,
          order
        };
      }));
      
      res.json(enhancedReturns);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch returns" });
    }
  });

  app.get("/api/returns/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const returnItem = await storage.getReturn(id);
      if (!returnItem) {
        return res.status(404).json({ message: "Return not found" });
      }
      
      // Include related order
      const order = await storage.getOrder(returnItem.orderId);
      
      res.json({
        ...returnItem,
        order
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch return" });
    }
  });

  app.post("/api/returns", async (req: Request, res: Response) => {
    try {
      const validData = insertReturnSchema.parse(req.body);
      const returnItem = await storage.createReturn(validData);
      res.status(201).json(returnItem);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid return data", errors: err.format() });
      }
      console.error(err);
      res.status(500).json({ message: "Failed to create return" });
    }
  });

  app.patch("/api/returns/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const validData = insertReturnSchema.partial().parse(req.body);
      const updatedReturn = await storage.updateReturn(id, validData);
      if (!updatedReturn) {
        return res.status(404).json({ message: "Return not found" });
      }
      res.json(updatedReturn);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid return data", errors: err.format() });
      }
      console.error(err);
      res.status(500).json({ message: "Failed to update return" });
    }
  });

  // Analytics API
  app.get("/api/analytics/dashboard", async (req: Request, res: Response) => {
    try {
      // For demo purposes, using a fixed userId
      const userId = 1;
      
      // Get total revenue, profits, customers, and active products
      const totalRevenue = await storage.getTotalRevenue(userId);
      const totalProfit = await storage.getTotalProfit(userId);
      const totalCustomers = await storage.getTotalCustomers(userId);
      const products = await storage.getProducts(userId);
      const activeProducts = products.length;
      
      // Get product counts by category
      const productCountsByCategory = await storage.getProductCounts(userId);
      
      // Get recent orders
      const recentOrders = await storage.getRecentOrders(userId, 5);
      
      // Get active promotions
      const activeDiscounts = await storage.getActiveDiscounts(userId);
      
      res.json({
        stats: {
          totalRevenue,
          totalProfit,
          totalCustomers,
          activeProducts
        },
        productCountsByCategory,
        recentOrders,
        activeDiscounts
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch dashboard analytics" });
    }
  });

  app.get("/api/analytics/product-revenue", async (req: Request, res: Response) => {
    try {
      // For demo purposes, using a fixed userId
      const userId = 1;
      
      // Parse date range if provided
      let startDate: Date | undefined;
      let endDate: Date | undefined;
      
      if (req.query.startDate) {
        startDate = new Date(req.query.startDate as string);
      }
      
      if (req.query.endDate) {
        endDate = new Date(req.query.endDate as string);
      }
      
      const productRevenue = await storage.getProductRevenue(userId, startDate, endDate);
      res.json(productRevenue);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch product revenue" });
    }
  });

  // Social Media Import API (Mock functionality)
  app.post("/api/import/:platform", async (req: Request, res: Response) => {
    try {
      const platform = req.params.platform;
      const validPlatforms = ['facebook', 'instagram', 'whatsapp', 'tiktok'];
      
      if (!validPlatforms.includes(platform)) {
        return res.status(400).json({ message: "Invalid platform. Supported platforms: facebook, instagram, whatsapp, tiktok" });
      }
      
      // Mock successful import response
      res.json({
        success: true,
        message: `Products successfully imported from ${platform}`,
        importedCount: Math.floor(Math.random() * 10) + 1
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to import products" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
