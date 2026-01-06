export function getIndexFromText(text) {
  const map = {
    first: 0,
    one: 0,
    "1": 0,

    second: 1,
    two: 1,
    "2": 1,

    third: 2,
    three: 2,
    "3": 2,

    fourth: 3,
    four: 3,
    "4": 3,

    fifth: 4,
    five: 4,
    "5": 4
  };

  for (const key in map) {
    if (text.includes(key)) {
      return map[key];
    }
  }

  return null;
}
