exports.getDate = function () {

  const today = new Date();

  const options = {
    weekday: "long",
    //year: "numeric",
    month: "long",
    day: "numeric",
  };
  let day = today.toLocaleDateString("en-US", options);

  return day;
}

exports.getDay = function () {

  const today = new Date();

  const options = {
    weekday: "long"
  };
  return today.toLocaleDateString("en-US", options);

}


