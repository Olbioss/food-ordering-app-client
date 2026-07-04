import { Review } from "@/types";
import { useState } from "react";
import StarRating from "./StarRating";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

type Props = {
  reviews: Review[];
  isOwner: boolean;
  onReply: (reviewId: string, text: string) => void;
  isReplying: boolean;
};

const ReviewItem = ({
  review,
  isOwner,
  onReply,
  isReplying,
}: {
  review: Review;
  isOwner: boolean;
  onReply: (reviewId: string, text: string) => void;
  isReplying: boolean;
}) => {
  const [replyText, setReplyText] = useState<string>("");
  const [showReply, setShowReply] = useState<boolean>(false);

  const submitReply = () => {
    if (!replyText.trim()) return;
    onReply(review._id, replyText.trim());
    setReplyText("");
    setShowReply(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-semibold">{review.user?.name ?? "Müşteri"}</span>
        <span className="text-sm text-muted-foreground">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>
      <StarRating rating={review.rating} size={16} />
      {review.comment && <p className="text-foreground/80">{review.comment}</p>}

      {review.ownerReply?.text && (
        <div className="ml-4 mt-1 border-l-2 border-accent pl-3">
          <span className="text-sm font-semibold text-primary">
            İşletme yanıtı
          </span>
          <p className="text-sm text-foreground/80">{review.ownerReply.text}</p>
        </div>
      )}

      {isOwner && !review.ownerReply?.text && (
        <div className="ml-4">
          {showReply ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Herkese açık bir yanıt yazın"
                maxLength={1000}
                rows={2}
                className="w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={submitReply}
                  disabled={isReplying || !replyText.trim()}
                >
                  Yanıtı gönder
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowReply(false)}
                >
                  İptal
                </Button>
              </div>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowReply(true)}
            >
              Yanıtla
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

const ReviewList = ({ reviews, isOwner, onReply, isReplying }: Props) => {
  if (reviews.length === 0) {
    return <p className="text-muted-foreground">Henüz yorum yok.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review, index) => (
        <div key={review._id} className="flex flex-col gap-4">
          {index > 0 && <Separator />}
          <ReviewItem
            review={review}
            isOwner={isOwner}
            onReply={onReply}
            isReplying={isReplying}
          />
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
