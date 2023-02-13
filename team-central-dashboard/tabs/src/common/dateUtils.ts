import moment from "moment-timezone";

export function extractTime(dt: string) { 
  return moment(dt).format("h:mm A");
}

export function isToday(dt: string) {
  var date = new Date(dt.concat("Z"));
  var now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function laterThanNow(dt: string) {
  var date = new Date(dt.concat("Z"));
  var now = new Date();
  return date < now;
}
