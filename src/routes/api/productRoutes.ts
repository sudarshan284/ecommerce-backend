import express, { Router } from "express";

import productController from "../../controllers/product.controller";

const router: Router = express.Router();

router.post("/", productController.addProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getSpecificProduct);
router.delete("/:id", productController.deleteProduct);
router.put("/:id", productController.updateProduct);
export default router;
