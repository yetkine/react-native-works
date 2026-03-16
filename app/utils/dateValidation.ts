export function isValidDateFormat(dateString: string): boolean {
  if (!dateString) return true;

  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return false;

  const [year, month, day] = dateString.split('-').map(Number);

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day
  );
}

export function isPastDate(dateString: string): boolean {
  if (!dateString) return false;

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  return dateString < todayString;
}