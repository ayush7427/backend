import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js";

//  generate access and refresh token method
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        // console.log("AT: ", accessToken);

        user.refreshToken = refreshToken
        // console.log("user:", user);
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    //  get user details  from frontend
    // validation - not empty
    // check if user already exists: username , email
    // check for images, check for avatar
    // upload them to cloudinary , avatar
    // create user object - create entry in db
    // remove password and refresh token field from response 
    // check for user creation
    // return res


    // get user details
    const { fullName, email, username, password } = req.body
    // console.log("req body: ", req.body);
    //console.log("email: ", email);


    // user validation
    if ([fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // email validation
    const regexExpression = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
    if (!regexExpression.test(email)) {
        throw new ApiError(400, "Invalid email format.")
    }

    // password validation
    const passwordRegexExpression = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
    if (!passwordRegexExpression.test(password)) {
        throw new ApiError(400, "Password must be at least 8 characters long, containing at least 1 uppercase letter, 1 lowercase letter, 1 number, and can include special characters.")
    }


    //  fullname length must be 8 digit or greater then 8 digit
    if (!(fullName.length >= 8)) {
        throw new ApiError(400, "Name must be at least 8 characters long.")
    }

    //  check for existed user
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }


    // upload the file on multer and save them on public folder for temporary usage
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // console.log(req.files);

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }


    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }


    // upload the file on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required...")
    }

    // make the entry of user in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })


    // do not send password and refresh token to frontend 
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    // return the response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {

    // req body => data
    // username or email
    // find the user
    // password check
    // access and refresh token 
    // send cookies
    //  return res

    const { username, email, password } = req.body

    // username or email validation
    if (!(username || email)) {
        throw new ApiError(404, "username or email must required")
    }

    // find the user in the db
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does'nt exist")
    }

    //  check password of the user
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    //  create access and refresh token 
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")


    // send cookies
    const options = {
        httpOnly: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {
            user: loggedInUser, accessToken, refreshToken
        }, "user logged In Successfully"))
})

const logoutUser = asyncHandler(async (req, res) => {

    const user = await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        { new: true }
    )

    const options = {
        httpOnly: true
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"))
})

export {
    registerUser,
    loginUser,
    logoutUser
}