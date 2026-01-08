export function extractNumber(text) {
  const num = text.match(/\d+/);
  return num ? Number(num[0]) : null;
}
