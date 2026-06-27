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
    <div className="flex flex-col gap-12">
      <div className="md:px-24 bg-white rounded-lg shadow-md py-8 flex flex-col gap-5 text-center -mt-16">
        <h1 className="text-5xl font-bold tracking-tight text-orange-600">
          Bugün paket servisin tadını çıkarın
        </h1>
        <span className="text-xl">Yemek bir tık uzağınızda!</span>
        <SearchBar
          placeholder="Şehir veya ilçeye göre arayın"
          onSubmit={handleSearch}
          onHome
        />
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <img src={landingImage} />
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <span className="font-bold text-3xl tracking-tighter font-heading">
            Paket siparişi daha da hızlı verin!
          </span>
          <span className="text-lg">
            Daha hızlı sipariş ve kişiye özel öneriler için MearnEats
            uygulamasını indirin
          </span>
          <img src={downloadImage} />
        </div>
      </div>
    </div>
  );
};
export default HomePage;
