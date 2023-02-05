const moment = require("moment");

const getDateRange = (start, end) => {

  // console.log("start", start);
  // console.log("end end", end);
  // start = moment(start, "MMM Do YYYY").toDate();
  start = new Date(start)

  // end = moment(end, "MMM Do YYYY").toDate();
  end = new Date(end)
  // console.log("starting date", start);
  // console.log("end  date", end);

  const dateArray = [];
  const dateEnd = end;
  for (
    let dateToday = (start);
    dateToday <= (end);
    dateToday = moment(dateToday).add(1, 'd')) {

    dateArray.push(moment(dateToday).toDate());

  }

  return dateArray;
};
exports.getDateRange = getDateRange;
