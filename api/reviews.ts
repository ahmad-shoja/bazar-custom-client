import { post } from ".";
import { ReviewResponseType, ReviewType, MarkReviewResponse, ReviewReplyResponseType } from "./types";



export const _getReviews = async (appId: string, sortBy?: "newest" | "popular", cursor?: string): Promise<{ reviews: ReviewType[], cursor: string }> => {
    const res = await post<ReviewResponseType>("/ReviewRequest", {
        reviewRequest: {
            cursor: cursor ?? '',
            packageName: appId,
            sortBy: sortBy ? (sortBy == "newest" ? 1 : 0) : 0,
        }
    })

    const reviews = res?.singleReply?.reviewReply?.reviews
    const reviewsWithReplies = []
    for (const review of reviews) {
        if (review.userRepliesCount > 0) {
            const replies = await getReviewReplies(review.id)
            reviewsWithReplies.push(review, ...replies)
        } else {
            reviewsWithReplies.push(review)
        }
    }
    const lCursor = res?.singleReply?.reviewReply.nextPageCursor
    return { reviews: reviewsWithReplies, cursor: lCursor ?? '' };
}

export const getReviews = async ({
    appId,
    sortBy = "newest",
    cursor,
    maxDep = 1
}: {
    appId: string;
    sortBy?: "newest" | "popular";
    cursor?: string;
    maxDep?: number;
}): Promise<ReviewType[]> => {
    try {
        if (maxDep < 1) return []
        const { reviews, cursor: lCursor } = await _getReviews(appId, sortBy, cursor)
        if (lCursor)
            return [...reviews, ...await getReviews({ appId, sortBy, cursor: lCursor, maxDep: maxDep - 1 })]
        else
            return reviews
    } catch (e) {
        console.error(e);
        return []
    }
}


export const likeReview = async (reviewId: number, token: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        post<MarkReviewResponse>("/MarkReviewRequest", {
            "markReviewRequest": { "isReply": false, "reviewId": reviewId, "type": "L" }
        }, token).then((response) => {
            console.log("999", { response });

            if (response.singleReply.markReviewReply.result) {
                resolve();
            } else {
                reject(response.properties.statusCode);
            }
        }).catch((error) => {
            console.log("999", { error });

            reject(error.status);
        });
    });
}


export const dislikeReview = async (reviewId: number, token: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        post<MarkReviewResponse>("/MarkReviewRequest", {
            markReviewRequest: { isReply: false, reviewId, type: "D" }
        }, token).then((response) => {
            if (response.singleReply.markReviewReply.result) {
                resolve();
            } else {
                reject(response.properties.statusCode);
            }
        }).catch((error) => {
            reject(error.status);
        });
    });
}

export const reportReview = async (reviewId: number, token: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        post("/ReportSpamReviewRequest", {
            reportSpamReviewRequest: { isReply: false, reviewId }
        }, token).then((response) => {
            if (response.singleReply.reportSpamReviewReply.result) {
                resolve();
            } else {
                reject(response.properties.statusCode);
            }
        }).catch((error) => {
            reject(error.status);
        });
    });
}

export const getReviewReplies = async (reviewId: number): Promise<ReviewType[]> => {
    return new Promise<ReviewType[]>((resolve, reject) => {
        post<ReviewReplyResponseType>("/GetReviewAndRepliesRequest", {
            getReviewAndRepliesRequest: { reviewId }
        }).then((response) => {
            resolve(response.singleReply.getReviewAndRepliesReply.replies);
        }).catch((error) => {
            reject(error.status);
        });
    });
}