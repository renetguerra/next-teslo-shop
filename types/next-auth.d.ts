import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's role. */
      _id: string;
      role: string
    } & DefaultSession["user"]
  }

  interface JWT {
    /** OpenID ID Token */
    idToken?: string;
    user: {
        /** The user's role. */
        role: string
      } & DefaultJWT["user"]
  }

  // interface User {    
  //   user: {
  //       /** The user's role. */
  //       id: string;
  //       role: string
  //     } & DefaultUser["user"]
  // }

}