import { post } from ".";
import { ReviewType } from "./types";

export const getReviews = async (appId: string): Promise<ReviewType[]> => {
    const res = await post("/ReviewRequest", {
        reviewRequest: {
            cursor: '',
            packageName: appId,
            sortBy: 0
        }
    })
    return res?.singleReply?.reviewReply?.reviews
}

export const likeReview = async (reviewId: string, token: string) => {
    return await post("/MarkReviewRequest", {
        "markReviewRequest": { "isReply": false, "reviewId": reviewId, "type": "L" }
    }, token)
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


