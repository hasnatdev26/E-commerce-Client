import { Outlet } from "react-router-dom";
import MainNavbar from "../Shared/MainNavbar";
import MobileBottomNav from "../Shared/MobileBottomNav";
import Navbar from "../Shared/Navbar";
import Footer from "../Shared/Footer";
import ScrollToTop from "../Components/ScrollToTop/ScrollToTop";


const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      
      <ScrollToTop />

      {/* Top Navbar sticky */}
      <div className="sticky top-0 z-50">
        <Navbar />
        <MainNavbar />
      </div>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav />

      {/* Main Content */}
      <main className="flex-grow mt-2">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
