import { post } from ".";
import { ReviewResponseType, ReviewType, MarkReviewResponse } from "./types";



export const _getReviews = async (appId: string, sortBy?: "newest" | "popular", cursor?: string): Promise<{ reviews: ReviewType[], cursor: string }> => {
    const res = await post<ReviewResponseType>("/ReviewRequest", {
        reviewRequest: {
            cursor: cursor ?? '',
            packageName: appId,
            sortBy: sortBy ? (sortBy == "newest" ? 1 : 0) : 0,
        }
    })
    return { reviews: res?.singleReply?.reviewReply?.reviews, cursor: res?.singleReply?.reviewReply.nextPageCursor };
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
            if (response.singleReply.markReviewReply.result) {
                resolve();
            } else {
                reject(response.properties.errorMessage);
            }
        }).catch((error) => {
            reject(error.status);
        });
    });
}

export const dislikeReview = async (reviewId: string, token: string) => {
    return await post("/MarkReviewRequest", {
        "markReviewRequest": { "isReply": false, "reviewId": reviewId, "type": "D" }
    }, token)
}

export const reportReview = async (reviewId: string, token: string) => {
    return await post("/ReportSpamReviewRequest", {
        "reportReviewRequest": { "reviewId": reviewId }
    }, token)
}


