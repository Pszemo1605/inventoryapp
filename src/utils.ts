export const ITEM_CATEGORIES = {
	furniture: "furniture",
	electronic: "electronic",
	item: "item",
} as const;

export const ITEM_CATEGORIES_TRANSLATE: { [K in keyof typeof ITEM_CATEGORIES]: string } = {
	electronic: "elektronika",
	furniture: "meble",
	item: "przedmiot",
} as const;

export const translateQuery = (query: string): string => {
	for (const key in ITEM_CATEGORIES_TRANSLATE) {
		const translatedKey = ITEM_CATEGORIES_TRANSLATE[key as keyof typeof ITEM_CATEGORIES_TRANSLATE];

		if (query === translatedKey) {
			return key;
		}
	}

	return query;
};
