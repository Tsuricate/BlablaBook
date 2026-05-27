// fonction de conversion d'une unite de temps en millisecondes
export function convertInMs(time: string) {
  const regex = /^(\d+)([smhd])$/;
  const match = time.match(regex);
  if (!match) throw new Error('Bad Format of time.');
  const value = parseInt(match[1], 10);
  const unite = match[2];
  switch (unite) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 1000 * 60;
    case 'h':
      return value * 1000 * 60 * 60;
    case 'd':
      return value * 1000 * 60 * 60 * 24;
    default:
      throw new Error('Unite not supported.');
  }
}
