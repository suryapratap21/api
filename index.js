const express = require("express");
const app = express();

const routes = require("./routes");

require("./services/passport");

app.use(routes);

app.get("/api/test", (req, res) => {
  res.send("hello test route");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("server started on port", PORT);
});
