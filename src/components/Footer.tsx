const Footer = () => {
  return (
    <div className="bg-orange-500 py-8">
      <div className="container mx-auto flex flex-col gap-4 md:flex-row md:gap-0 justify-between items-center text-center">
        <span className="text-2xl md:text-3xl text-white font-bold tracking-tight font-heading">
          MernEats
        </span>
        <span className="text-white font-bold tracking-tight flex gap-4">
          <span>Gizlilik Politikası</span>
          <span>Kullanım Şartları</span>
        </span>
      </div>
    </div>
  );
};
export default Footer;
