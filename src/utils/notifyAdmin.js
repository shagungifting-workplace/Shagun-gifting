import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase"; 

export const notifyAdminOnRegister = async (userData) => {
    try {
        const adminUid = import.meta.env.VITE_ADMIN_UID;
        const notificationId = `notif_${Date.now()}`; // unique ID
        const notificationRef = doc(db, `admin/${adminUid}/notifications/${notificationId}`);

        const payload = {
            type: "user_registered",
            message: `New user ${userData.fullName || "User"} registered.`,
            fullName: userData.fullName || "User",
            userId: userData.uid,
            email: userData.email || "",
            createdAt: serverTimestamp(),
            read: false,
        };

        await setDoc(notificationRef, payload);
    } catch (error) {
        console.error("Failed to notify admin:", error);
    }
};
