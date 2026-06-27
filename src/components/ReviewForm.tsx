import { useState } from "react";
import StarRating from "./StarRating";
import { Button } from "./ui/button";
import LoadingButton from "./ui/LoadingButton";

type Props = {
  onSubmit: (data: { rating: number; comment: string }) => void;
  isLoading: boolean;
};

const ReviewForm = ({ onSubmit, isLoading }: Props) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (rating < 1) return;
    onSubmit({ rating, comment });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 bg-gray-50 rounded-lg p-4"
    >
      <span className="font-semibold">Yorum yapın</span>
      <StarRating rating={rating} onChange={setRating} size={28} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Deneyiminizi paylaşın (isteğe bağlı)"
        maxLength={1000}
        rows={3}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
      {isLoading ? (
        <LoadingButton />
      ) : (
        <Button type="submit" disabled={rating < 1} className="self-start">
          Yorumu gönder
        </Button>
      )}
    </form>
  );
};

export default ReviewForm;
