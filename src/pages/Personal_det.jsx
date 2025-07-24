import React, { useState } from 'react';
import { FaUpload, FaArrowLeft, FaGift, FaCheck } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { db, storage, auth } from "../utils/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import toast from 'react-hot-toast';

export default function Personal_det() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [fullName, setFullName] = useState('');
    const [eventType, setEventType] = useState('');
    const [loading, setLoading] = useState(false);
    const [side, setSide] = useState('');
    const [heroName, setHeroName] = useState('');

    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);

            // For image or pdf preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };

            if (file.type.startsWith('image/') || file.type === 'application/pdf') {
                reader.readAsDataURL(file);
            } else {
                setPreviewUrl(''); // Unsupported file
            }
        }
    };

    const handleSubmit = async () => {
        if (!fullName || !eventType) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setLoading(true);

        try {
            const user = auth.currentUser;
            if (!user) {
                toast.error("User not logged in");
                return;
            }

            let fileUrl = null;

            // Upload file to Firebase Storage
            if (selectedFile) {
                const fileRef = ref(storage, `event_cards/${user.uid}/${Date.now()}_${selectedFile.name}`);
                await uploadBytes(fileRef, selectedFile);
                fileUrl = await getDownloadURL(fileRef);
                console.log("fileUrl",fileUrl)
            }

            // Store data in Firestore
            await setDoc(doc(db, `users/${user.uid}/personalDetails/info`), {
                fullName: fullName,
                eventType: eventType,
                side: side || null,
                heroName: heroName || null,
                eventCardUrl: fileUrl || null,
                phone: user.phoneNumber,  
                updatedAt: serverTimestamp()
            }, { merge: true });


            toast.success("Details saved successfully!");
            navigate("/event_det");

        } catch (err) {
            console.error("Error saving details:", err);
            toast.error("Failed to save details. Check console for more info.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#fff5eb] to-[#fffdee]">
            {/* Navbar */}
            <div className="flex justify-between items-center px-9 py-7 gap-3 overflow-x-auto whitespace-nowrap">
                <div className="flex items-center gap-3">
                    <Link to="/">
                        <FaArrowLeft className="text-[16px] text-[#333] cursor-pointer shrink-0" />
                    </Link>
                    <FaGift className="text-lg text-[#f45b0b] flex-shrink-0" />
                    <span className="text-[#f45b0b] font-semibold text-lg sm:text-base">Shagun</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#f45b0b] text-white text-sm font-semibold flex items-center justify-center">1</div>
                    <div className="w-6 h-6 rounded-full bg-[#f45b0b] text-white text-sm font-semibold flex items-center justify-center">2</div>
                    <div className="w-6 h-6 rounded-full bg-gray-200 text-sm text-gray-700 flex items-center justify-center">3</div>
                    <div className="w-6 h-6 rounded-full bg-gray-200 text-sm text-gray-700 flex items-center justify-center">4</div>
                    <span className="w-6 h-6 rounded-full bg-gray-200 text-sm text-gray-700 flex items-center justify-center">
                        <FaCheck className="text-xs" />
                    </span>
                </div>
            </div>

            {/* Main Form Section */}
            <div className="flex-1 flex justify-center items-center px-5 py-8">
                <div className="bg-white rounded-xl shadow-md w-full max-w-lg p-8">
                    <h2 className="text-xl font-bold mb-6 text-gray-900">Personal Details</h2>

                    {/* full name */}
                    <label className="font-semibold mb-1 block text-gray-800">Full Name *</label>
                    <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-5 text-sm" 
                    />

                    {/* event type */}
                    <label className="font-semibold mb-1 block text-gray-800">Type of Event *</label>
                    <select 
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-5 text-sm bg-white"
                    >
                        <option value="">Select Event Type</option>
                        <option value="marriage">Marriage</option>
                        <option value="reception">Reception</option>
                        <option value="birthday">Birthday</option>
                        <option value="corporate">Corporate</option>
                        <option value="others">Others</option>
                    </select>

                    {(eventType === "marriage" || eventType === "reception") && (
                        <>
                            <label className="font-semibold mb-1 block text-gray-800">You're from *</label>
                            <select
                                value={side}
                                onChange={(e) => setSide(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-5 text-sm bg-white"
                            >
                                <option value="">Select side</option>
                                <option value="groom">Groom Side</option>
                                <option value="bride">Bride Side</option>
                            </select>

                            <label className="font-semibold mb-1 block text-gray-800">
                                {side === "bride" ? "Heroine Name (Bride)" : side === "groom" ? "Hero Name (Groom)" : "Hero/Heroine Name *"}
                            </label>
                            <input
                                type="text"
                                value={heroName}
                                onChange={(e) => setHeroName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-5 text-sm"
                            />
                        </>
                    )}

                    {/* event card */}
                    <label className="font-semibold mb-2 block text-gray-800">Upload Event Card (Optional)</label>
                    <div
                        className="border-2 border-dashed border-gray-300 rounded-lg px-5 py-6 text-center cursor-pointer text-gray-600 flex flex-col items-center gap-3 mb-6"
                        onClick={() => document.getElementById('fileInput').click()}
                    >
                        {
                            previewUrl ? (
                                <div className="mt-4">
                                    {selectedFile.type.startsWith('image/') ? (
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="max-w-full h-auto rounded-md shadow-md"
                                        />
                                    ) : selectedFile.type === 'application/pdf' ? (
                                        <iframe
                                            src={previewUrl}
                                            title="PDF Preview"
                                            className="w-full h-64 rounded-md shadow-md"
                                        />
                                    ) : (
                                        <p className="text-red-500 text-sm">Preview not available for this file type.</p>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <FaUpload className="text-xl text-gray-500" />
                                    <p className="text-sm">{selectedFile ? selectedFile.name : 'Click to upload event card'}</p>
                                    <input
                                        type="file"
                                        id="fileInput"
                                        accept="image/*,.pdf,.doc,.docx"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </>
                            )
                        }
                    </div>

                    {/* save button */}
                    <button
                        className="w-full bg-[#0e1328] hover:bg-[#1c2035] text-white font-semibold py-3 rounded-lg text-base"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Continue"}
                    </button>
                </div>
            </div>
        </div>
    );
}
