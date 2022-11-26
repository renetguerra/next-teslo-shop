import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credential from 'next-auth/providers/credentials'
import { dbUsers } from "../../../database";


export default NextAuth({

  // Configure one or more authentication providers
  providers: [
    Credential({
        name: 'Custom Login',
        credentials: {
            email: { label: 'Correo:', type: 'email', placeholder: 'correo@google.com' },
            password: { label: 'Contraseña:', type: 'password', placeholder: 'Contraseña' }
        },
        authorize: async (credentials) => {                         
            const res = await dbUsers.checkUserEmailPassword( credentials!.email, credentials!.password );
            
            return res;                        
        }
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // ...add more providers here   
  ],

  // Custom Pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },
  session: {
    maxAge: 2592000, // 30d
    strategy: 'jwt',
    updateAge: 86400, // cada día
  },

  // Callbacks
  callbacks: {
    async jwt({ token, account, user }) {        
        if (account) {
            token.accessToken = account.access_token;

            switch (account.type) {
                case 'oauth':
                    token.user = await dbUsers.oAuthToDbUser( user?.email || '', user?.name || '' );
                    break;
                case 'credentials':
                  debugger
                    const userInDb = await dbUsers.getUserByEmail(user?.email!);                    
                    token.user = userInDb;                                                              
                    break;                   
            }
        }        
        return token;
    },

    async session({ session, token, user }) {                
        const userInDb = await dbUsers.getUserByEmail(session.user.email!);
        session.user._id = userInDb!._id;
        session.user.role = userInDb!.role;                
        return session;
    }
  }
});