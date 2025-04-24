import { post } from ".";

const getReviews = async (appId: string) => {
    return await post("/ReviewRequest", {
        reviewRequest: {
            cursor: '',
            packageName: appId,
            sortBy: 0
        }
    })
}

const likeReview = async (reviewId: string, token: string) => {
    return await post("/MarkReviewRequest", {
        "markReviewRequest": { "isReply": false, "reviewId": reviewId, "type": "L" }
    }, token)
}

const dislikeReview = async (reviewId: string, token: string) => {
    return await post("/MarkReviewRequest", {
        "markReviewRequest": { "isReply": false, "reviewId": reviewId, "type": "D" }
    }, token)
}

const reportReview = async (reviewId: string, token: string) => {
    return await post("/ReportSpamReviewRequest", {
        "reportReviewRequest": { "reviewId": reviewId }
    }, token)
}


