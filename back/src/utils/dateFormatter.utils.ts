/**
 * Convert a date into a JS Date
 *  unknown -> null
 * "YYYY" -> Jan 1 of that year
 * "YYYY-MM-DD" -> stardard Date
 */
export const formatDate = (date: string | null): Date | null => {
  if (!date) return null;

  if (/^\d{4}$/.test(date)) {
    return new Date(`${date}-01-01`);
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return new Date(date);
  }

  return null;
};
