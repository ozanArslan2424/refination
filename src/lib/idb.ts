import { get, set } from "idb-keyval";

type IdbKeys = "user";

export const idb = {
	get: async <T>(key: IdbKeys) => {
		const data = await get<T>(key);

		if (!data) {
			throw new Error(`Key not found: ${key}`);
		}

		return data;
	},
	set: async <T>(key: IdbKeys, value: T) => {
		await set(key, value);
	},
};
