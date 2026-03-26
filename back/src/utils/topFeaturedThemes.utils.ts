// Define the top featured themes and their search queries
export const topFeaturedThemes: Record<string, string> = {
  dragon: 'dragon',
  gardening: 'jardinage',
  ecology: 'écologie',
  cooking: 'cuisine',
  travel: 'voyage',
  tech: 'technologie',
  animals: 'animaux',
};

export const getRandomThemes = (numberOfElemToGet: number): string[] => {
  const keys = Object.keys(topFeaturedThemes);
  const randomizedThemes = [];

  for (let i = 0; i < numberOfElemToGet; i++) {
    const randomIndex = Math.floor(Math.random() * keys.length);
    randomizedThemes.push(keys.splice(randomIndex, 1)[0]);
  }

  return randomizedThemes;
};
