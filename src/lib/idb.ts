import { get, set } from "idb-keyval";

type IDBKeys = "user";

export const idb = {
	get: async <T>(key: IDBKeys) => {
		const data = await get<T>(key);

		if (!data) {
			throw new Error(`Key not found: ${key}`);
		}

		return data;
	},
	set: async <T>(key: IDBKeys, value: T) => {
		await set(key, value);
	},
};
