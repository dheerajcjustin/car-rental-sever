const getDateRange = (start, end) => {
  const dateArray = [];
  const dateEnd = new Date(end);
  for (
    let dateToday = new Date(start);
    dateToday <= dateEnd;
    dateToday.setDate(dateToday.getDate() + 1)
  ) {
    dateArray.push(new Date(dateToday));
  }
  return dateArray;
};
exports.getDateRange = getDateRange;
