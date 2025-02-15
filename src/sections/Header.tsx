
import Logo from "@/assets/logosaas.png";
import Image from "next/image";
import MenuIcon from "@/assets/menu.svg";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="sticky top-0 backdrop-blur-sm z-20">
      <div className="flex justify-center items-center py-3 bg-black text-white text-sm gap-3">
        <p className="text-white/60 hidden md:flex gap-4">
          <p className="text-blue-400">SENSEX <span className="text-white bg-blue-600 px-1 rounded">75939.21</span> <span className="text-red-500">▼-199.76 (-0.26%)</span></p>
          <p className="text-blue-400">NIFTY <span className="text-white bg-blue-600 px-1 rounded">22929.25</span> <span className="text-red-500">▼-102.15 (-0.44%)</span></p>
          <p className="text-blue-400">BANKNIFTY <span className="text-white bg-blue-600 px-1 rounded">49099.45</span> <span className="text-red-500">▼-260.40 (-0.53%)</span></p>
          <p className="text-blue-400">NIFTYIT <span className="text-white bg-blue-600 px-1 rounded">41311.15</span> <span className="text-red-500">▼-4.40 (-0.01%)</span></p>
        </p>
      </div>
      <div className="py-5">
        <div className="container">
          <div className="flex items-center justify-between">
            <Image src={Logo} alt="Saas Logo" height={40} width={40} />
            <MenuIcon className="h-5 w-5 md:hidden" />
            <nav className="hidden md:flex gap-6 items-center">
              <Link href="/market" className="bg-black text-white px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center tracking-tight hover:bg-black/90 transition-colors">Market</Link>
              <Link href="/news" className="bg-black text-white px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center tracking-tight hover:bg-black/90 transition-colors">News</Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
