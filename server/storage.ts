import {
  User, InsertUser, users,
  Product, InsertProduct, products,
  Category, InsertCategory, categories,
  Tag, InsertTag, tags,
  ProductTag, InsertProductTag, productTags,
  Discount, InsertDiscount, discounts,
  Order, InsertOrder, orders,
  OrderItem, InsertOrderItem, orderItems,
  Return, InsertReturn, returns
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product operations
  getProducts(userId: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getProductsByTag(tagId: number): Promise<Product[]>;
  
  // Category operations
  getCategories(userId: number): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Tag operations
  getTags(userId: number): Promise<Tag[]>;
  getTag(id: number): Promise<Tag | undefined>;
  createTag(tag: InsertTag): Promise<Tag>;
  deleteTag(id: number): Promise<boolean>;
  
  // ProductTag operations
  addTagToProduct(productTag: InsertProductTag): Promise<ProductTag>;
  removeTagFromProduct(productId: number, tagId: number): Promise<boolean>;
  getProductTags(productId: number): Promise<Tag[]>;
  
  // Discount operations
  getDiscounts(userId: number): Promise<Discount[]>;
  getDiscount(id: number): Promise<Discount | undefined>;
  createDiscount(discount: InsertDiscount): Promise<Discount>;
  updateDiscount(id: number, discount: Partial<InsertDiscount>): Promise<Discount | undefined>;
  deleteDiscount(id: number): Promise<boolean>;
  getActiveDiscounts(userId: number): Promise<Discount[]>;
  
  // Order operations
  getOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order | undefined>;
  getRecentOrders(userId: number, limit: number): Promise<Order[]>;
  
  // OrderItem operations
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Return operations
  getReturns(userId: number): Promise<Return[]>;
  getReturn(id: number): Promise<Return | undefined>;
  createReturn(returnRequest: InsertReturn): Promise<Return>;
  updateReturn(id: number, returnUpdate: Partial<InsertReturn>): Promise<Return | undefined>;
  
  // Analytics operations
  getProductRevenue(userId: number, startDate?: Date, endDate?: Date): Promise<{productId: number, name: string, revenue: number}[]>;
  getTotalRevenue(userId: number, startDate?: Date, endDate?: Date): Promise<number>;
  getTotalProfit(userId: number, startDate?: Date, endDate?: Date): Promise<number>;
  getTotalCustomers(userId: number): Promise<number>;
  getProductCounts(userId: number): Promise<{categoryId: number, name: string, count: number}[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private categories: Map<number, Category>;
  private tags: Map<number, Tag>;
  private productTags: Map<number, ProductTag>;
  private discounts: Map<number, Discount>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private returns: Map<number, Return>;
  private currentIds: Map<string, number>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.categories = new Map();
    this.tags = new Map();
    this.productTags = new Map();
    this.discounts = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.returns = new Map();
    this.currentIds = new Map([
      ['users', 1],
      ['products', 1],
      ['categories', 1],
      ['tags', 1],
      ['productTags', 1],
      ['discounts', 1],
      ['orders', 1],
      ['orderItems', 1],
      ['returns', 1]
    ]);
    
    // Initialize with some sample data
    this.initSampleData();
  }

  private getNextId(entity: string): number {
    const currentId = this.currentIds.get(entity) || 1;
    this.currentIds.set(entity, currentId + 1);
    return currentId;
  }

  private initSampleData() {
    // Create a sample user
    const user: InsertUser = {
      username: 'demo',
      password: 'password',
      name: 'Tom Cook',
      email: 'tom@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    };
    const createdUser = this.createUser(user);
    
    // Create sample categories
    const categories = [
      { name: 'Footwear', description: 'All types of shoes', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80', userId: createdUser.id },
      { name: 'Apparel', description: 'Clothing items', imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80', userId: createdUser.id },
      { name: 'Electronics', description: 'Electronic gadgets', imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80', userId: createdUser.id },
    ];
    
    const createdCategories = categories.map(category => this.createCategory(category));
    
    // Create sample products
    const products = [
      { name: 'Premium Headphones', description: 'High quality headphones', price: 159.00, cost: 80.00, imageUrl: 'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80', stock: 25, userId: createdUser.id, categoryId: createdCategories[2].id },
      { name: 'Smart Watch', description: 'Latest smartwatch technology', price: 249.00, cost: 150.00, imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80', stock: 15, userId: createdUser.id, categoryId: createdCategories[2].id },
      { name: 'Running Shoes', description: 'Comfortable running shoes', price: 120.00, cost: 60.00, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80', stock: 30, userId: createdUser.id, categoryId: createdCategories[0].id },
      { name: 'T-Shirt', description: 'Cotton t-shirt', price: 25.00, cost: 8.00, imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80', stock: 100, userId: createdUser.id, categoryId: createdCategories[1].id },
    ];
    
    const createdProducts = products.map(product => this.createProduct(product));
    
    // Create sample tags
    const tags = [
      { name: 'New Arrival', userId: createdUser.id },
      { name: 'Bestseller', userId: createdUser.id },
      { name: 'Limited Edition', userId: createdUser.id },
      { name: 'Sale', userId: createdUser.id },
    ];
    
    const createdTags = tags.map(tag => this.createTag(tag));
    
    // Add tags to products
    this.addTagToProduct({ productId: createdProducts[0].id, tagId: createdTags[0].id });
    this.addTagToProduct({ productId: createdProducts[1].id, tagId: createdTags[1].id });
    this.addTagToProduct({ productId: createdProducts[2].id, tagId: createdTags[3].id });
    this.addTagToProduct({ productId: createdProducts[3].id, tagId: createdTags[2].id });
    
    // Create sample discounts
    const discounts = [
      { name: 'Summer Sale', description: '20% off all apparel', type: 'percentage', value: 20, startDate: new Date(), endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), isActive: true, scope: 'category', scopeId: createdCategories[1].id, userId: createdUser.id },
      { name: 'New Customer', description: '15% off first purchase', type: 'percentage', value: 15, isActive: true, scope: 'all', userId: createdUser.id },
      { name: 'Weekend Flash', description: '30% off electronics', type: 'percentage', value: 30, startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), isActive: true, scope: 'category', scopeId: createdCategories[2].id, userId: createdUser.id },
    ];
    
    discounts.forEach(discount => this.createDiscount(discount));
    
    // Create sample orders
    const orders = [
      { customerName: 'Sarah Johnson', customerEmail: 'sarah@example.com', customerPhone: '123-456-7890', shippingAddress: '123 Main St, City, State, 12345', total: 159.99, status: 'completed', paymentStatus: 'paid', escrowStatus: 'released', userId: createdUser.id },
      { customerName: 'Michael Davis', customerEmail: 'michael@example.com', customerPhone: '234-567-8901', shippingAddress: '456 Oak St, City, State, 12345', total: 89.99, status: 'shipped', paymentStatus: 'paid', escrowStatus: 'pending', trackingNumber: 'TRK123456', shippingCarrier: 'FedEx', userId: createdUser.id },
      { customerName: 'Emily Wilson', customerEmail: 'emily@example.com', customerPhone: '345-678-9012', shippingAddress: '789 Pine St, City, State, 12345', total: 129.99, status: 'processing', paymentStatus: 'paid', escrowStatus: 'pending', userId: createdUser.id },
      { customerName: 'James Brown', customerEmail: 'james@example.com', customerPhone: '456-789-0123', shippingAddress: '101 Elm St, City, State, 12345', total: 299.99, status: 'delivered', paymentStatus: 'paid', escrowStatus: 'pending', trackingNumber: 'TRK789012', shippingCarrier: 'UPS', userId: createdUser.id },
    ];
    
    const createdOrders = orders.map(order => this.createOrder(order));
    
    // Create sample order items
    const orderItems = [
      { orderId: createdOrders[0].id, productId: createdProducts[0].id, productName: createdProducts[0].name, price: createdProducts[0].price, quantity: 1, total: createdProducts[0].price },
      { orderId: createdOrders[1].id, productId: createdProducts[2].id, productName: createdProducts[2].name, price: createdProducts[2].price, quantity: 1, total: createdProducts[2].price },
      { orderId: createdOrders[2].id, productId: createdProducts[3].id, productName: createdProducts[3].name, price: createdProducts[3].price, quantity: 2, total: createdProducts[3].price * 2 },
      { orderId: createdOrders[3].id, productId: createdProducts[1].id, productName: createdProducts[1].name, price: createdProducts[1].price, quantity: 1, total: createdProducts[1].price },
      { orderId: createdOrders[3].id, productId: createdProducts[0].id, productName: createdProducts[0].name, price: createdProducts[0].price, quantity: 1, total: createdProducts[0].price },
    ];
    
    orderItems.forEach(item => this.createOrderItem(item));
    
    // Create sample return
    const returnRequest = {
      orderId: createdOrders[3].id,
      reason: 'Item not as described',
      requestedItems: JSON.stringify([createdOrders[3].id]),
      status: 'pending'
    };
    
    this.createReturn(returnRequest);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.getNextId('users');
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Product operations
  async getProducts(userId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.userId === userId
    );
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.getNextId('products');
    const product: Product = { 
      ...insertProduct, 
      id, 
      createdAt: new Date() 
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, productUpdate: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productUpdate };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.categoryId === categoryId
    );
  }

  async getProductsByTag(tagId: number): Promise<Product[]> {
    const productIds = Array.from(this.productTags.values())
      .filter(pt => pt.tagId === tagId)
      .map(pt => pt.productId);
    
    return Array.from(this.products.values()).filter(
      product => productIds.includes(product.id)
    );
  }

  // Category operations
  async getCategories(userId: number): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(
      category => category.userId === userId
    );
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.getNextId('categories');
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: number, categoryUpdate: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...categoryUpdate };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Tag operations
  async getTags(userId: number): Promise<Tag[]> {
    return Array.from(this.tags.values()).filter(
      tag => tag.userId === userId
    );
  }

  async getTag(id: number): Promise<Tag | undefined> {
    return this.tags.get(id);
  }

  async createTag(insertTag: InsertTag): Promise<Tag> {
    const id = this.getNextId('tags');
    const tag: Tag = { ...insertTag, id };
    this.tags.set(id, tag);
    return tag;
  }

  async deleteTag(id: number): Promise<boolean> {
    return this.tags.delete(id);
  }

  // ProductTag operations
  async addTagToProduct(insertProductTag: InsertProductTag): Promise<ProductTag> {
    const id = this.getNextId('productTags');
    const productTag: ProductTag = { ...insertProductTag, id };
    this.productTags.set(id, productTag);
    return productTag;
  }

  async removeTagFromProduct(productId: number, tagId: number): Promise<boolean> {
    const productTagEntry = Array.from(this.productTags.entries()).find(
      ([_, pt]) => pt.productId === productId && pt.tagId === tagId
    );
    
    if (!productTagEntry) return false;
    return this.productTags.delete(productTagEntry[0]);
  }

  async getProductTags(productId: number): Promise<Tag[]> {
    const tagIds = Array.from(this.productTags.values())
      .filter(pt => pt.productId === productId)
      .map(pt => pt.tagId);
    
    return Array.from(this.tags.values()).filter(
      tag => tagIds.includes(tag.id)
    );
  }

  // Discount operations
  async getDiscounts(userId: number): Promise<Discount[]> {
    return Array.from(this.discounts.values()).filter(
      discount => discount.userId === userId
    );
  }

  async getDiscount(id: number): Promise<Discount | undefined> {
    return this.discounts.get(id);
  }

  async createDiscount(insertDiscount: InsertDiscount): Promise<Discount> {
    const id = this.getNextId('discounts');
    const discount: Discount = { ...insertDiscount, id };
    this.discounts.set(id, discount);
    return discount;
  }

  async updateDiscount(id: number, discountUpdate: Partial<InsertDiscount>): Promise<Discount | undefined> {
    const discount = this.discounts.get(id);
    if (!discount) return undefined;
    
    const updatedDiscount = { ...discount, ...discountUpdate };
    this.discounts.set(id, updatedDiscount);
    return updatedDiscount;
  }

  async deleteDiscount(id: number): Promise<boolean> {
    return this.discounts.delete(id);
  }

  async getActiveDiscounts(userId: number): Promise<Discount[]> {
    const now = new Date();
    return Array.from(this.discounts.values()).filter(
      discount => 
        discount.userId === userId && 
        discount.isActive && 
        (!discount.startDate || discount.startDate <= now) && 
        (!discount.endDate || discount.endDate >= now)
    );
  }

  // Order operations
  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      order => order.userId === userId
    );
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.getNextId('orders');
    const order: Order = { 
      ...insertOrder, 
      id, 
      createdAt: new Date() 
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: number, orderUpdate: Partial<InsertOrder>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, ...orderUpdate };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async getRecentOrders(userId: number, limit: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  // OrderItem operations
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      item => item.orderId === orderId
    );
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.getNextId('orderItems');
    const orderItem: OrderItem = { ...insertOrderItem, id };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  // Return operations
  async getReturns(userId: number): Promise<Return[]> {
    const orderIds = Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .map(order => order.id);
    
    return Array.from(this.returns.values()).filter(
      returnItem => orderIds.includes(returnItem.orderId)
    );
  }

  async getReturn(id: number): Promise<Return | undefined> {
    return this.returns.get(id);
  }

  async createReturn(insertReturn: InsertReturn): Promise<Return> {
    const id = this.getNextId('returns');
    const returnItem: Return = { 
      ...insertReturn, 
      id, 
      createdAt: new Date() 
    };
    this.returns.set(id, returnItem);
    return returnItem;
  }

  async updateReturn(id: number, returnUpdate: Partial<InsertReturn>): Promise<Return | undefined> {
    const returnItem = this.returns.get(id);
    if (!returnItem) return undefined;
    
    const updatedReturn = { ...returnItem, ...returnUpdate };
    this.returns.set(id, updatedReturn);
    return updatedReturn;
  }

  // Analytics operations
  async getProductRevenue(userId: number, startDate?: Date, endDate?: Date): Promise<{productId: number, name: string, revenue: number}[]> {
    const ordersByUser = Array.from(this.orders.values()).filter(order => order.userId === userId);
    const orderIds = ordersByUser.map(order => order.id);
    
    // Get all order items for these orders
    const relevantOrderItems = Array.from(this.orderItems.values()).filter(
      item => orderIds.includes(item.orderId)
    );
    
    // Group by product and calculate revenue
    const productRevenueMap = new Map<number, {name: string, revenue: number}>();
    
    for (const item of relevantOrderItems) {
      const order = this.orders.get(item.orderId);
      
      // Skip if order is outside date range
      if (order?.createdAt) {
        if (startDate && order.createdAt < startDate) continue;
        if (endDate && order.createdAt > endDate) continue;
      }
      
      if (!productRevenueMap.has(item.productId)) {
        productRevenueMap.set(item.productId, { name: item.productName, revenue: 0 });
      }
      
      const current = productRevenueMap.get(item.productId)!;
      current.revenue += item.total;
      productRevenueMap.set(item.productId, current);
    }
    
    // Convert to array
    return Array.from(productRevenueMap.entries()).map(([productId, data]) => ({
      productId,
      name: data.name,
      revenue: data.revenue
    }));
  }

  async getTotalRevenue(userId: number, startDate?: Date, endDate?: Date): Promise<number> {
    const productRevenues = await this.getProductRevenue(userId, startDate, endDate);
    return productRevenues.reduce((sum, product) => sum + product.revenue, 0);
  }

  async getTotalProfit(userId: number, startDate?: Date, endDate?: Date): Promise<number> {
    // Get all orders within date range
    let orders = Array.from(this.orders.values()).filter(order => order.userId === userId);
    
    if (startDate) {
      orders = orders.filter(order => !order.createdAt || order.createdAt >= startDate);
    }
    
    if (endDate) {
      orders = orders.filter(order => !order.createdAt || order.createdAt <= endDate);
    }
    
    let totalProfit = 0;
    
    for (const order of orders) {
      const orderItems = await this.getOrderItems(order.id);
      
      for (const item of orderItems) {
        const product = await this.getProduct(item.productId);
        if (product) {
          const cost = product.cost * item.quantity;
          const revenue = item.total;
          totalProfit += (revenue - cost);
        }
      }
    }
    
    return totalProfit;
  }

  async getTotalCustomers(userId: number): Promise<number> {
    const uniqueCustomerEmails = new Set(
      Array.from(this.orders.values())
        .filter(order => order.userId === userId)
        .map(order => order.customerEmail)
    );
    
    return uniqueCustomerEmails.size;
  }

  async getProductCounts(userId: number): Promise<{categoryId: number, name: string, count: number}[]> {
    const categories = await this.getCategories(userId);
    
    const result: {categoryId: number, name: string, count: number}[] = [];
    
    for (const category of categories) {
      const products = await this.getProductsByCategory(category.id);
      result.push({
        categoryId: category.id,
        name: category.name,
        count: products.length
      });
    }
    
    return result;
  }
}

export const storage = new MemStorage();
