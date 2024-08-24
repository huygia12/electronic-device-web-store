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

export { arrayInReverse, getImageUrl };
