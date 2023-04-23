import moment from "moment-timezone";

/**
 * Extracts the time from a given date string and returns it in the format "h:mm A".
 * @param dt - The date string to extract the time from.
 * @returns The extracted time in the format "h:mm A".
 */
export function extractTime(dt: string) {
  return moment(dt).format("h:mm A");
}
