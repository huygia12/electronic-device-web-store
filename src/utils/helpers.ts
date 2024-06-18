const arrayInReverse = <T>(arr: T[]): T[] => {
  const temp: T[] = [...arr].reverse();
  return temp;
};
export { arrayInReverse };
