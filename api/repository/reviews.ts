
type ReviewRepositoryType = { data: string[], findById: (id: number) => string }
export const getReviewRepository = async (): Promise<ReviewRepositoryType> => {
    const data = await new Promise<string[]>(async (resolve, reject) => {
        setTimeout(async () => {
            resolve(["hello", "ahmad"]);
        })
    })

    const findById = (id: number): string => data[id]

    return {
        data,
        findById
    }


}