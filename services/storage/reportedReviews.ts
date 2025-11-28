import { REPORTED_REVIEWS_STORAGE_KEY } from "@/constants/storage";
import { getUserPreferences, saveUserPreferences } from ".";
import { TrackedReview } from "./types";

export const getTrackedReviews = async (): Promise<TrackedReview[]> => {
    const reviews = await getUserPreferences(REPORTED_REVIEWS_STORAGE_KEY);
    return reviews || [];
};

export const saveTrackedReviews = async (reviews: TrackedReview[]): Promise<void> => {
    await saveUserPreferences(REPORTED_REVIEWS_STORAGE_KEY, reviews);
};

