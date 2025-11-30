import { getLoggedInUser } from "@/actions/auth";
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function Home() {
  const user = await getLoggedInUser();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow">
        <Banner />
      </main>
    </div>
  );
}
