// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string;
  email: string;
  role: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  //  res.status(200).json({ name: 'John Doe' })
  res.status(200).json({ name: 'Juan', email: 'juan@google.com', role: 'admin' })
}


/* eslint-disable no-unused-vars *//* eslint-disable @typescript-eslint/no-unused-vars *//* eslint-disable no-console *//* eslint-disable @typescript-eslint/no-explicit-any */
// import axios from 'axios'
// import NextAuth from 'next-auth'
// import CredentialsProvider from 'next-auth/providers/credentials' 
// const auth = axios.create()
// auth.defaults.baseURL = process.env.NEXT_PUBLIC_API_BACKEND 
// const Auth = (req: any, res: any) => { 
//   return NextAuth(req, res, { 
//     providers: [ 
//       CredentialsProvider({ 
//         name: 'Custom Login', 
//         credentials: { 
//           user: { label: 'Usuario', type: 'text' }, 
//           password: { label: 'Contrasenna', type: 'text' }, 
//         }, 
//         authorize: async (credentials: any, reqAuth: any) => { 
//           console.log({ credentials, authUrl: auth.defaults.baseURL }) 
//           const response = await auth.post('/login', { name: credentials.user, password: credentials.password, }) 
//           console.log({ response, authUrl: auth.defaults.baseURL }) 
//           if (response.status === 200 && response.data) { 
//             res.setHeader('Set-Cookie', `${'token'}=${response.data.token}; path=/`) 
//             const data = { user: response.data.userDTO, token: response.data.token, } 
//             return { ...data } 
//           } 
//           return null 
//         },
//        }), 
//       ], 
//       callbacks: { jwt: async ({ token, account, user }: any) => { 
//         if (account) { 
//           if (user?.token) { 
//             token.user = user.user 
//           } 
//         } return token 
//       }, 
//       session: async ({ session, token }: any) => { 
//         session.accessToken = token.accessToken 
//         session.user = token.user as any 
//         return session 
//       }, 
//     }, 
//     pages: { signIn: '/login', }, })} 
//     export default Auth