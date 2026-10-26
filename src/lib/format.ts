const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' });

/** "2026-10-25" → "October 25, 2026". */
export function formatDate(iso: string): string {
  return dateFormat.format(new Date(`${iso}T00:00:00Z`));
}

/** "actualImplementationUnknown" → "Actual implementation unknown". */
export function attributeLabel(key: string): string {
  const words = key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function attributeValue(value: unknown): string {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return typeof value === 'string' ? value : JSON.stringify(value);
}

export function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}
