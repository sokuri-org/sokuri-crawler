const CATEGORY_KEYWORDS = [
  { category: "토트백", keywords: ["토트백", "토트", "tote"] },
  { category: "크로스백", keywords: ["크로스백", "크로스", "cross"] },
  { category: "백팩", keywords: ["백팩", "backpack"] },
  { category: "숄더백", keywords: ["숄더백", "숄더", "shoulder"] },
  { category: "에코백", keywords: ["에코백", "에코", "eco"] },
  { category: "쇼퍼백", keywords: ["쇼퍼백", "쇼퍼", "shopper"] },
];

export function guessCategoryFromTitle(title) {
  const lowerTitle = title.toLowerCase();

  for (const { category, keywords } of CATEGORY_KEYWORDS) {
    if (keywords.some((word) => lowerTitle.includes(word))) {
      return category;
    }
  }
  return "기타";
}
