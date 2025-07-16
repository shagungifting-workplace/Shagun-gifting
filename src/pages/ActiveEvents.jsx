import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { useLoadingStore } from "../store/useLoadingStore";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { fetchAllProjects } from "../utils/FetchProject";

const ActiveEvents = () => {
    const [projects, setProjects] = useState([]);
    const setLoading = useLoadingStore((state) => state.setLoading);

    useEffect(() => {
        const getProjectByCode = async () => {
            setLoading(true);
            try {
                const allProjects = await fetchAllProjects();
                setProjects(allProjects);
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
            "Project Code": proj.code,
            "Host": proj.host,
            "Envelopes Distributed": `${proj.distributed}/${proj.envelope}`,
            "Status": proj.status,
            "Refund": proj.refund,
            "IoT Machine": proj.iot,
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
    const status = 'Running';

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
                            {projects?.length}
                        </h2>
                        <p className="text-gray-600">Running Projects</p>
                    </div>
                    <div className="bg-[#f5f1e6] text-center p-4 rounded-lg">
                        <h2 className="text-3xl font-bold"> 0 </h2>
                        <p className="text-gray-600">Upcoming Projects</p>
                    </div>
                    <div className="bg-[#f5f1e6] text-center p-4 rounded-lg">
                        <h2 className="text-3xl font-bold">0</h2>
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
                            <tr className="bg-[#fcf4ea] text-gray-600 uppercase text-sm">
                                <th className="p-3">Project Code</th>
                                <th className="p-3">Host</th>
                                <th className="p-3">Envelopes Distributed</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Refund</th>
                                <th className="p-3">IoT Machine</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {projects.map((proj, i) => (
                                <tr key={i} className="border-t text-sm">
                                    {/* uid */}
                                    <td className="p-3">
                                        <Link
                                            to={`/project/${proj?.projectCode}`}
                                            className="text-[#4a0f23] font-semibold hover:underline"
                                        >
                                            {proj?.projectCode ?? 0}
                                        </Link>
                                    </td>

                                    {/* host name */}
                                    <td className="p-3 font-semibold whitespace-nowrap">
                                        {proj?.hostName ?? "Unknown"}
                                    </td>

                                    {/* envelope */}
                                    <td className="p-3 w-56">
                                        <div className="relative bg-[#f3eadd] h-4 rounded-full">
                                            <div
                                                className="absolute left-0 top-0 h-full rounded-full bg-[#5e2120]"
                                                style={{
                                                    width: `${
                                                        (proj?.guests.length / proj?.members) * 100
                                                    }%`,
                                                }}
                                            ></div>
                                            <div className="absolute right-1 top-0 text-xs font-semibold">
                                                {proj?.guests.length}/{proj?.members}
                                            </div>
                                        </div>
                                    </td>
                                    
                                    {/* status */}
                                    <td
                                        className={`p-3 font-medium ${
                                            status === "Running"
                                                ? "text-[#5e2120]"
                                                : "text-yellow-600"
                                        }`}
                                    >
                                        {status}
                                    </td>

                                    <td className="p-3 text-gray-700">{proj?.refund ?? 0}</td>

                                    {/* IOT machine */}
                                    <td className="p-3">
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ActiveEvents;
