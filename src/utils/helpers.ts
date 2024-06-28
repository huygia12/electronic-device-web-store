/**
 *
 * @param {T} arr
 * @returns reverse array but clone it to another
 */
const arrayInReverse = <T>(arr: T[]): T[] => {
  const temp: T[] = [...arr].reverse();
  return temp;
};
export { arrayInReverse };
