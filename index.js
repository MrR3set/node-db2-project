const server = require("./api/server.js");
require("dotenv").config();

const port = process.env.PORT || 5001;

server.listen(port,()=>console.log("api ok",port));