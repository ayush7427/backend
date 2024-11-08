import { app } from "./app.js"
import connectDB from "./db/index.js"
import dotenv from "dotenv"

const port = process.env.PORT || 3000

dotenv.config({
  path: "./env"
})

connectDB()
  .then(() => {

    //  for error
    app.on("error", (err) => {
      console.log("Error:", err);
      throw err
    })

    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`)
    })

  })
  .catch((err) => {
    console.log("Mongo db connection failure !", err);
  })



