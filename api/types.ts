export type ErrorResponse = {
    message: string;
    status: number;
}


export type VerifyOtpResponse = {
    properties: {
        statusCode: number;
        errorMessage: string;
    };
    singleReply: {
        verifyOtpTokenReply: {
            accessToken: string;
            refreshToken: string;
            waitingSeconds: number;
        }
    }
}


export type GetOtpResponse = {
    properties: {
        statusCode: number;
        errorMessage: string;
    };
    singleReply: {
        getOtpTokenReply: {
            waitingSeconds: string;
            callIsEnabled: boolean;
        }
    }
}


export type VerifyOtpResult = {
    token: string;
    refreshToken: string;
    waitingSeconds: number;
}

export type GetOtpResult = {
    waitingSeconds: string;
    callIsEnabled: boolean;
}




export type ReviewResponseType = {
    properties: {
        statusCode: number;
        errorMessage: string;
    };
    singleReply: {
        reviewReply: {
            reviews: ReviewType[];
            nextPageCursor: string;
            sortByOptions: {
                title: string;
                type: number;
            }[];
        };
    };
};



export type ReviewType = {
    id: number;
    user: string;
    comment: string;
    likes: number;
    total: number;
    rate: number;
    versionCode: number;
    date: string;
    reply: string | null;
    likedByMe: number;
    accountID: string;
    badgeIconURL: string;
    avatarURL: string;
    userRepliesCount: number;
    userRepliesAvatarUrls: string[];
    fromDeveloper: boolean;
    reviewAuditState: number;
    isEdited: boolean;
}