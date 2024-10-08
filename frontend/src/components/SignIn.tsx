"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { getCsrf } from "@/lib/csrf"

const FormSchema = z.object({
  usernameoremail: z.string().min(1, { message: "Username or email is required" }),
  password: z.string().min(1, { message: "Password is required" })
})

export function SignIn() {


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      usernameoremail: "",
      password: ""
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const csrf = getCsrf()
    
    const res = fetch("/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, csrf }),
    })

    console.log(res)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="usernameoremail"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Username or Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
        )}/>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Sign In</Button>
      </form>
    </Form>
  )
}
