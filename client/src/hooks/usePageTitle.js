import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TITLES = {
  "/admin": "Dashboard — PhoneShop POS",
  "/admin/inventory": "Inventory — PhoneShop POS",
  "/admin/pos": "POS — PhoneShop POS",
  "/admin/repairs": "Repairs — PhoneShop POS",
  "/admin/finance": "Finance — PhoneShop POS",
  "/admin/users": "Users — PhoneShop POS",
  "/operator": "Dashboard — PhoneShop POS",
  "/operator/pos": "POS — PhoneShop POS",
  "/operator/repairs": "Repairs — PhoneShop POS",
  "/login": "Login — PhoneShop POS",
};

export const usePageTitle = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = TITLES[pathname] || "PhoneShop POS";
    window.scrollTo(0, 0);
  }, [pathname]);
};
