import { auth } from "@/lib/firebase";
import type { User } from "firebase/auth";
import { useEffect, useState } from "react";

export function useAuth() {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(setUser);
		return () => unsubscribe();
	}, []);

	return { user };
}
