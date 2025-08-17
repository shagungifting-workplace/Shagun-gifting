import { useState } from "react";
import toast from "react-hot-toast";
import { FaCloudUploadAlt } from "react-icons/fa";
import { db, auth } from '../utils/firebase';
import { doc, setDoc } from 'firebase/firestore';

const FloatingInput = ({ label, name, type = "text", value, onChange, required = false }) => {
    return (
        <div className="relative w-full">
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                required={required}
                onChange={onChange}
                placeholder={label}
                className="peer md:h-14 h-12 w-full border-2 border-gray-300 rounded-lg px-3 md:pt-6 pt-4 text-sm placeholder-transparent focus:outline-none focus:border-[#f45b0b] transition-all"
            />
            <label
                htmlFor={name}
                className="absolute left-3 top-2 text-gray-500 text-xs transition-all
                md:peer-placeholder-shown:top-4 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
                md:peer-focus:top-2 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#f45b0b]"
            >
                {label} {required && <span className="text-red-500">*</span>}
            </label>
        </div>
    );
};

export default function AgentProfileForm({ setShowDrawer, setAgents }) {

    const [formData, setFormData] = useState({
        agentId: "",
        fullName: "",
        email: "",
        mobile: "",
        pin: "",
        vendingMachine: "",
        wageRate: "",
        bankAccount: "",
        ifsc: "",
        status: "General Inquiry",
        notes: "",
    });
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        if (!uploadedFile) return;

        setFile(uploadedFile);

        // Create preview if image
        if (uploadedFile.type.startsWith("image/")) {
            setPreviewUrl(URL.createObjectURL(uploadedFile));
        } else {
            setPreviewUrl(null); // No preview for PDFs
        }
    };

    const handleAddAgent = async (agentData) => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                toast.error("Admin not logged in");
                return;
            }

            const uid = currentUser.uid;
            const agentDocRef = doc(db, `admin/${uid}/agentDetails/${agentData.agentId}`);

            await setDoc(agentDocRef, {
                ...agentData,
                createdAt: new Date(),
            });

            // ✅ Update local state (avoid duplicate)
            setAgents(prevAgents => {
                const exists = prevAgents.find(agent => agent.agentId === agentData.agentId);
                if (exists) {
                    // replace the old entry
                    return prevAgents.map(agent =>
                        agent.agentId === agentData.agentId ? { ...agent, ...agentData } : agent
                    );
                }
                // add new entry
                return [...prevAgents, agentData];
            });

            toast.success("Agent added successfully!");
            setShowDrawer(false);
        } catch (error) {
            console.error("Error adding agent:", error);
            toast.error("Failed to add agent");
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        // Mobile validation (only 10 digits)
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(formData.mobile)) {
            toast.error("Mobile number must be exactly 10 digits");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        // PIN validation (only 6 digits)
        const pinRegex = /^[0-9]{6}$/;
        if (!pinRegex.test(formData.pin)) {
            toast.error("PIN Code must be exactly 6 digits");
            return;
        }

        // If all validations pass
        console.log(formData, file);
        handleAddAgent(formData);
    };

    return (
        <div className="min-h-screen bg-[#fef3eb] md:px-4 flex justify-center">
            <form
                onSubmit={handleSubmit}
                className="p-6 rounded-xl w-full max-w-2xl md:space-y-6 space-y-4"
            >
                <h2 className="sm:text-4xl text-3xl font-bold text-center text-[#f45b0b] mb-4">
                    Agent Profile
                </h2>

                <FloatingInput label="Agent ID" name="agentId" value={formData.agentId} onChange={handleChange} required />
                <FloatingInput label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
                <FloatingInput label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required />
                <FloatingInput
                    label="Mobile Number"
                    name="mobile"
                    type="number"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    maxLength="10"
                />
                <FloatingInput
                    label="PIN Code"
                    name="pin"
                    value={formData.pin}
                    onChange={handleChange}
                    required
                    type="number"
                    pattern="[0-9]{6}"
                    maxLength="6"
                />

                <div className="relative w-full">
                    <select
                        name="vendingMachine"
                        value={formData.vendingMachine}
                        onChange={handleChange}
                        required
                        className="peer h-14 w-full border-2 border-gray-300 rounded-lg px-1.5 pt-5 text-sm focus:outline-none focus:border-[#f45b0b] bg-white"
                    >
                        <option value="" disabled>Select One</option>
                        <option value="Kiosk A">Kiosk A</option>
                        <option value="Kiosk B">Kiosk B</option>
                    </select>
                    <label
                        className="absolute left-3 top-2 text-gray-500 text-xs peer-focus:text-[#f45b0b]"
                    >
                        Assigned Vending Machines <span className="text-red-500">*</span>
                    </label>
                </div>

                <FloatingInput label="Daily Wage Rate (₹)" name="wageRate" value={formData.wageRate} onChange={handleChange} required />
                <FloatingInput label="Bank Account Number" name="bankAccount" value={formData.bankAccount} onChange={handleChange} required />
                <FloatingInput label="Bank IFSC Code" name="ifsc" value={formData.ifsc} onChange={handleChange} required />

                {/* File Upload */}
                <div className="w-full relative">
                    {/* file input */}
                    <div className="relative w-full h-48 border-2 border-gray-300 bg-white rounded-lg overflow-hidden hover:border-[#f45b0b] transition-colors cursor-pointer group">
                        <label className="text-gray-400 block m-2">
                            PAN / Aadhaar (ID Proof) <span className="text-red-500">*</span>
                        </label>

                        {/* Preview underneath */}
                        {previewUrl && (
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="absolute inset-0 w-full h-full object-contain z-0"
                            />
                        )}

                        {/* Upload label on top */}
                        <label
                            htmlFor="fileInput"
                            className={`absolute inset-0 z-10 flex flex-col items-center justify-center text-center gap-2 hover:bg-white/70 transition-opacity duration-300 ${file ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                                }`}
                        >
                            <FaCloudUploadAlt className="text-2xl text-[#f45b0b]" />
                            <span className="text-sm text-gray-600 px-2">
                                {file
                                    ? "Click to change the file"
                                    : "Click to upload or drag and drop PDF/JPG of PAN or Aadhaar card."}
                            </span>
                        </label>

                        <input
                            id="fileInput"
                            type="file"
                            accept="application/pdf,image/*"
                            className="hidden"
                            required
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* PDF fallback message */}
                    {!previewUrl && file?.type === "application/pdf" && (
                        <div className="mt-2 text-sm text-gray-500">
                            PDF file uploaded: <span className="font-medium">{file.name}</span>
                        </div>
                    )}
                </div>

                {/* Status - Radio Buttons */}
                <div className="h-10 w-full border-2 bg-white border-gray-300 rounded-lg px-3 pt-2 text-sm placeholder-transparent focus:outline-none focus:border-[#f45b0b] transition-all">
                    <div className="flex md:gap-4 gap-2 md:text-sm text-xs justify-between">
                        <div className="block md:text-sm text-xs text-gray-400">Status</div>
                        <div className="flex gap-x-4">
                            {["Active", "Inactive", "Training", "General Inquiry"].map((status) => (
                                <label key={status} className="flex items-center md:gap-2">
                                    <input
                                        type="radio"
                                        name="status"
                                        value={status}
                                        checked={formData.status === status}
                                        onChange={handleChange}
                                        className="accent-[#f45b0b]"
                                    />
                                    {status}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Notes and Remark */}
                <div className="relative w-full">
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Notes / Remarks"
                        rows={3}
                        className="peer w-full border-2 border-gray-300 rounded-lg px-3 pt-6 placeholder-transparent text-sm focus:outline-none focus:border-[#f45b0b]"
                    />
                    <label
                        htmlFor="notes"
                        className="absolute left-3 top-2 text-gray-500 text-xs transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#f45b0b]"
                    >
                        Notes / Remarks
                    </label>
                </div>

                <button
                    type="submit"
                    className="border text-[#A44B56] border-[#F4B5A1] md:py-3 md:px-6 py-2 px-4 rounded-lg font-semibold hover:bg-white transition-all duration-300"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}
