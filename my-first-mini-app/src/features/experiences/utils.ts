export function guessCategory(title: string, desc: string): string | undefined {
  const text = (title + ' ' + desc).toLowerCase();
  if (/hik|trek|mount|trail|climb/.test(text)) return 'Hiking';
  if (/surf|wave|beach|ocean|sea/.test(text)) return 'Surf';
  if (/yoga|meditat|wellness|breath/.test(text)) return 'Yoga';
  if (/social|meet|network|tango|dance|party|gather/.test(text)) return 'Social';
  if (/cultur|art|museum|histor|tour/.test(text)) return 'Cultura';
  return undefined;
}
