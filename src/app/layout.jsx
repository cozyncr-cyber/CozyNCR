import localFont from "next/font/local";
import "./globals.css";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getLoggedInUser } from "@/actions/auth";

const inter = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: "500",
});

export const metadata = {
  title: "Cozy-NCR",
  description: "",
};

export default async function RootLayout({ children }) {
  const user = await getLoggedInUser();
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Navbar user={user} />
        <section className="mt-20 min-h-[90vh]">{children}</section>
        <Footer />
      </body>
    </html>
  );
}
