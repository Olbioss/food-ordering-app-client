import { Link } from "react-router-dom";
import MobileNav from "./MobileNav";
import MainNav from "./MainNav";

const Header = () => {
  return (
    <header className="py-4 md:py-5">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="flex items-baseline gap-1.5 text-2xl md:text-3xl font-bold tracking-tight text-primary font-heading"
        >
          <span aria-hidden className="text-base md:text-lg">●</span>
          MernEats
        </Link>
        <div className="md:hidden">
          <MobileNav />
        </div>
        <div className="hidden md:block">
          <MainNav />
        </div>
      </div>
    </header>
  );
};
export default Header;
