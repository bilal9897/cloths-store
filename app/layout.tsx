import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CentrePoint — The Autumn Rail",
  description: "A clothing store on a hanging rail: drag the rail, take a piece off, turn it around, pick a size and add it to the bag.",
  icons: {
    icon: "/fav-sd.png",
    apple: "/fav-sd.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
