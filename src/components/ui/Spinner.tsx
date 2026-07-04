type Props = {
  label?: string;
};

const Spinner = ({ label = "Yükleniyor..." }: Props) => {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3 py-16"
    >
      <span className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-3 w-3 rounded-full bg-primary motion-safe:animate-bounce"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </span>
      <span className="text-sm font-semibold text-muted-foreground">
        {label}
      </span>
    </div>
  );
};

export default Spinner;
