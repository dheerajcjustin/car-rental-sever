const moment = require("moment");

const getDateRange = (start, end) => {
  start = moment(start, "MMM Do YYYY").toDate();
  end = moment(end, "MMM Do YYYY").toDate();
  const dateArray = [];
  const dateEnd = new Date(end);
  for (
    let dateToday = new Date(start);
    dateToday <= dateEnd;
    dateToday.setDate(dateToday.getDate() + 1)
  ) {
    dateArray.push(moment(dateToday).format("MMM Do YYYY"));
  }
  return dateArray;
};
exports.getDateRange = getDateRange;
