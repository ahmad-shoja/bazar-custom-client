import { dislikeReview, getReviews } from "@/api/reviews";
import { LogLine } from "@/types";
import { executeWithTokensSync } from "./execute";
import { likeReview } from "@/api/reviews"

export const like = async (appId: string, code: string, maxDep: number = 12, logOutput: (log: LogLine) => void) => {
    try {
        const reviews = await getReviews({ appId, maxDep });
        logOutput({ text: `fetched ${reviews?.length} review successfully`, color: "green" });
        const ourReviews = reviews.filter(review => review.comment.includes(code));
        if (ourReviews.length > 0)
            logOutput({ text: `found review by: \n ${ourReviews.map(({ user }) => user).join('\n')}`, color: "green" });
        else
            logOutput({ text: `could not find review from app ${appId} with code ${code} `, color: "red" });

        for (const { id } of ourReviews) {
            executeWithTokensSync(async (token) => likeReview(id, token), logOutput);
        }





    } catch (e: any) {
        logOutput(e?.message ?? JSON.stringify(e));
    }
}
export const dislike = async (appId: string, code: string, logOutput: (log: LogLine) => void) => {
    try {
        const reviews = await getReviews({ appId, maxDep: 12 });
        logOutput({ text: `fetched ${reviews?.length} review successfully`, color: "green" });
        const ourReviews = reviews.filter(review => review.comment.includes(code));
        if (ourReviews.length > 0)
            logOutput({ text: `found review by: \n ${ourReviews.map(({ user }) => user).join('\n')}`, color: "green" });
        else
            logOutput({ text: `could not find review from app ${appId} with code ${code} `, color: "red" });

        for (const { id } of ourReviews) {
            executeWithTokensSync(async (token) => dislikeReview(id, token), logOutput);
        }

    } catch (e: any) {
        logOutput(e?.message ?? JSON.stringify(e));
    }
}