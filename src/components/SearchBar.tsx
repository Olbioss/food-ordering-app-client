import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem } from "./ui/form";

const formSchema = z.object({
  searchQuery: z.string({
    required_error: "Restaurant name is required",
  }),
});

export type SearchForm = z.infer<typeof formSchema>;

type Props = {
  onSubmit: (formData: SearchForm) => void;
  placeholder: string;
  onReset?: () => void;
  searchQuery?: string;
  onHome?: boolean;
};

const SearchBar = ({
  onSubmit,
  onReset,
  placeholder,
  searchQuery,
  onHome,
}: Props) => {
  const form = useForm<SearchForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchQuery,
    },
  });

  useEffect(() => {
    form.reset({ searchQuery });
  }, [form, searchQuery]);

  const handleReset = () => {
    form.reset({
      searchQuery: "",
    });
    if (onReset) onReset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 rounded-3xl sm:rounded-full bg-card p-2 sm:p-3 transition-shadow ${
          onHome ? "shadow-warm-lg" : "shadow-warm"
        } ${form.formState.errors.searchQuery && "ring-2 ring-destructive"}`}
      >
        <div className="flex flex-1 items-center gap-2">
          <Search
            strokeWidth={2.5}
            size={26}
            className="ml-2 shrink-0 text-primary"
          />
          <FormField
            control={form.control}
            name="searchQuery"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    {...field}
                    className="border-none bg-transparent shadow-none text-lg sm:text-xl focus-visible:ring-0"
                    placeholder={placeholder}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleReset}
            type="button"
            variant="ghost"
            className="flex-1 sm:flex-none"
          >
            Temizle
          </Button>
          <Button
            type="submit"
            className="flex-1 sm:flex-none"
          >
            Ara
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default SearchBar;
