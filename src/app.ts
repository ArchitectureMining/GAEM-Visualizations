import express = require("express");
const app = express();

app.get("/", (req, res) => {
	res.send("GAEM visualizations webserver test.");
});

app.listen(3000, () => {
	console.log("GAEM visualization web app listening on port 3000.");
});
