import { getReviews } from "@/api/reviews";
import { LogLine } from "@/types";

export const like = async (appId: string, code: string, logOutput: (log: LogLine) => void) => {
    try {
        const reviews = await getReviews(appId);
        logOutput({ text: `fetched ${reviews?.length} review successfully`, color: "green" });
        const theReview = reviews.find(review => review.comment.includes(code));
        if (theReview)
            logOutput({ text: `found review by ${theReview.user}`, color: "green" });
        else
            logOutput({ text: `could not find review from app ${appId} with code ${code} `, color: "red" });
        console.log({ reviews });

    } catch (e: any) {
        logOutput(e?.message ?? JSON.stringify(e));
    }
}