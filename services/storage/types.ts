export type Account = {
    id: string;
    phone: string;
    token: string;
    refreshToken: string
};

export type App = { name: string; id: string }

export type CodeType = "friendly" | "enemy"

export type Code = { id: string; code: string; appId: string; type: CodeType }

export type TrackedReview = {
    packageName: string;
    versionCode: number;
    originalComment: string;
    originalCommentLength: number;
    lastSubmittedComment: string;
    lastSubmittedCommentLength: number;
    rate: number;
    dateString: string;
    lastStatus: "PUBLISHED" | "NOT_REVIEWED" | "REJECTED";
    lastUpdatedAt: string;
}
