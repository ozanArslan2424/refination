import { firestore } from "@/lib/firebase";
import {
	type DocumentSnapshot,
	type FirestoreError,
	type QueryFieldFilterConstraint,
	arrayRemove,
	arrayUnion,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	limit,
	onSnapshot,
	or,
	orderBy,
	query,
	runTransaction,
	setDoc,
	updateDoc,
	where,
} from "firebase/firestore";
import type { DocumentData, Transaction, WithFieldValue } from "firebase/firestore";

type ColName = "sessions" | "users" | "organizations";

export const db = {
	get: async <T>(colName: ColName, docName: string) => {
		const docRef = doc(firestore, colName, docName);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			return null;
		}

		return docSnap.data() as T;
	},

	set: async <T extends WithFieldValue<DocumentData>>(
		colName: ColName,
		docName: string,
		data: T,
	) => {
		const docRef = doc(firestore, colName, docName);
		await setDoc(docRef, data);
	},

	update: async <T extends WithFieldValue<DocumentData>>(
		colName: ColName,
		docName: string,
		data: T,
	) => {
		const docRef = doc(firestore, colName, docName);
		await updateDoc(docRef, data);
	},

	delete: async (colName: ColName, docName: string) => {
		const docRef = doc(firestore, colName, docName);
		await deleteDoc(docRef);
	},

	listen: (
		colName: ColName,
		docName: string,
		observer: {
			next?: ((snapshot: DocumentSnapshot<DocumentData, DocumentData>) => void) | undefined;
			error?: (error: FirestoreError) => void;
			complete?: () => void;
		},
	) => {
		const docRef = doc(firestore, colName, docName);
		return onSnapshot(docRef, observer);
	},

	runTransaction: (updateFunction: (transaction: Transaction) => Promise<unknown>) =>
		runTransaction(firestore, updateFunction),

	ref: (colName: ColName, docName: string) => doc(firestore, colName, docName),

	findFirst: async <T>(colName: ColName, filter: QueryFieldFilterConstraint) => {
		const colRef = collection(firestore, colName);
		const q = query(colRef, filter, limit(1));
		const querySnap = await getDocs(q);

		if (querySnap.empty) {
			return null;
		}

		const doc = querySnap.docs[0];
		return { id: doc.id, ...doc.data() } as T;
	},

	findMany: async <T>(colName: ColName, filter: QueryFieldFilterConstraint, limitCount: number) => {
		const colRef = collection(firestore, colName);
		const q = query(colRef, filter, limit(limitCount));
		const querySnap = await getDocs(q);

		if (querySnap.empty) {
			console.log("No matching documents.");
			return null;
		}

		const docs = querySnap.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		})) as T[];
		return docs;
	},

	arrayRemove: arrayRemove,

	arrayUnion: arrayUnion,

	filters: {
		eq: where,
		or: or,
		order: orderBy,
	},
};
