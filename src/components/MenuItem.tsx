import { MenuItem } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Props = {
  menuItem: MenuItem;
  addToCart: () => void;
};

const MenuItemComponent = ({ menuItem, addToCart }: Props) => {
  return (
    <Card
      className="cursor-pointer transition-all hover:border-orange-500 hover:shadow-md active:scale-[0.99]"
      onClick={addToCart}
    >
      <CardHeader>
        <CardTitle>{menuItem.name}</CardTitle>
      </CardHeader>
      <CardContent className="font-bold">
        {formatCurrency(menuItem.price)}
      </CardContent>
    </Card>
  );
};

export default MenuItemComponent;
