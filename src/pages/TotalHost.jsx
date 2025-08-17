import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { useLoadingStore } from "../store/useLoadingStore";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { fetchAllProjects } from "../utils/FetchProject";
import toast from "react-hot-toast";
import { getFunctions, httpsCallable } from "firebase/functions";
import { auth, db } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

const TotalHost = () => {
    const [projects, setProjects] = useState([]);
    const setLoading = useLoadingStore((state) => state.setLoading);
    const [activeEvents, setActiveEvents] = useState(0);
    const [postponedEvents, setPostponedEvents] = useState(0);

    useEffect(() => {
        const getProjectByCode = async () => {
            setLoading(true);
            try {
                const allProjects = await fetchAllProjects();
                setProjects(allProjects);

                let activeEventsCount = 0;
                let postponedEventsCount = 0;
                for (let i = 0; i < allProjects.length; i++) {
                    const project = allProjects[i];
                    if (project?.status === "Running") {
                        activeEventsCount++;
                    }
                    if (project?.status === "Postponed") {
                        postponedEventsCount++;
                    }
                }
                setActiveEvents(activeEventsCount);
                setPostponedEvents(postponedEventsCount);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        getProjectByCode();
    }, [setLoading]);

    const handleDownload = () => {
        const exportData = projects.map((proj) => ({
            "Project Code": proj?.projectCode || "N/A",
            "Host": proj?.hostName || "Unknown",
            "Envelopes Distributed": `${proj?.distributed || 0}/${proj?.members || 0}`,
            "Status": proj?.status || "Running",
            "Refund": proj?.refund || 0,
            "IoT Machine": proj?.iot || "Working",
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(blob, `Shagun_Projects_Report_${Date.now()}.xlsx`);
    };

    const iot = 'Working';

    const handleDeleteAndGoBack = async (uid) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("Admin logged in:", user.uid);
            } else {
                console.log("No user logged in");
            }
        });

        setLoading(true);
        try {
            const functions = getFunctions();
            const deleteUserByUid = httpsCallable(functions, "deleteUserByUid");

            const res = await deleteUserByUid({ uid });
            console.log("Delete user from admin: ", res.data.message);
            toast.success("User deleted successfully");

            await fetchAllProjects().then((updatedProjects) => {
                setProjects(updatedProjects);
            });

        } catch (error) {
            console.error("Error deleting user document:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#fdf6ed] min-h-screen p-6">
            {/* Header */}
            <div className="flex justify-between items-center bg-[#4a0f23] rounded-t-lg p-4">
                <h1 className="text-2xl font-bold text-[#ccbf95]">SHAGUN</h1>
                <button
                    onClick={handleDownload}
                    className="bg-[#ccbf95] text-[#4a0f23] px-4 py-2 rounded-md hover:bg-yellow-700"
                >
                    Download Report
                </button>
            </div>

            <div className="bg-white p-2 ">
                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4 my-6">
                    <div className="bg-[#f5f1e6] text-center p-4 rounded-lg ">
                        <h2 className="text-3xl font-bold">
                            {activeEvents}
                        </h2>
                        <p className="text-gray-600">Running Projects</p>
                    </div>
                    <div className="bg-[#f5f1e6] text-center p-4 rounded-lg">
                        <h2 className="text-3xl font-bold"> {postponedEvents} </h2>
                        <p className="text-gray-600">Upcoming Projects</p>
                    </div>
                    <div className="bg-[#f5f1e6] text-center p-4 rounded-lg">
                        <h2 className="text-3xl font-bold">{projects.length - activeEvents - postponedEvents}</h2>
                        <p className="text-gray-600">Closed Projects</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex justify-between ">
                    <div>
                        <h1 className="font-bold text-xl">Project</h1>
                    </div>
                    <div className="mb-4 relative w-1/3 max-w-sm">
                        <input
                            type="text"
                            placeholder="Search code or host..."
                            className="w-full p-2 pr-10 border border-gray-300 rounded-md"
                        />
                        <IoSearch className="absolute right-3 top-2.5 text-gray-500 text-lg" />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg overflow-x-auto">
                    <table className="w-full table-auto text-left">
                        {/* title */}
                        <thead>
                            <tr className="bg-[#fcf4ea] text-gray-600 uppercase lg:text-sm text-xs">
                                <th className="lg:p-3 p-2 ">Project Code</th>
                                <th className="lg:p-3 p-2 ">Host</th>
                                <th className="lg:p-3 p-2 ">Envelopes Distributed</th>
                                <th className="lg:p-3 p-2 ">Status</th>
                                <th className="lg:p-3 p-2 ">Refund</th>
                                <th className="lg:p-3 p-2 ">IoT Machine</th>
                                <th className="lg:p-3 p-2 ">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {projects.map((proj, i) => (
                                <tr key={i} className="border-t lg:text-sm text-xs">
                                    {/* uid */}
                                    <td className="lg:p-3 p-2">
                                        <Link
                                            to={`/project/${proj?.projectCode}`}
                                            className="text-[#4a0f23] font-semibold hover:underline"
                                        >
                                            {proj?.projectCode ?? 0}
                                        </Link>
                                    </td>

                                    {/* host name */}
                                    <td className="lg:p-3 p-2 font-semibold whitespace-nowrap">
                                        {proj?.hostName ?? "Unknown"}
                                    </td>

                                    {/* envelope */}
                                    <td className="lg:p-3 p-2 w-56">
                                        <div className="relative bg-[#f3eadd] h-6 rounded-full">
                                            <div
                                                className="absolute left-0 top-0 h-full rounded-full bg-[#5e2120]"
                                                style={{
                                                    width: `${(proj?.guests.length / proj?.members) * 100
                                                        }%`,
                                                }}
                                            ></div>
                                            <div className="absolute right-2 top-1 text-xs font-semibold">
                                                {proj?.guests.length}/{proj?.members}
                                            </div>
                                        </div>
                                    </td>

                                    {/* status */}
                                    <td className="lg:p-3 p-2 font-medium">
                                        <div className="flex flex-col gap-2">
                                            <select
                                                value={proj?.status || ""}
                                                onChange={async (e) => {
                                                    const newStatus = e.target.value;

                                                    if (newStatus === "Others") {
                                                        // Only update UI state locally
                                                        setProjects((prev) =>
                                                            prev.map((p) =>
                                                                p.uid === proj.uid ? { ...p, status: newStatus, reason: "" } : p
                                                            )
                                                        );
                                                        return;
                                                    }

                                                    try {
                                                        const budgetRef = doc(
                                                            db,
                                                            "users",
                                                            proj?.uid,
                                                            "eventDetails",
                                                            "budget"
                                                        );

                                                        await updateDoc(budgetRef, { status: newStatus, reason: "" });

                                                        setProjects((prev) =>
                                                            prev.map((p) =>
                                                                p.uid === proj.uid ? { ...p, status: newStatus, reason: "" } : p
                                                            )
                                                        );

                                                        toast.success("Status updated successfully");
                                                    } catch (error) {
                                                        console.error("Error updating status:", error);
                                                        toast.error("Failed to update status");
                                                    }
                                                }}
                                                className="border rounded px-2 py-1 lg:text-sm text-xs focus:outline-none"
                                            >
                                                <option className="md:text-sm text-xs" value="">Select Status</option>
                                                <option className="md:text-sm text-xs" value="Running">Running</option>
                                                <option className="md:text-sm text-xs" value="Closed">Closed</option>
                                                <option className="md:text-sm text-xs" value="Suspended">Suspended</option>
                                                <option className="md:text-sm text-xs" value="Cancelled">Cancelled</option>
                                                <option className="md:text-sm text-xs" value="Postponed">Postponed</option>
                                                <option className="md:text-sm text-xs" value="Others">Others</option>
                                            </select>

                                            {/* Render input only for THIS row */}
                                            {proj?.status === "Others" && (
                                                <input
                                                    type="text"
                                                    value={proj?.reason || ""}
                                                    onChange={(e) => {
                                                        const reason = e.target.value;
                                                        setProjects((prev) =>
                                                            prev.map((p) =>
                                                                p.uid === proj.uid ? { ...p, reason } : p
                                                            )
                                                        );
                                                    }}
                                                    onBlur={async (e) => {
                                                        const reason = e.target.value;
                                                        if (reason.length < 10) {
                                                            toast.error("Reason must be at least 10 characters");
                                                            return;
                                                        }
                                                        try {
                                                            const budgetRef = doc(
                                                                db,
                                                                "users",
                                                                proj?.uid,
                                                                "eventDetails",
                                                                "budget"
                                                            );
                                                            await updateDoc(budgetRef, {
                                                                status: "Others",
                                                                reason,
                                                            });
                                                            toast.success("Reason saved successfully");
                                                        } catch (error) {
                                                            console.error("Error saving reason:", error);
                                                            toast.error("Failed to save reason");
                                                        }
                                                    }}
                                                    placeholder="Enter reason (min 10 chars)"
                                                    className="border rounded px-2 py-1 text-sm focus:outline-none"
                                                />
                                            )}
                                        </div>
                                    </td>

                                    <td className="lg:p-3 p-2 text-gray-700">{proj?.refund ?? 0}</td>

                                    {/* IOT machine */}
                                    <td className="lg:p-3 p-2">
                                        {iot === "Working" && (
                                            <span className="text-green-600 font-semibold">
                                                Working
                                            </span>
                                        )}
                                        {iot === "Not Working" && (
                                            <span className="text-red-500 font-semibold whitespace-nowrap">
                                                Not Working
                                            </span>
                                        )}
                                        {iot === "Agent SMS" && (
                                            <span className="bg-[#d5c286] text-black text-xs px-2 py-1 rounded-md font-medium whitespace-nowrap">
                                                Agent SMS
                                            </span>
                                        )}
                                    </td>

                                    {/* delete */}
                                    <td className="lg:p-3 p-2">
                                        <p onClick={() => {
                                            if (window.confirm("Are you sure you want to delete this project?")) {
                                                handleDeleteAndGoBack(proj?.uid)
                                            }
                                        }} className="text-red-500 cursor-pointer hover:underline">
                                            Delete
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TotalHost;
