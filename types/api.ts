export type SortByOption = {
    title: string;
    type: number;
};

export type ReviewReply = {
    reviews: any[]; // You might want to create a specific Review type
    nextPageCursor: string;
    sortByOptions: SortByOption[];
};

export type SingleReply = {
    reviewReply: ReviewReply;
};

export type ApiResponse = {
    properties: {
        statusCode: number;
        errorMessage: string;
    };
    singleReply: SingleReply;
}; 