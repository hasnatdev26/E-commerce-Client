import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import logo from "../../src/assets/Logo/logo.png";

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-gray-300 py-10 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-gray-700 pb-8">
          {/* Logo + Social */}
          <div className="text-center md:text-left">
            <img
              src={logo}
              alt="FastDokan Logo"
              className="mx-auto md:mx-0 w-32 mb-2"
            />
            <p className="text-white font-semibold mb-4">FastDokan</p>
            <div className="flex justify-center md:justify-start space-x-5">
              <a href="#" className="hover:text-white transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Location */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold mb-3">Location:</h3>
            <p className="text-gray-400 text-sm leading-6">
              10/25 (9th Commercial Floor), Eastern Plaza, <br />
              70 Bir Uttam C.R Datta Road, <br />
              Hatirpool, Dhaka-1205
            </p>
          </div>

          {/* Contacts */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold mb-3">Contacts:</h3>
            <p className="text-gray-400 text-sm">Mobile: 01234-567890</p>
            <p className="text-gray-400 text-sm">Whatsapp: 01234-567890</p>
            <p className="text-gray-400 text-sm">Email: info@email.com</p>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-gray-400 mt-6 text-center">
          <a href="#" className="hover:text-white transition-colors">
            Blog
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Support Center
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Delivery Policy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Warranty
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Return and Refund Policy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms and Conditions
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm mt-6">
          © 2025 FastDokan. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
