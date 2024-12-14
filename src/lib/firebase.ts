import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { z } from "zod";

const firebaseConfig = z
	.object({
		apiKey: z.string(),
		authDomain: z.string(),
		projectId: z.string(),
		storageBucket: z.string(),
		messagingSenderId: z.string(),
		appId: z.string(),
		measurementId: z.string(),
	})
	.parse({
		apiKey: import.meta.env.VITE_FB_API_KEY,
		authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
		projectId: import.meta.env.VITE_FB_PROJECT_ID,
		storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
		messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
		appId: import.meta.env.VITE_FB_APP_ID,
		measurementId: import.meta.env.VITE_FB_MEASUREMENT_ID,
	});

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore, auth, analytics };
