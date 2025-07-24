import { useEffect, useState } from "react";
import { fetchAllProjects } from "../../utils/FetchProject";
import { useLoadingStore } from "../../store/useLoadingStore";
import EventTypeChart from "./EventTypeChart";

const Analytics = () => {

    const setLoading = useLoadingStore((state) => state.setLoading);
    const [eventType, setEventType] = useState([]);

    useEffect(() => {
        const getProjectByCode = async () => {
            setLoading(true);
            try {
                const allProjects = await fetchAllProjects();

                const extractEventTypes = () => {
                    const allTypes = allProjects
                        .map(project => project?.eventType)
                        .filter(type => !!type); // remove null/undefined

                    const total = allTypes.length;

                    const typeCount = {};
                    allTypes.forEach(type => {
                        typeCount[type] = (typeCount[type] || 0) + 1;
                    });

                    const stats = Object.entries(typeCount).map(([type, count]) => ({
                        type,
                        count,
                        percentage: ((count / total) * 100).toFixed(1)
                    }));

                    setEventType(stats);
                };

                extractEventTypes();
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        getProjectByCode();
    }, [setLoading]);

    // const [eventTypeStats, setEventTypeStats] = useState([
    //     { type: "Marriage", count: 60, percentage: 60 },
    //     { type: "Birthday", count: 20, percentage: 20 },
    //     { type: "Reception", count: 10, percentage: 10 },
    //     { type: "Corporate", count: 7, percentage: 7 },
    //     { type: "Others", count: 3, percentage: 3 },
    // ]);

    return (
        <div className="space-y-6 mt-6">
            {/* Top Section: Revenue + Event Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Revenue Trends */}
                <div className="bg-white p-6 rounded-xl shadow-sm h-[300px] flex flex-col">
                    <h2 className="text-xl font-medium mb-4">Revenue Trends</h2>
                    <div className="bg-gray-100 flex-1 rounded-lg">
                        <EventTypeChart eventTypeStats={eventType} />
                    </div>
                </div>

                {/* Event Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-sm h-[300px] flex flex-col">
                    <h2 className="text-xl font-medium mb-4">
                        Event Types Distribution
                    </h2>

                    <div className="flex-1 overflow-y-auto">
                        <ul className="space-y-2 text-gray-700 text-sm">
                            {eventType.map(({ type, percentage }) => (
                                <li key={type} className="flex justify-between">
                                    <span className="capitalize">{type}</span>
                                    <span>{percentage}%</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>

            {/* Bottom Section: Performance Metrics */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold mb-4">Performance Metrics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 text-center p-4 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">
                            98.5%
                        </p>
                        <p className="text-gray-600">Machine Uptime</p>
                    </div>
                    <div className="bg-green-50 text-center p-4 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">4.8</p>
                        <p className="text-gray-600">Avg Rating</p>
                    </div>
                    <div className="bg-orange-50 text-center p-4 rounded-lg">
                        <p className="text-2xl font-bold text-orange-600">
                            2.3s
                        </p>
                        <p className="text-gray-600">Avg Response Time</p>
                    </div>
                    <div className="bg-purple-50 text-center p-4 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">
                            95%
                        </p>
                        <p className="text-gray-600">Customer Satisfaction</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
