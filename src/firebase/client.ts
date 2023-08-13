import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

async function provideApp(): Promise<FirebaseApp> {
  if (import.meta.env.PROD) {
    const response = await fetch("/__/firebase/init.json");
    return initializeApp(await response.json());
  } else {
    const firebaseConfig = {
      apiKey: import.meta.env.PUBLIC_API_KEY,
      authDomain: import.meta.env.PUBLIC_AUTH_DOMAIN,
      projectId: import.meta.env.PUBLIC_PROJECT_ID,
      storageBucket: import.meta.env.PUBLIC_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.PUBLIC_MESSAGING_SENDER_ID,
      appId: import.meta.env.PUBLIC_APP_ID,
    };

    return initializeApp(firebaseConfig);
  }
}

async function getApp(): Promise<FirebaseApp> {
  //@ts-ignore
  if (window["firebase_app"] == null) {
    //@ts-ignore
    window["firebase_app"] = await provideApp();
  }

  //@ts-ignore
  return window["firebase_app"];
}

export async function authProvider() {
  const app = await getApp();
  if (import.meta.env.PROD) {
    return getAuth(app);
  } else {
    const auth = getAuth(app);

    connectAuthEmulator(auth, "http://127.0.0.1:9099");
    return auth;
  }
}
