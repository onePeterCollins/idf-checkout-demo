import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  storeName: z.string().min(2, { message: "Store name must be at least 2 characters." }),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const notificationFormSchema = z.object({
  orderConfirmations: z.boolean().default(true),
  orderUpdates: z.boolean().default(true),
  returnRequests: z.boolean().default(true),
  productReviews: z.boolean().default(false),
  marketingEmails: z.boolean().default(false),
});

const escrowFormSchema = z.object({
  holdPeriod: z.string().default("14"),
  automaticRelease: z.boolean().default(true),
  disputeTime: z.string().default("7"),
});

const logisticsFormSchema = z.object({
  defaultCarrier: z.string().default(""),
  defaultShippingFee: z.string().default("0"),
  trackingEnabled: z.boolean().default(true),
  internationalShipping: z.boolean().default(false),
});

export default function Settings() {
  const { toast } = useToast();

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "Tom Cook",
      email: "tom@example.com",
      storeName: "Tom's Store",
      phone: "123-456-7890",
      address: "123 Main St, City, State, 12345",
    },
  });

  const notificationForm = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      orderConfirmations: true,
      orderUpdates: true,
      returnRequests: true,
      productReviews: false,
      marketingEmails: false,
    },
  });

  const escrowForm = useForm<z.infer<typeof escrowFormSchema>>({
    resolver: zodResolver(escrowFormSchema),
    defaultValues: {
      holdPeriod: "14",
      automaticRelease: true,
      disputeTime: "7",
    },
  });

  const logisticsForm = useForm<z.infer<typeof logisticsFormSchema>>({
    resolver: zodResolver(logisticsFormSchema),
    defaultValues: {
      defaultCarrier: "FedEx",
      defaultShippingFee: "15.99",
      trackingEnabled: true,
      internationalShipping: false,
    },
  });

  const onProfileSubmit = (data: z.infer<typeof profileFormSchema>) => {
    toast({
      title: "Profile updated",
      description: "Your profile settings have been saved successfully.",
    });
  };

  const onNotificationSubmit = (data: z.infer<typeof notificationFormSchema>) => {
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved successfully.",
    });
  };

  const onEscrowSubmit = (data: z.infer<typeof escrowFormSchema>) => {
    toast({
      title: "Escrow settings updated",
      description: "Your escrow settings have been saved successfully.",
    });
  };

  const onLogisticsSubmit = (data: z.infer<typeof logisticsFormSchema>) => {
    toast({
      title: "Logistics settings updated",
      description: "Your logistics settings have been saved successfully.",
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and application preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="escrow">Escrow</TabsTrigger>
          <TabsTrigger value="logistics">Logistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your personal and store information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="storeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your store name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="123-456-7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St, City, State, 12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Save Profile</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-4">
                  <FormField
                    control={notificationForm.control}
                    name="orderConfirmations"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Order Confirmations</FormLabel>
                          <FormDescription>
                            Receive notifications when new orders are placed
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={notificationForm.control}
                    name="orderUpdates"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Order Updates</FormLabel>
                          <FormDescription>
                            Receive notifications for order status changes
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={notificationForm.control}
                    name="returnRequests"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Return Requests</FormLabel>
                          <FormDescription>
                            Receive notifications for return and refund requests
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={notificationForm.control}
                    name="productReviews"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Product Reviews</FormLabel>
                          <FormDescription>
                            Receive notifications when customers review your products
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={notificationForm.control}
                    name="marketingEmails"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Marketing Emails</FormLabel>
                          <FormDescription>
                            Receive promotional emails and updates about the platform
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Save Notification Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="escrow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Escrow Settings</CardTitle>
              <CardDescription>
                Configure how escrow payments are handled for your customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Form {...escrowForm}>
                <form onSubmit={escrowForm.handleSubmit(onEscrowSubmit)} className="space-y-4">
                  <FormField
                    control={escrowForm.control}
                    name="holdPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Escrow Hold Period (days)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="30" {...field} />
                        </FormControl>
                        <FormDescription>
                          Number of days to hold funds in escrow after delivery
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={escrowForm.control}
                    name="automaticRelease"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Automatic Release</FormLabel>
                          <FormDescription>
                            Automatically release funds after hold period if no dispute is raised
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={escrowForm.control}
                    name="disputeTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dispute Window (days)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="30" {...field} />
                        </FormControl>
                        <FormDescription>
                          Number of days customers have to raise a dispute after delivery
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Save Escrow Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logistics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logistics Settings</CardTitle>
              <CardDescription>
                Configure shipping and delivery preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Form {...logisticsForm}>
                <form onSubmit={logisticsForm.handleSubmit(onLogisticsSubmit)} className="space-y-4">
                  <FormField
                    control={logisticsForm.control}
                    name="defaultCarrier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Shipping Carrier</FormLabel>
                        <FormControl>
                          <Input placeholder="FedEx, UPS, USPS, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={logisticsForm.control}
                    name="defaultShippingFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Shipping Fee ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={logisticsForm.control}
                    name="trackingEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable Order Tracking</FormLabel>
                          <FormDescription>
                            Provide tracking information to customers for their orders
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={logisticsForm.control}
                    name="internationalShipping"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">International Shipping</FormLabel>
                          <FormDescription>
                            Allow orders to be shipped internationally
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Save Logistics Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
