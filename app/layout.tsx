import type { Metadata } from "next";
import FirebaseAnalytics from "@/components/firebase-analytics";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agency Admin",
  description: "Agency administration console"
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
