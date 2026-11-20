// authMiddleware.js
import admin from "../Config/firebase.js";

const firebaseAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Auth Failed", error);
    return res.status(401).json({ error: "Unauthorized access" });
  }
};

export default firebaseAuthenticate;
