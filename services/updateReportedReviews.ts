import { getMyReviewsList, submitReview } from "@/api/reviews";
import { MyReviewItemType } from "@/api/types";
import { LogLine } from "@/types";
import { executeWithTokensSync } from "./execute";

export const detectLikelyRejectedReviews = (reviews: MyReviewItemType[]): MyReviewItemType[] => {
    return reviews.filter(review => review.dislikeCount >= 5);
}

export const updateReportedReviews = async (
    token: string,
    logOutput: (log: LogLine) => void
): Promise<void> => {
    try {
        logOutput({ text: "Fetching reviewing reviews...", color: "yellow" });
        const reviews = await getMyReviewsList(token, undefined, ["NOT_REVIEWED"]);
        logOutput({ text: `Fetched ${reviews?.length} reviewing reviews successfully`, color: "green" });

        const likelyRejected = detectLikelyRejectedReviews(reviews);

        if (likelyRejected.length > 0) {
            logOutput({ text: `Found ${likelyRejected.length} reviews likely to be rejected (5+ dislikes)`, color: "yellow" });

            for (const review of likelyRejected) {
                logOutput({ text: `Resubmitting review: ${review.packageName} - ${review.comment.substring(0, 50)}...`, color: "yellow" });
                submitReview(
                    review.packageName,
                    review.rate,
                    review.comment,
                    review.versionCode,
                    token
                ),
                    logOutput

                logOutput({ text: `Successfully resubmitted review: ${review.packageName}`, color: "green" });
            }
        } else {
            logOutput({ text: "No reviews found that are likely to be rejected", color: "green" });
        }
    } catch (e: any) {
        logOutput({ text: e?.message ?? JSON.stringify(e), color: "red" });
    }
}

