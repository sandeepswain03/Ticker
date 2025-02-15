import Image from "next/image";
import logo from "@/assets/logosaas.png";
import SocialX from "@/assets/social-x.svg";
import SocialInsta from "@/assets/social-insta.svg";
import SocialLinkedIn from "@/assets/social-linkedin.svg";
import SocialPin from "@/assets/social-pin.svg";
import SocialYoutube from "@/assets/social-youtube.svg";

export const Footer = () => {
  return (
    <footer className="bg-black text-[#BCBCBC] text-sm py-10">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="inline-flex relative before:content-[''] before:top-2 before:bottom-0 before:w-full before:blur before:bg-[linear-gradient(to_right,#3461FF,#8B9FFF)] before:absolute">
              <Image src={logo} height={40} alt="Trading Platform Logo" className="relative" />
            </div>
            <p className="mt-4 text-sm">
              Your trusted platform for stock screening and market analysis
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Markets</h3>
            <nav className="flex flex-col gap-3">
              <a href="/stocks">Stocks</a>
              <a href="/indices">Indices</a>
              <a href="/futures">Futures</a>
              <a href="/options">Options</a>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <nav className="flex flex-col gap-3">
              <a href="/market-news">Market News</a>
              <a href="/analysis">Technical Analysis</a>
              <a href="/screener">Stock Screener</a>
              <a href="/learning">Learning Center</a>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <nav className="flex flex-col gap-3">
              <a href="/about">About Us</a>
              <a href="/contact">Contact</a>
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
            </nav>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t border-white/10">
          <p>&copy; 2024 Trading Platform. All rights reserved.</p>

          <div className="flex gap-6 mt-4 md:mt-0">
            <SocialX className="w-5 h-5 hover:text-white transition-colors" />
            <SocialInsta className="w-5 h-5 hover:text-white transition-colors" />
            <SocialLinkedIn className="w-5 h-5 hover:text-white transition-colors" />
            <SocialYoutube className="w-5 h-5 hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
};
