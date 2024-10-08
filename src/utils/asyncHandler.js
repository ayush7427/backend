const asyncHandler = (fxn) =>
    async (req, res, next) => {
        try {
            return await fxn(req, res, next)
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Server Error"
            })

        }
    }

export { asyncHandler }


// const asyncHandler = (fxn) =>
//     async (req, res, next) => {
//         try {
//             await fxn(req, res, next)
//         } catch (error) {
//             res.status(error.statusCode || 500).json({
//                 success: false,
//                 message: error.message || "Server Error"
//             });
//         }
//     }
// export { asyncHandler }