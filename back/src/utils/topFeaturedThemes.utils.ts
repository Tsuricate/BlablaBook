export type Lang = 'en' | 'fr';

export const pickRandom = <T>(items: T[], count: number): T[] => {
  const itemsCopy = [...items];
  const pickedItems: T[] = [];

  const maxItemsToPick = Math.min(count, itemsCopy.length);

  for (let i = 0; i < maxItemsToPick; i++) {
    const randomIndex = Math.floor(Math.random() * itemsCopy.length);
    const [selectedItem] = itemsCopy.splice(randomIndex, 1);

    pickedItems.push(selectedItem);
  }

  return pickedItems;
};
