import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

type Props = {
  index: number;
  removeMenuItem: () => void;
};

const MenuItemInput = ({ index, removeMenuItem }: Props) => {
  const { control } = useFormContext();

  return (
    <div className="flex items-end gap-2">
      <FormField
        control={control}
        name={`menuItems.${index}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Ad <FormMessage />
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="Peynirli Pizza" />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`menuItems.${index}.price`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Fiyat <FormMessage />
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="15.00" />
            </FormControl>
          </FormItem>
        )}
      />
      <Button
        type="button"
        variant="destructive"
        onClick={removeMenuItem}
        className="max-h-fit"
      >
        Kaldır
      </Button>
    </div>
  );
};
export default MenuItemInput;
