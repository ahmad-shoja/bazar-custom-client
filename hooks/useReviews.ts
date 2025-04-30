import { ReviewType } from "@/api/types"
import { useState } from "react"

const useReviews = () => {
    const [reviews, setReviews] = useState<ReviewType[]>([])
}