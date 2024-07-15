const express = require("express");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const app = express();
app.use(morgan("tiny"));
app.use(express.static(path.join(process.cwd(), "public")));
console.log("----->", fs.existsSync(path.join(process.cwd(), "public", "media/adverts/patven-1716029995516-bg.jpeg")));

app.listen(3001, () => console.log("Server listening on port 3001"));
