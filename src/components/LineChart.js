import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

// Register required Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Legend,
    Filler,
    Legend
);

const LineChart = ({ chartData = { labels: [], datasets: [] }, title }) => {
    const colorSet = ["blue", "red", "green", "orange", "purple", "yellow", "pink", "cyan", "magenta", "brown"];
    const formattedChartData = {
        labels: chartData.labels,
        datasets: chartData.datasets.map((dataset, index) => ({
            ...dataset,
            borderColor: colorSet[index % colorSet.length], // Assign color from colorSet
            borderWidth: 3, // Increase the line size
            fill: false, // Fill area under the line
        })),
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    color: 'white', // Set legend text color to white
                },
            },
            tooltip: {
                enabled: true, // Enable tooltips
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y;
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time',
                    color: 'white', // Set x-axis title color to white
                },
                grid: {
                    display: false, // Remove grid lines on x-axis
                },
                ticks: {
                    color: 'white', // Set x-axis ticks color to white
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Count',
                    color: 'white', // Set y-axis title color to white
                },
                grid: {
                    display: false, // Remove grid lines on y-axis
                },
                ticks: {
                    color: 'white', // Set y-axis ticks color to white
                },
            },
        },
        elements: {
            line: {
                tension: 0.4, // This makes the lines curved
                borderWidth: 3, // Increase the line size
            },
            point: {
                radius: 0, // This removes the data points
            },
        },
    };

    const hasData = chartData.datasets.some(dataset => dataset.data && dataset.data.length > 0);

    return (
        <Box>
            {hasData ? (
                <Line data={formattedChartData} options={options} height={"250rem"} />
            ) : (
                <Text color="white">No Data to Display</Text>
            )}
        </Box>
    );
};

export default LineChart;
