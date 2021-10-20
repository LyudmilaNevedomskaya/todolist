const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");

let listItems = ["Buy Food", "Prepare Dinner"];
let workItems = [];

app.get("/", function (req, res) {
  let today = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  let day = today.toLocaleDateString("en-US", options);
  //console.log("DAY", day);
  // let currentDay = today.getDay();
  // let day = "";

  // switch (currentDay) {
  //   case 0:
  //     day = "Sunday";
  //     break;
  //   case 1:
  //     day = "Monday";
  //     break;
  //   case 2:
  //     day = "Tuesday";
  //     break;
  //   case 3:
  //     day = "Wednesday";
  //     break;
  //   case 4:
  //     day = "Thursday";
  //     break;
  //   case 5:
  //     day = "Friday";
  //     break;
  //   case 6:
  //     day = "Saturday";
  //     break;
  //   default:
  //     console.log(`Error!!! Current day is equal to: ${currentDay}`);
  //     break;
  // }
  // if (currentDay === 0) {
  //   day = "Sunday";
  // } else if (currentDay === 1) {
  //   day = "Monday";
  // } else if (currentDay === 2) {
  //   day = "Tuesday";
  // } else if (currentDay === 3) {
  //   day = "Wednesday";
  // } else if (currentDay === 4) {
  //   day = "Thursday";
  // } else if (currentDay === 5) {
  //   day = "Friday";
  // } else if (currentDay === 6) {
  //   day = "Saturday";
  // }
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

  //console.log(listItem);
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