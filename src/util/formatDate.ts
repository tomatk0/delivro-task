export const formatDate = (utcString: string, includeTime: boolean): string => {
  const date = new Date(utcString);

  if (isNaN(date.getTime())) return "Invalid date";

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  let formatted = `${day}.${month}.${year}`;

  if (includeTime) {
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    formatted += ` ${hours}:${minutes}`;
  }

  return formatted;
};
