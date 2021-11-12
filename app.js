const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/todolistDB");

const listItemsSchema = {
  name: {
    type: String,
    require: true
  }
};

const ListItem = mongoose.model("ListItem", listItemsSchema);

const item1 = new ListItem({
  name: "Welcome to your todolist!"
});
const item2 = new ListItem({
  name: "Hit the + button to add a new item"
});
const item3 = new ListItem({
  name: "<-- Hit this to delete an item!"
});

const defaultItems = [item1, item2, item3];
// const workItems = [];

app.get("/", function (req, res) {
  let day = date.getDate();
  ListItem.find({}, function (err, listItems) {
    if (listItems === 0) {
      ListItem.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Succesfully saved default items into DB");
        }
      })
      res.redirect("/");
    } else {
      res.render("list", { listTitle: day, newListItems: listItems });
    }
  })
});

app.post("/", (req, res) => {
  const itemName = req.body.listItem;

  const item = new ListItem({
    name: itemName
  });

  item.save();

  res.redirect("/");
  // let listItem = req.body.listItem;

  // if (req.body.list === "Work") {
  //   workItems.push(listItem);
  //   res.redirect("/work");
  // } else {
  //   listItems.push(listItem);
  //   res.redirect("/");
  // }
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