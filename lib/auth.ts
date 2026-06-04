import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Temporary admin credentials until DB is connected
const TEMP_ADMIN = {
  id: "1",
  email: "admin@besttools.uz",
  password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "password"
  name: "Super Admin",
  role: "SUPER_ADMIN",
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Parol", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // TODO: replace with real DB lookup
        // const admin = await prisma.admin.findUnique({
        //   where: { email: credentials.email as string }
        // });

        const admin = TEMP_ADMIN;
        if (!admin) return null;
        if (admin.email !== credentials.email) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          admin.password
        );
        if (!isValid) return null;

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 soat
  },
  secret: process.env.NEXTAUTH_SECRET,
});
