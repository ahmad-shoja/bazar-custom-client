import { getMyReviewsList, submitReview } from "@/api/reviews";
import { MyReviewItemType } from "@/api/types";
import { LogLine } from "@/types";
import { getTrackedReviews, saveTrackedReviews } from "./storage/reportedReviews";
import { TrackedReview } from "./storage/types";
import { like } from "./like";

const REVIEW_STATES = ["PUBLISHED", "NOT_REVIEWED", "REJECTED"];

export const detectLikelyRejectedReviews = (reviews: MyReviewItemType[]): MyReviewItemType[] =>
    reviews.filter((review) => review.dislikeCount >= 5);

const normalizeComment = (comment: string): string => {
    if (comment.endsWith(".")) {
        return comment.slice(0, -1);
    }
    return `${comment}.`;
};

const areTrackedReviewsEqual = (first: TrackedReview, second: TrackedReview): boolean =>
    first.packageName === second.packageName &&
    first.versionCode === second.versionCode &&
    first.originalCommentLength === second.originalCommentLength &&
    first.originalComment === second.originalComment;

const matchesTrackedReview = (tracked: TrackedReview, review: MyReviewItemType): boolean => {
    if (tracked.packageName !== review.packageName) return false;
    if (tracked.versionCode !== review.versionCode) return false;
    const apiComment = review.comment ?? "";

    if (apiComment.length === tracked.originalCommentLength && apiComment === tracked.originalComment) {
        return true;
    }

    if (
        tracked.lastSubmittedCommentLength > 0 &&
        apiComment.length === tracked.lastSubmittedCommentLength &&
        apiComment === tracked.lastSubmittedComment
    ) {
        return true;
    }

    return false;
};

const now = () => new Date().toISOString();

export const updateReportedReviews = async (
    token: string,
    logOutput: (log: LogLine) => void
): Promise<void> => {
    try {
        logOutput({ text: "Fetching reviews (published / reviewing / rejected)...", color: "yellow" });
        const reviews = await getMyReviewsList(token, undefined, [...REVIEW_STATES]);
        logOutput({ text: `Fetched ${reviews?.length} reviews successfully`, color: "green" });

        let trackedReviews = await getTrackedReviews();

        const persistTrackedReviews = async () => {
            await saveTrackedReviews(trackedReviews);
        };

        // Handle already tracked reviews
        for (const tracked of [...trackedReviews]) {
            const matched = reviews.find((review) => matchesTrackedReview(tracked, review));

            if (!matched) {
                logOutput({
                    text: `Could not find tracked review ${tracked.packageName} (version ${tracked.versionCode}). Keeping it in queue.`,
                    color: "yellow",
                });
                continue;
            }

            if (matched.reviewAuditState === 0) {
                trackedReviews = trackedReviews.filter((item) => !areTrackedReviewsEqual(item, tracked));
                await persistTrackedReviews();
                logOutput({
                    text: `Review ${tracked.packageName} published successfully. Removing from tracking.`,
                    color: "green",
                });
                like(matched.packageName, matched.comment ?? "", 1, logOutput);
                continue;
            }

            if (matched.reviewAuditState === 2) {
                const adjustedComment = normalizeComment(matched.comment ?? "");
                logOutput({
                    text: `Re-submitting rejected review: ${matched.packageName}`,
                    color: "yellow",
                });
                await submitReview(matched.packageName, matched.rate, adjustedComment, matched.versionCode, token);

                trackedReviews = trackedReviews.map((item) =>
                    areTrackedReviewsEqual(item, tracked)
                        ? {
                            ...item,
                            lastStatus: "REJECTED",
                            lastSubmittedComment: adjustedComment,
                            lastSubmittedCommentLength: adjustedComment.length,
                            lastUpdatedAt: now(),
                        }
                        : item
                );
                await persistTrackedReviews();
                logOutput({
                    text: `Successfully re-submitted review: ${matched.packageName}`,
                    color: "green",
                });
                continue;
            }

            // Still under review
            trackedReviews = trackedReviews.map((item) =>
                areTrackedReviewsEqual(item, tracked)
                    ? { ...item, lastStatus: "NOT_REVIEWED", lastUpdatedAt: now() }
                    : item
            );
            await persistTrackedReviews();
        }

        // Detect new likely-to-be-rejected reviews
        const reviewingReviews = reviews.filter((review) => review.reviewAuditState === 1);
        const likelyRejected = detectLikelyRejectedReviews(reviewingReviews).filter(
            (review) => !trackedReviews.some((tracked) => matchesTrackedReview(tracked, review))
        );

        if (likelyRejected.length === 0) {
            logOutput({ text: "No new reviews detected for resubmission.", color: "green" });
            return;
        }

        logOutput({
            text: `Found ${likelyRejected.length} new reviews likely to be rejected (5+ dislikes).`,
            color: "yellow",
        });

        for (const review of likelyRejected) {
            const adjustedComment = normalizeComment(review.comment ?? "");
            logOutput({
                text: `Resubmitting review: ${review.packageName}`,
                color: "yellow",
            });
            await submitReview(review.packageName, review.rate, adjustedComment, review.versionCode, token);

            const newTracked: TrackedReview = {
                packageName: review.packageName,
                versionCode: review.versionCode,
                originalComment: review.comment ?? "",
                originalCommentLength: (review.comment ?? "").length,
                lastSubmittedComment: adjustedComment,
                lastSubmittedCommentLength: adjustedComment.length,
                rate: review.rate,
                dateString: review.dateString,
                lastStatus: "NOT_REVIEWED",
                lastUpdatedAt: now(),
            };

            trackedReviews = [...trackedReviews, newTracked];
            await persistTrackedReviews();

            logOutput({
                text: `Successfully resubmitted review: ${review.packageName}`,
                color: "green",
            });
        }
    } catch (e: any) {
        logOutput({ text: e?.message ?? JSON.stringify(e), color: "red" });
    }
};

