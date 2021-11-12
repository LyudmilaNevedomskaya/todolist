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

const listSchema = {
  name: String,
  items: [listItemsSchema]
};

const List = mongoose.model("List", listSchema);



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

  // let listItem = req.body.listItem;

  // if (req.body.list === "Work") {
  //   workItems.push(listItem);
  //   res.redirect("/work");
  // } else {
  //   listItems.push(listItem);
  //   res.redirect("/");
  // }
});

app.post("/delete", (req, res) => {
  //console.log(req.body.checkbox);
  const checkedItemId = req.body.checkbox;

  // ListItem.deleteOne({_id: checkedItemId}, function(err) {
  //   if(err) {
  //     console.log(err);
  //   } else {
  //     res.redirect("/");
  //   }
  // })
  ListItem.findByIdAndRemove(checkedItemId, function(err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

// app.get("/work", (req, res) => {
//   res.render("list", { listTitle: "Work List", newListItems: workItems });
// });

app.get("/:id", (req, res) => {
  //console.log(req.params.id);
  const customListName = req.params.id;

  List.findOne({name:customListName}, function(err, foundList) {
    if(!err) {
      if (!foundList) {
        //console.log("NOOOOOOOOOO");
        //CREATE A NEW LIST///////
        const list = new List({
          name: customListName,
          items: defaultItems
        });
      
        list.save();
        res.redirect("/"+customListName);
      } else {
        //console.log("FIND");
        //SHOW AN EXISTING LIST
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items })
      }
    }
  })

  

})
// app.post("/work", (req, res) => {
//   let item = req.body.listItem;
//   workItems.push(item);
//   res.redirect("/work");
// });

app.listen(3000, function () {
  console.log("Server started on port 3000.");
});