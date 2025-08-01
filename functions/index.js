const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.deleteUserByUid = functions.https.onCall(async (data) => {
    console.log("Received data:", data.data);
    const uid = data.data.uid;
    if(!data){
        throw new functions.https.HttpsError(
            "invalid-argument",
            "The function must be called with an argument containing the UID."
        );
    }

    if (!uid) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "UID is required"
        );
    }

    try {
        // Delete user from Firebase Authentication
        await admin.auth().deleteUser(uid);
        console.log(`Deleted user from Auth: ${uid}`);

        // Delete user's document from Firestore
        const userPath = `users/${uid}`;
        await admin.firestore().recursiveDelete(admin.firestore().doc(userPath));
        console.log(`Deleted user document from Firestore: ${uid}`);

        return {
            success: true,
            message: `User ${uid} deleted from Auth and Firestore.`,
        };
    } catch (error) {
        console.error("Error deleting user:", error);
        throw new functions.https.HttpsError(
            "internal",
            "Failed to delete user",
            error
        );
    }
});
