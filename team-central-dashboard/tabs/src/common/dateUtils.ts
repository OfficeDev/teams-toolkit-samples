import moment from "moment-timezone";

export function extractTime(dt: string) {
  return moment(dt).format("h:mm A");
}
