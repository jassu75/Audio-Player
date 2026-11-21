import app from "./app.js";
const port = process.env.PORT || 8080;
app.listen(port, () => console.log("Musify server listening on port", port));
