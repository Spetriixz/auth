import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { usersTable } from './database/schema'
import { db } from './database/db'
import { getCookie, setCookie } from 'hono/cookie'
import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'

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

  const loggedIn = getCookie(c, "token")

  if (loggedIn) {
    return c.json({
      message: "User is already logged in",
      status: 400
    }, { status: 400 })
  }
  
  const { username, email, password, csrf } = body

  if (!username || !email || !password || !csrf) {
    return c.json({
      message: "All fields are required",
      status: 400
    }, { status: 400 })
  }

  if (csrf !== csrf_cookie) {
    return c.json({
      message: "CSRF token is invalid",
      status: 400
    }, { status: 400 })
  }

  console.log(csrf, csrf_cookie)

  const name = `${username.toLowerCase()}${Math.floor(Math.random() * 10000)}`
  
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

app.post("/api/signin", async (c) => {
  const body = await c.req.json()
  const csrf_cookie = getCookie(c, "csrf")

  // Eger cookie deki value gercek bir kullanici id si degilse devam etsin

  const loggedIn = getCookie(c, "token")

  if (loggedIn) {
    return c.json({
      message: "User is already logged in",
      status: 400
    }, { status: 400 })
  }

  const { usernameoremail, password, csrf } = body

  if (!usernameoremail || !password || !csrf) {
    return c.json({
      message: "All fields are required",
      status: 400
    }, { status: 400 })
  }

  if (csrf !== csrf_cookie) {
    return c.json({
      message: "CSRF token is invalid",
      status: 400
    }, { status: 400 })
  }

  const username = await db.select().from(usersTable).where(eq(usersTable.username, usernameoremail))
  const email = await db.select().from(usersTable).where(eq(usersTable.email, usernameoremail))
  const user = [...username, ...email]

  console.log(user)

  if (user.length === 0) {
    return c.json({
      message: "User not found",
      status: 400
    }, { status: 400 })
  }

  if (await bcrypt.compare(password, user[0].password)) {
    setCookie(c, "token", user[0].id, { maxAge: 60 * 1, httpOnly: true, sameSite: "lax", path: "/", secure: true, expires: new Date(Date.now() + 60 * 1) }) // 1 minute

    return c.json({
      message: "User logged in successfully",
      status: 200
    }, { status: 200 })
  } else {
    return c.json({
      message: "Incorrect password",
      status: 400
    }, { status: 400 })
  }
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
