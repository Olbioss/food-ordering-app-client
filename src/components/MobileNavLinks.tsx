import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";

const MobileNavLinks = () => {
  const { logout } = useAuth0();

  return (
    <>
      <Link
        to="/order-status"
        className="flex bg-white items-center font-bold hover:text-orange-500"
      >
        Sipariş Durumu
      </Link>
      <Link
        to="/manage-restaurant"
        className="flex bg-white items-center font-bold hover:text-orange-500"
      >
        Restoranım
      </Link>
      <Link
        to="/user-profile"
        className="flex bg-white items-center font-bold hover:text-orange-500"
      >
        Kullanıcı Profili
      </Link>
      <Button
        onClick={() => logout()}
        className="flex items-center px-3 font-bold hover:bg-gray-500"
      >
        Çıkış Yap
      </Button>
    </>
  );
};
export default MobileNavLinks;
