import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "./firebase"; // Adjust path as needed

export const fetchAllProjects = async () => {
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);
    const projects = [];
    console.log("users from fetch:", usersSnapshot)

    for (const userDoc of usersSnapshot.docs) {
        const uid = userDoc.id;
        console.log("uid from fetch:", uid);

        const eventRef = doc(db, `users/${uid}/eventDetails/info`);
        const budgetRef = doc(db, `users/${uid}/eventDetails/budget`);
        const personalRef = doc(db, `users/${uid}/personalDetails/info`);
        const guestRef = collection(db, "users", uid, "eventDetails", "info", "guests");

        const [eventSnap, budgetSnap, personalSnap, guestSnap] = await Promise.all([
            getDoc(eventRef),
            getDoc(budgetRef),
            getDoc(personalRef),
            getDocs(guestRef),
        ]);

        if (eventSnap.exists() && budgetSnap.exists() && personalSnap.exists()) {
            const eventData = eventSnap.data();
            const budgetData = budgetSnap.data();
            const personalData = personalSnap.data();

            const guests = guestSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            const project = {
                uid: uid,

                // event details
                projectCode: eventData.projectCode || "",
                eventDate: eventData.eventDate || "",
                startTime: eventData.startTime || "",
                endTime: eventData.endTime || "",
                venue: eventData.venueName || "",
                heroNames: eventData.heroNames || "",
                pin: eventData.pin || "",
                address: eventData.address || "",
                eventNumber: eventData.eventNumber || "",
                updatedAt: eventData.updatedAt?.toDate?.().toLocaleString() || "",
                
                // event budget
                members: budgetData.members || 0,
                amount: budgetData.amount || 0,
                bank: {
                    holderName: budgetData.holderName || "",
                    name: budgetData.bankName || "",
                    branch: budgetData.branchName || "",
                    account: budgetData.accountNumber || "",
                    ifsc: budgetData.ifsc || "",
                },
                accepted: budgetData.accepted || false,
                platformFee: budgetData.platformFee || 0,
                totalFee: budgetData.totalFee || 0,
                fixedFee: budgetData.fixedFee || 0,
                isComplete: budgetData.isComplete || false,
                submittedAt: budgetData.submittedAt?.toDate?.().toLocaleString() || "",
                
                // personal data
                hostName: personalData.fullName || "Unknown",
                email: personalData.email || "",
                eventCard: personalData.eventCardUrl || "",
                eventType: personalData.eventType || "",
                phone: personalData.phone || "",
                side: personalData.side || "",
                heroName: personalData.heroName || "",

                guests,
                
            };

            projects.push(project);
        }
    }

    return projects;
};
