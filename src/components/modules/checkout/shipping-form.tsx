"use client"

import { useEffect } from "react"
import { ChevronRight } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CURRENCY } from "@/constants/app.constant"
import type { IShippingFormProps, IShippingFormData, TShippingMethod } from "./types"
import { useLocalStorage } from "@/lib/useLocalStorage"
import { updateUserWithProfile } from "@/lib/repositories/profile.repository"

// Define the form schema with Zod
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9\s-]{10,15}$/, "Please enter a valid phone number"),
  address: z.string().min(1, "Address is required"),
})

export default function ShippingForm({
  initialData,
  onSubmit,
  shippingMethod,
  onShippingMethodChange,
}: IShippingFormProps) {
  const { getLocalStorage } = useLocalStorage();
  const form = useForm<IShippingFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  })

  // Update form values when initialData changes
  useEffect(() => {
    form.reset(initialData)
  }, [initialData, form])

  // Handle form submission
  const handleSubmit = async (data: IShippingFormData) => {
    const profileId = JSON.parse(getLocalStorage("profile") ?? "");
    const response = await updateUserWithProfile({
      id: profileId.id,
      userData: {
        shippingAddress: data.address
      },
    })
    console.log(response, data);
    onSubmit(data)
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Shipping Information</h2>
        <p className="text-muted-foreground">Please enter your shipping details</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Last Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Shipping Address <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Shipping Method</h3>
            <RadioGroup
              value={shippingMethod}
              onValueChange={(value) => onShippingMethodChange(value as TShippingMethod)}
              className="space-y-4"
            >
              <Card className={`border ${shippingMethod === "standard" ? "border-primary" : ""}`}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="cursor-pointer">
                      <div>
                        <p className="font-medium">Standard Shipping</p>
                        <p className="text-sm text-muted-foreground">3-5 business days</p>
                      </div>
                    </Label>
                  </div>
                  <div className="font-medium">{CURRENCY}200</div>
                </CardContent>
              </Card>
              <Card className={`border ${shippingMethod === "express" ? "border-primary" : ""}`}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express" className="cursor-pointer">
                      <div>
                        <p className="font-medium">Express Shipping</p>
                        <p className="text-sm text-muted-foreground">1-2 business days</p>
                      </div>
                    </Label>
                  </div>
                  <div className="font-medium">{CURRENCY}350</div>
                </CardContent>
              </Card>
            </RadioGroup>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full sm:w-auto">
              Continue to Payment
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
