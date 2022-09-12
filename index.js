const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const port = process.env.PORT || 8000;

const { db } = require("./connection/db");

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json({ extended: false }));

const UserRouter = require("./routes/UserRoute");
const ProductRouter = require("./routes/ProductRoute");
const OrderRouter = require("./routes/OrderRoute");

app.use(UserRouter);
app.use(ProductRouter);
app.use(OrderRouter);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
