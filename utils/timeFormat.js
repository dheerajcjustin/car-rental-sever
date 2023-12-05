const TimeCombiner = (date, time) => {
      time = time.trim();
      const timeArray = [
            "10.00 AM",
            "11.00 AM",
            "12.00 PM",
            "01.00 PM",
            "02.00 PM",
            "03.00 PM",
            "04.00 PM",
            "05.00 PM",
      ];
      const index = timeArray.indexOf(time);

      const hours = index + 10;
      date = new Date(date);
      date = date.setHours(hours);

      return date;
};
exports.TimeCombiner = TimeCombiner;

const isValidTime = (time) => {
      time = time.trim();
      const timeArray = [
            "10.00 AM",
            "11.00 AM",
            "12.00 PM",
            "01.00 PM",
            "02.00 PM",
            "03.00 PM",
            "04.00 PM",
            "05.00 PM",
      ];
      const index = timeArray.indexOf(String(time));
      if (index === -1) {
            // console.log("the time " + time + "is z valid");
            return false;
      }
      // console.log("the time " + time + "is  valid");

      return true;
};
exports.isValidTime = isValidTime;
