import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "../globals.css";

export const metadata: Metadata = {
  title: "Threads Clone",
  description: "A Next.js 13 Meta Threads Application",
};

const inter = Inter({ subsets: ["latin"] });

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>
          <div className="flex min-h-screen w-full items-center justify-center">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default AuthLayout;
