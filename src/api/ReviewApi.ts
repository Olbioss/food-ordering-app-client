import { Review, ReviewStatus } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetRestaurantReviews = (restaurantId?: string) => {
  const getReviewsRequest = async (): Promise<Review[]> => {
    const response = await fetch(
      `${API_BASE_URL}/restaurant/${restaurantId}/reviews`,
    );
    if (!response.ok) throw new Error("Failed to get reviews");
    return response.json();
  };

  const { data: reviews, isLoading } = useQuery(
    ["fetchReviews", restaurantId],
    getReviewsRequest,
    { enabled: !!restaurantId },
  );

  return { reviews, isLoading };
};

export const useGetMyReviewStatus = (restaurantId?: string) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const getStatusRequest = async (): Promise<ReviewStatus> => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(
      `${API_BASE_URL}/restaurant/${restaurantId}/reviews/me`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    if (!response.ok) throw new Error("Failed to get review status");
    return response.json();
  };

  const { data: reviewStatus, isLoading } = useQuery(
    ["fetchReviewStatus", restaurantId],
    getStatusRequest,
    { enabled: !!restaurantId && isAuthenticated },
  );

  return { reviewStatus, isLoading };
};

type CreateReviewRequest = {
  rating: number;
  comment?: string;
};

export const useCreateReview = (restaurantId?: string) => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  const createReviewRequest = async (review: CreateReviewRequest) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(
      `${API_BASE_URL}/restaurant/${restaurantId}/reviews`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
      },
    );
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || "Failed to submit review");
    }
    return response.json();
  };

  const { mutateAsync: createReview, isLoading } = useMutation(
    createReviewRequest,
    {
      onSuccess: () => {
        toast.success("Review submitted");
        queryClient.invalidateQueries(["fetchReviews", restaurantId]);
        queryClient.invalidateQueries(["fetchReviewStatus", restaurantId]);
        queryClient.invalidateQueries("fetchRestaurant");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    },
  );

  return { createReview, isLoading };
};

type ReplyRequest = {
  reviewId: string;
  text: string;
};

export const useReplyToReview = (restaurantId?: string) => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  const replyRequest = async ({ reviewId, text }: ReplyRequest) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(
      `${API_BASE_URL}/restaurant/reviews/${reviewId}/reply`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      },
    );
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || "Failed to submit reply");
    }
    return response.json();
  };

  const { mutateAsync: replyToReview, isLoading } = useMutation(replyRequest, {
    onSuccess: () => {
      toast.success("Reply posted");
      queryClient.invalidateQueries(["fetchReviews", restaurantId]);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return { replyToReview, isLoading };
};
