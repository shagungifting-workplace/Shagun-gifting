const functions = require("firebase-functions");
const admin = require("firebase-admin");
const XLSX = require("xlsx");
const cors = require("cors")({ origin: true });

admin.initializeApp();
const db = admin.firestore();

exports.deleteUserByUid = functions.https.onCall(async (data) => {
    console.log("Received data:", data.data);
    const uid = data.data.uid;
    if (!data) {
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
        await admin
            .firestore()
            .recursiveDelete(admin.firestore().doc(userPath));
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

exports.exportFirestoreToExcel = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            const snapshot = await db.collection("users").get();
            const rows = [];

            for (const userDoc of snapshot.docs) {
                const userId = userDoc.id;
                const userData = userDoc.data();

                // --- Personal Details Subcollection ---
                let personalDetails = {};
                const personalSnap = await db
                    .collection(`users/${userId}/personalDetails`)
                    .get();
                personalSnap.forEach((doc) => {
                    personalDetails = { ...personalDetails, ...doc.data() };
                });

                // --- Event Details Subcollection ---
                let eventDetails = {};
                const eventSnap = await db
                    .collection(`users/${userId}/eventDetails`)
                    .get();
                eventSnap.forEach((doc) => {
                    const data = doc.data();
                    if (doc.id === "budget") {
                        eventDetails.budget = data;
                    } else if (doc.id === "info") {
                        eventDetails.info = data;
                    } else if (doc.id === "envelopeRecharge") {
                        eventDetails.envelopeRecharge = data;
                    } else if (doc.id === "payment") {
                        eventDetails.payment = data;
                    } else {
                        eventDetails[doc.id] = data; // catch-all
                    }
                });

                // Combine everything into one row
                rows.push({
                    userId,
                    ...userData,
                    ...personalDetails,
                    budget: JSON.stringify(eventDetails.budget || {}),
                    info: JSON.stringify(eventDetails.info || {}),
                    envelopeRecharge: JSON.stringify(
                        eventDetails.envelopeRecharge || {}
                    ),
                    payment: JSON.stringify(eventDetails.payment || {}),
                });
            }

            // Convert JSON → Excel
            const worksheet = XLSX.utils.json_to_sheet(rows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

            // Generate buffer
            const buffer = XLSX.write(workbook, {
                type: "buffer",
                bookType: "xlsx",
            });

            // Send file to client
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=firestore_export.xlsx"
            );
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.send(buffer);
        } catch (error) {
            console.error("Export error:", error);
            res.status(500).send("Error exporting Firestore");
        }
    });
});
