const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const listItems = ["Buy Food", "Prepare Dinner"];
const workItems = [];

app.get("/", function (req, res) {
  let day = date.getDate();

  res.render("list", { listTitle: day, newListItems: listItems });
});

app.post("/", (req, res) => {
  let listItem = req.body.listItem;

  if (req.body.list === "Work") {
    workItems.push(listItem);
    res.redirect("/work");
  } else {
    listItems.push(listItem);
    res.redirect("/");
  }
});

app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.post("/work", (req, res) => {
  let item = req.body.listItem;
  workItems.push(item);
  res.redirect("/work");
});

app.listen(3000, function () {
  console.log("Server started on port 3000.");
});
