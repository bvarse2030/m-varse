Act as a senior web developer, and you are working in NextJS with TypeScript. 

I am using better auth for my Next.js application. I am using MongoDB for the data database.  There is a total of 4 modals created by Better Auth. I want to access those data in my dashboard.

here is example of code.

route.ts (path: src/app/api/auth/[...all]/route.ts)
```
import { auth } from '@/lib/auth' // path to your auth file
import { toNextJsHandler } from 'better-auth/next-js'

export const { GET, POST } = toNextJsHandler(auth)

```

auth.ts
```
import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'

import { MongoClient } from 'mongodb'

export const client = new MongoClient(process.env.mongooseURI as string)
const db = client.db()

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),
    emailAndPassword: {
        enabled: true,
        async sendResetPassword(data, request) {
            console.log('data : ', data)
            console.log('request : ', request)
            // Send an email to the user with a link to reset their password
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
})

```


auth-client.ts
```
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
})

export const { signIn, signOut, signUp, useSession } = authClient

```


Now please telme is there any way to access those database.