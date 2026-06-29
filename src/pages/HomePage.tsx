import downloadImage from "@/assets/appDownload.png";
import landingImage from "@/assets/landing.png";
import SearchBar, { SearchForm } from "@/components/SearchBar";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearch = (searchFormValues: SearchForm) => {
    navigate({
      pathname: `/search/${searchFormValues.searchQuery}`,
    });
  };

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <div className="px-5 sm:px-10 md:px-24 bg-white rounded-2xl shadow-md py-8 md:py-12 flex flex-col gap-5 text-center -mt-8 md:-mt-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-orange-600">
          Bugün paket servisin tadını çıkarın
        </h1>
        <span className="text-lg md:text-xl text-gray-600">
          Yemek bir tık uzağınızda!
        </span>
        <SearchBar
          placeholder="Şehir veya ilçeye göre arayın"
          onSubmit={handleSearch}
          onHome
        />
      </div>
      <div className="grid md:grid-cols-2 gap-5 items-center">
        <img src={landingImage} className="w-full rounded-2xl" />
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <span className="font-bold text-2xl md:text-3xl tracking-tighter font-heading">
            Paket siparişi daha da hızlı verin!
          </span>
          <span className="text-base md:text-lg text-gray-600">
            Daha hızlı sipariş ve kişiye özel öneriler için MearnEats
            uygulamasını indirin
          </span>
          <img src={downloadImage} className="mx-auto max-w-full" />
        </div>
      </div>
    </div>
  );
};
export default HomePage;
