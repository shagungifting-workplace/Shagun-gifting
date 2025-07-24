import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function EventTypeChart({ eventTypeStats }) {
    
    const data = {
        labels: eventTypeStats.map((item) => item.type),
        datasets: [
            {
                label: "Event Count",
                data: eventTypeStats.map((item) => item.count),
                backgroundColor: "#f97316", // orange-500
                borderRadius: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Important for responsiveness
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function (ctx) {
                        const count = ctx.raw;
                        const total = eventTypeStats.reduce(
                            (acc, cur) => acc + cur.count,
                            0
                        );
                        const percent = ((count / total) * 100).toFixed(1);
                        return `${count} (${percent}%)`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <Bar data={data} options={options} />
        </div>
    );
}
