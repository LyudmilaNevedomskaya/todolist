const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");

//mongoose.connect("mongodb://localhost:27017/todolistDB");
mongoose.connect("mongodb+srv://admin-lyudmila:Yarik2014@cluster0.oqamm.mongodb.net/todolistDB")

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

const listSchema = {
  name: String,
  items: [listItemsSchema]
};

const List = mongoose.model("List", listSchema);



app.get("/", function (req, res) {
  let day = date.getDate();
  ListItem.find({}, function (err, listItems) {
    if (listItems.length === 0) {
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
  const listName = req.body.list;

  const item = new ListItem({
    name: itemName
  });

  if (listName === date.getDate()) {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    })
  }
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === date.getDate()) {
    ListItem.findByIdAndRemove(checkedItemId, function(err) {
      if (!err) {
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList) {
      if (!err) {
        res.redirect("/" + listName);
      }
    });
  }
  
});

app.get("/:id", (req, res) => {
  const customListName = _.capitalize(req.params.id);

  List.findOne({name:customListName}, function(err, foundList) {
    if(!err) {
      if (!foundList) {
        //CREATE A NEW LIST///////
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/"+customListName);
      } else {
        //SHOW AN EXISTING LIST
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items })
      }
    }
  })
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000.");
});