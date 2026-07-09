import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";

const MobileNavLinks = () => {
  const { logout } = useAuth0();

  return (
    <>
      <Link
        to="/order-status"
        className="flex items-center font-bold text-foreground hover:text-primary"
      >
        Sipariş Durumu
      </Link>
      <Link
        to="/manage-restaurant"
        className="flex items-center font-bold text-foreground hover:text-primary"
      >
        Restoranım
      </Link>
      <Link
        to="/user-profile"
        className="flex items-center font-bold text-foreground hover:text-primary"
      >
        Kullanıcı Profili
      </Link>
      <Button
        onClick={() => logout()}
        className="flex items-center px-3 font-bold"
      >
        Çıkış Yap
      </Button>
    </>
  );
};
export default MobileNavLinks;
