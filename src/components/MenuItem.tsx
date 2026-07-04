import { MenuItem } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Props = {
  menuItem: MenuItem;
  addToCart: () => void;
};

const MenuItemComponent = ({ menuItem, addToCart }: Props) => {
  return (
    <Card
      className="group cursor-pointer transition-all hover:shadow-warm-lg motion-safe:active:scale-[0.98]"
      onClick={addToCart}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="font-heading">{menuItem.name}</CardTitle>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Plus size={18} strokeWidth={3} />
        </span>
      </CardHeader>
      <CardContent className="font-bold text-primary">
        {formatCurrency(menuItem.price)}
      </CardContent>
    </Card>
  );
};

export default MenuItemComponent;
