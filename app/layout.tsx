import type { Metadata } from "next";
import FirebaseAnalytics from "@/components/firebase-analytics";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tile Window Dashboard",
  description: "Next.js App Router + TypeScript starter"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <FirebaseAnalytics />
        {children}
      </body>
    </html>
  );
}
