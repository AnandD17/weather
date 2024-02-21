import moment from "moment";

export const generateGreetings = () => {
  var currentHour: any = moment().format("HH");

  if (currentHour >= 3 && currentHour < 12) {
    return "Good Morning";
  } else if (currentHour >= 12 && currentHour < 15) {
    return "Good Afternoon";
  } else if (currentHour >= 3 && currentHour < 20) {
    return "Good Evening";
  } else {
    return "Hello";
  }
};
