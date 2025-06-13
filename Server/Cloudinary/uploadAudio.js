import { Router } from "express";
import multer from "multer";
import cloudinary from "../Config/cloudinary.js";
import firebaseAuthenticate from "../MiddleWare/firebaseAuthenticate.js";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
router.post(
  "/api/cloudinary/uploadaudio",
  firebaseAuthenticate,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json("No audio file found ");
      } else if (!req.file.mimetype.startsWith("audio/")) {
        return res.status(400).json("The file is not an audio file");
      } else {
        const publicId = `${req.user.uid}/${Date.now()}`;
        const fileBase64 = req.file.buffer.toString("base64");
        const data = `data:${req.file.mimetype};base64,${fileBase64}`;
        const response = await cloudinary.uploader.upload(data, {
          resource_type: "video",
          public_id: publicId,
          tags: [`${req.user.uid}`],
          folder: "Tejas Musify/Audio",
        });
        res.status(200).json({
          audioUrl: response.secure_url,
          publicId: response.public_id,
        });
      }
    } catch (err) {
      console.error("Image Upload Failed");
    }
  }
);

export default router;
