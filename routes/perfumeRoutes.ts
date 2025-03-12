import express from "express";
const router = express.Router();
import  { createPerfume,
    getPerfume,
    getAllPerfumes,
    deletePerfume,
    updatePerfume,
    // calcBatchPrice
} from "../controllers/perfumeController.js";
// we need to protect the middle ware thats why we are adding the middel ware here

router.get("/", getPerfume)
// router.post("/calcbatchprice", calcBatchPrice)
router.get("/all", getAllPerfumes)
router.post("/add", createPerfume);
router.delete("/", deletePerfume)
router.put("/", updatePerfume)
export default router
