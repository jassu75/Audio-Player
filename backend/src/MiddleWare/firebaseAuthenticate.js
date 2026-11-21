import firebaseAuth from "../Config/firebase.js";
import { createSessionAuthenticate } from "../services/session.js";
const firebaseAuthenticate = createSessionAuthenticate(firebaseAuth);
export default firebaseAuthenticate;
