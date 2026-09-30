import type { Metadata } from "next";
import PrimaryNavigation from "@/components/navigation/PrimaryNavigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "MatterBridge",
  description: "Legal matter intelligence prototype",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="app-shell flex min-h-full flex-col lg:flex-row">
        <PrimaryNavigation />
        <div className="min-w-0 flex-1">{children}</div>
      </body>
    </html>
  );
}
