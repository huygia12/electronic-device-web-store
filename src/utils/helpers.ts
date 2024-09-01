import { Optional } from "./declare";

/**
 *
 * @param {T} arr
 * @returns reverse array but clone it to another
 */
const arrayInReverse = <T>(arr: T[]): T[] => {
  const temp: T[] = [...arr].reverse();
  return temp;
};

const getImageUrl = (file: File): Optional<string> => {
  let url: Optional<string>;
  try {
    url = URL.createObjectURL(file);
  } catch {
    console.warn("failed to create url from file");
  }
  return url;
};

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const padZero = (num: number) => String(num).padStart(2, "0");

  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());

  const day = padZero(date.getDate());
  const month = padZero(date.getMonth() + 1); // Months are zero-indexed
  const year = date.getFullYear();

  return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
};

const getDayOfMonthString = (date: Date): string => {
  const day = date.getDate();

  return `ngày ${day}`;
};

const getDateString = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day} - T${month}, ${year}`;
};

const getRatioString = (num1: number, num2: number): string => {
  if (num2 === 0) return `+ 0%`;
  const ratio: number = Math.abs(num1 - num2) / num2;
  return num1 < num2 ? `- ${ratio}%` : `+ ${ratio}%`;
};

const getNumberGapString = (num1: number, num2: number): string => {
  const gap: number = Math.abs(num1 - num2);
  return num1 < num2 ? `- ${gap}%` : `+ ${gap}%`;
};

export {
  arrayInReverse,
  getImageUrl,
  formatDateTime,
  getRatioString,
  getNumberGapString,
  getDayOfMonthString,
  getDateString,
};
