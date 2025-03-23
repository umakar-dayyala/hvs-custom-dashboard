import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AnomalyChartDemo = () => {
    const data = {
        labels: [
            "2025/03/07 01:35:07.283", "2025/03/07 01:35:08.297", "2025/03/07 01:48:25.300", "2025/03/07 01:48:39.297", "2025/03/07 01:49:25.297",
            "2025/03/07 01:49:26.453", "2025/03/07 01:52:07.577", "2025/03/07 01:54:44.293", "2025/03/07 02:00:06.290", "2025/03/07 02:02:27.293",
            "2025/03/07 02:22:16.287", "2025/03/07 02:32:04.303", "2025/03/07 02:32:45.327", "2025/03/07 02:32:57.287", "2025/03/07 02:33:25.290",
            "2025/03/07 02:38:17.287", "2025/03/07 02:49:06.287", "2025/03/07 02:56:01.283", "2025/03/07 03:08:17.317", "2025/03/07 03:20:18.297",
            "2025/03/07 03:26:22.307", "2025/03/07 03:28:51.290", "2025/03/07 03:29:04.293", "2025/03/07 03:29:05.297", "2025/03/07 03:31:38.293",
            "2025/03/07 03:31:39.293", "2025/03/07 03:35:12.293", "2025/03/07 03:35:13.293", "2025/03/07 03:43:15.293", "2025/03/07 03:54:31.290",
            "2025/03/07 03:59:09.290", "2025/03/07 04:17:27.303", "2025/03/07 04:19:32.283", "2025/03/07 04:21:42.283", "2025/03/07 04:46:18.300",
            "2025/03/07 04:48:57.300", "2025/03/07 04:52:52.293"
        ],
        datasets: [
            {
                label: "DET 1 Count",
                data: [
                    1170, 1170, 1186, 1183, 1187, 1187, 1169, 1185, 1186, 1169,
                    1179, 1181, 1165, 1171, 1180, 1183, 1185, 1188, 1188, 1183,
                    1158, 1168, 1147, 1147, 1189, 1189, 1181, 1181, 1168, 1188,
                    1188, 1169, 1188, 1182, 1187, 1176, 1180
                ],
                borderColor: "blue",
                backgroundColor: "transparent",
                pointBackgroundColor: "blue",
                pointRadius: (ctx) => ctx.dataset.data.map((val, i) => val === 0 ? 5 : 3),
                pointBorderColor: (ctx) => ctx.dataset.data.map((val, i) => val === 0 ? "red" : "blue"),
            },
            {
                label: "DET 2 Count",
                data: [
                    1575, 1575, 1549, 1476, 1530, 1530, 1561, 1471, 1467, 1513,
                    1517, 1544, 1434, 1536, 1546, 1477, 1546, 1469, 1509, 1524,
                    1505, 1523, 1525, 1525, 1487, 1487, 1475, 1475, 1580, 1435,
                    1448, 1571, 1521, 1546, 1446, 1487, 1519
                ],
                borderColor: "green",
                backgroundColor: "transparent",
                pointBackgroundColor: "green",
                pointRadius: (ctx) => ctx.dataset.data.map((val, i) => val === 0 ? 5 : 3),
                pointBorderColor: (ctx) => ctx.dataset.data.map((val, i) => val === 0 ? "red" : "green"),
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        scales: {
            x: {
                display: true
            },
            y: {
                display: true
            }
        }
    };

    return <Line data={data} options={options} />;
};

export default AnomalyChartDemo;