import { dislikeReview, getReviews, reportReview } from "@/api/reviews";
import { LogLine } from "@/types";
import { executeWithTokensSync } from "./execute";

export const report = async (appId: string, code: string, logOutput: (log: LogLine) => void) => {
    try {
        const reviews = await getReviews({ appId, maxDep: 12 });
        logOutput({ text: `fetched ${reviews?.length} review successfully`, color: "green" });
        const ourReviews = reviews.filter(review => review.comment.includes(code));
        if (ourReviews.length > 0)
            logOutput({ text: `found review by: \n ${ourReviews.map(({ user }) => user).join('\n')}`, color: "green" });
        else
            logOutput({ text: `could not find review from app ${appId} with code ${code} `, color: "red" });

        for (const { id } of ourReviews) {
            executeWithTokensSync(async (token) => reportReview(id, token).then(() => {
                logOutput({ text: `Successfully reported review ${id}`, color: "green" })
            }).catch(e => {
                logOutput({ text: `Failed to reported review ${id}: ${e}`, color: "red" })
            }), logOutput);
        }

    } catch (e: any) {
        logOutput(e?.message ?? JSON.stringify(e));
    }
}