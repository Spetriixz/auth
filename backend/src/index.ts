import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { usersTable } from './database/schema'
import { db } from './database/db'
import { getCookie } from 'hono/cookie'
import bcrypt from 'bcrypt'

const app = new Hono()

app.get("/api/data", async (c) => {
  const users = await db.select().from(usersTable)

  return c.json({
    users
  })
})

app.post("/api/signup", async (c) => {
  const body = await c.req.json()
  const csrf_cookie = getCookie(c, "csrf")
  
  const { name, email, password, csrf } = body

  if (!name || !email || !password || !csrf) {
    return c.json({
      message: "All fields are required",
      status: 400
    }, { status: 400 })
  }

  if (`${csrf}1` !== csrf_cookie) {
    return c.json({
      message: "CSRF token is invalid",
      status: 400
    }, { status: 400 })
  }

  console.log(csrf, csrf_cookie)

  const username = `${name.toLowerCase()}${Math.floor(Math.random() * 10000)}`
  
  const hashedPassword = await bcrypt.hash(password, 10)

  await db.insert(usersTable).values({
    name,
    username,
    email: email.toLowerCase(),
    password: hashedPassword
  })

  return c.json({
    message: "User created successfully",
    status: 200
  }, { status: 200 })
})

app.get('/api/status', (c) => {
  return c.json({
    message: "API and Database is running correctly",
    status: 200
  }, { status: 200 })
})

const port = process.env.PORT || 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port: Number(port)
})
