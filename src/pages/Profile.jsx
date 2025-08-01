import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase"; // Adjust path
import { useLoadingStore } from "../store/useLoadingStore";
import { fetchAllProjects } from "../utils/FetchProject";
import { doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";

export default function Profile() {
    const [form, setForm] = useState(null);
    const setLoading = useLoadingStore((state) => state.setLoading);

    useEffect(() => {
        const getProjectByCode = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                console.error("User is not currently authenticated.", user);
                return;
            }

            const uid = user?.uid;
            setLoading(true);

            try {
                const allProjects = await fetchAllProjects();
                const matchedProject = allProjects.find(p => p.uid === uid);
                if (matchedProject) {
                    setForm(matchedProject);
                } else {
                    console.warn("Project not found for uid:", uid);
                }
            } catch (error) {
                console.error("Error fetching project by uid:", error);
            } finally {
                setLoading(false);
            }
        });

        return () => getProjectByCode();
    }, [setLoading]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = auth.currentUser;
        const uid = user.uid;
        setLoading(true);
        try {
            if (!uid) throw new Error("No UID found");
            console.log("form user submitted: ", form);

            // Update eventDetails/info
            await updateDoc(doc(db, `users/${uid}/eventDetails/info`), {
                eventDate: form.eventDate,
                startTime: form.startTime,
                endTime: form.endTime,
                venueName: form.venue,
                heroNames: form.heroNames,
                pin: form.pin,
                address: form.address,
                updatedAt: new Date(),
            });

            // Update eventDetails/budget
            await updateDoc(doc(db, `users/${uid}/eventDetails/budget`), {
                members: Number(form.members),
                amount: Number(form.amount),
                holderName: form.bank.holderName,
                bankName: form.bank.name,
                branchName: form.bank.branch,
                accountNumber: Number(form.bank.account),
                ifsc: form.bank.ifsc,
            });

            toast.success("Profile updated successfully.");
        } catch (err) {
            console.error("Failed to update profile:", err);
            toast.error("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-3xl font-bold">User Profile</h2>
            <form onSubmit={handleSubmit} className="">
                {/* Event Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
                    <h3 className="col-span-full text-xl font-semibold">Event Details</h3>
                    <div className="space-y-1">
                        <label htmlFor="eventDate" className="block text-sm font-medium text-orange-400">Event Date</label>
                        <input 
                            name="eventDate" 
                            type="date"
                            value={form?.eventDate} 
                            onChange={handleChange} 
                            className="input text-sm" 
                            placeholder="Event Date" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="startTime" className="block text-sm font-medium text-orange-400">Start Time</label>
                        <input 
                            name="startTime" 
                            type="time"
                            value={form?.startTime} 
                            onChange={handleChange} 
                            className="input text-sm" 
                            placeholder="Start Time" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="endTime" className="block text-sm font-medium text-orange-400">End Time</label>
                        <input 
                            name="endTime" 
                            type="time"
                            value={form?.endTime} 
                            onChange={handleChange} 
                            className="input text-sm" 
                            placeholder="End Time" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="venue" className="block text-sm font-medium text-orange-400">Venue</label>
                        <input 
                            name="venue" 
                            type="text"
                            value={form?.venue} 
                            onChange={handleChange} 
                            className="input text-sm" 
                            placeholder="Venue Name" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="heroNames" className="block text-sm font-medium text-orange-400">Hero Names</label>
                        <input 
                            name="heroNames" 
                            type="text"
                            value={form?.heroNames} 
                            onChange={handleChange} 
                            className="input text-sm" 
                            placeholder="Hero Names" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="pin" className="block text-sm font-medium text-orange-400">Pin Code</label>
                        <input 
                            name="pin" 
                            type="number"
                            value={form?.pin} 
                            onChange={handleChange} 
                            className="input text-sm" 
                            placeholder="Pin Code" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="address" className="block text-sm font-medium text-orange-400">Address</label>
                        <input 
                            name="address" 
                            type="text"
                            value={form?.address} 
                            onChange={handleChange} 
                            className="input text-sm" 
                            placeholder="Address" 
                        />
                    </div>
                </div>

                {/* Budget Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
                    <h3 className="col-span-full text-xl font-semibold">Budget Details</h3>
                    <div className="space-y-1">
                        <label htmlFor="members" className="block text-sm font-medium text-orange-400">No. of Members</label>
                        <input 
                            name="members" 
                            type="number"
                            value={form?.members} 
                            onChange={handleChange} 
                            className="input text-sm" 
                            placeholder="No. of Members" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="amount" className="block text-sm font-medium text-orange-400">Total Amount</label>
                        <input 
                            name="amount" 
                            type="number"
                            value={form?.amount} 
                            onChange={handleChange} 
                            className="input text-sm" 
                            placeholder="Total Amount" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="holderName" className="block text-sm font-medium text-orange-400">Bank Holder Name</label>
                        <input 
                            name="holderName" 
                            type="text"
                            value={form?.bank?.holderName} 
                            onChange={e => setForm({...form, bank: {...form.bank, holderName: e.target.value}})} 
                            className="input text-sm" 
                            placeholder="Account Holder Name" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="bankName" className="block text-sm font-medium text-orange-400">Bank Name</label>
                        <input 
                            name="bankName" 
                            type="text"
                            value={form?.bank?.name} 
                            onChange={e => setForm({...form, bank: {...form.bank, name: e.target.value}})}
                            className="input text-sm" 
                            placeholder="Bank Name" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="branchName" className="block text-sm font-medium text-orange-400">Branch Name</label>
                        <input 
                            name="branchName" 
                            type="text"
                            value={form?.bank?.branch} 
                            onChange={e => setForm({...form, bank: {...form.bank, branch: e.target.value}})}
                            className="input text-sm" 
                            placeholder="Branch Name" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="accountNumber" className="block text-sm font-medium text-orange-400">Account Number</label>
                        <input 
                            name="accountNumber" 
                            type="number"
                            value={form?.bank?.account} 
                            onChange={e => setForm({...form, bank: {...form.bank, account: e.target.value}})} 
                            className="input" 
                            placeholder="Account Number" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="ifsc" className="block text-sm font-medium text-orange-400">IFSC Code</label>
                        <input 
                            name="ifsc" 
                            type="text"
                            value={form?.bank?.ifsc} 
                            onChange={e => setForm({...form, bank: {...form.bank, ifsc: e.target.value}})}
                            className="input" 
                            placeholder="IFSC Code" 
                        />
                    </div>
                </div>

                {/* Update Button */}
                <div className="col-span-full flex justify-end mt-4">
                    <button type="submit" className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition">
                        Update Profile
                    </button>
                </div>
            </form>
        </div>
    );
}
