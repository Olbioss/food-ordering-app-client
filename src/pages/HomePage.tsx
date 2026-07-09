import SearchBar, { SearchForm } from "@/components/SearchBar";
import { cuisineList } from "@/config/restaurant.options.config";
import { Smartphone, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearch = (searchFormValues: SearchForm) => {
    navigate({
      pathname: `/search/${searchFormValues.searchQuery}`,
    });
  };

  return (
    <div className="flex flex-col gap-10 md:gap-14">
      <section className="relative overflow-hidden rounded-[28px] bg-primary px-5 py-12 text-center text-primary-foreground shadow-warm-lg sm:px-10 md:px-24 md:py-16 -mt-2 md:-mt-4">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-[46%_54%_60%_40%/50%_45%_55%_50%] bg-primary-deep opacity-70 motion-safe:animate-drift"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 right-14 h-44 w-44 rounded-[55%_45%_40%_60%/45%_55%_50%_50%] bg-accent opacity-80 motion-safe:animate-drift-slow"
        />
        <div className="relative flex flex-col gap-5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Bugün paket servisin tadını çıkarın
          </h1>
          <span className="text-lg md:text-xl opacity-90">
            Yemek bir tık uzağınızda!
          </span>
          <SearchBar
            placeholder="Şehir veya ilçeye göre arayın"
            onSubmit={handleSearch}
            onHome
          />
        </div>
      </section>

      <section className="flex flex-col items-center gap-4">
        <span className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Popüler mutfaklar
        </span>
        <div className="flex flex-wrap justify-center gap-2.5">
          {cuisineList.slice(0, 10).map((cuisine, index) => (
            <span
              key={cuisine}
              className="rounded-full bg-card px-4 py-2 text-sm font-bold shadow-warm motion-safe:animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {cuisine}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] bg-secondary px-5 py-10 text-center sm:px-10 md:py-14">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-4">
          <span className="font-bold text-2xl md:text-3xl tracking-tight font-heading">
            Paket siparişi daha da hızlı verin!
          </span>
          <span className="text-base md:text-lg text-muted-foreground">
            Daha hızlı sipariş ve kişiye özel öneriler için MearnEats
            uygulamasını indirin
          </span>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background">
              <Smartphone size={16} /> App Store
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background">
              <Zap size={16} /> Google Play
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
export default HomePage;
