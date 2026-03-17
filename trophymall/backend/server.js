import express from "express"
import cors from "cors"

import inventoryRoutes from "./routes/inventoryRoutes.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/inventory",inventoryRoutes)

app.listen(5000,()=>{
  console.log("API running on port 5000")
})