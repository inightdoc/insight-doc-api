import { Router } from "express";
import multer from "multer";
import { AppController } from "../controllers/app.controller";
import { DocController } from "../controllers/doc.controller";
import { asyncHandler } from "../helpers/async-handler.helper";

const router = Router();
const docController = new DocController();
const appController = new AppController();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post(
  "/read",
  upload.single("file"),
  asyncHandler(docController.readDocument)
);

router.post("/chat", asyncHandler(docController.chat));

router.get("/history", asyncHandler(docController.getChatHistory));
router.get("/session-info", asyncHandler(docController.getSessionInfo));
router.delete("/delete-session", asyncHandler(docController.deleteSession));

router.get("/health", asyncHandler(appController.healthCheck));

export default router;
