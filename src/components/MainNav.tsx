import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "./ui/button";
import UserMenu from "./UserMenu";
import { Link } from "react-router-dom";

const MainNav = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    <span className="flex space-x-4 items-center">
      {isAuthenticated ? (
        <>
          <Link
            to="/order-status"
            className="font-bold text-muted-foreground transition-colors hover:text-primary"
          >
            Sipariş Durumu
          </Link>
          <UserMenu />
        </>
      ) : (
        <Button onClick={() => loginWithRedirect()}>Giriş Yap</Button>
      )}
    </span>
  );
};
export default MainNav;
