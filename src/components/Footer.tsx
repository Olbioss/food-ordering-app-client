const Footer = () => {
  return (
    <footer className="bg-foreground py-10">
      <div className="container mx-auto flex flex-col gap-4 md:flex-row md:gap-0 justify-between items-center text-center">
        <span className="flex items-baseline gap-1.5 text-2xl md:text-3xl text-primary font-bold tracking-tight font-heading">
          <span aria-hidden className="text-base md:text-lg">●</span>
          MernEats
        </span>
        <span className="text-background/80 font-semibold flex gap-6 text-sm">
          <span>Gizlilik Politikası</span>
          <span>Kullanım Şartları</span>
        </span>
      </div>
    </footer>
  );
};
export default Footer;
