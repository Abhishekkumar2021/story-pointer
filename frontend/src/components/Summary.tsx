import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

interface User {
  username: string;
  points: number;
  showPoints: boolean;
}

interface SummaryProps {
  users: User[];
}

const Summary: React.FC<SummaryProps> = ({ users }) => {
  const visibleUsers = users.filter(user => user.showPoints);

  const pointFrequencies: { [key: number]: number } = {};
  visibleUsers.forEach(user => {
    pointFrequencies[user.points] = (pointFrequencies[user.points] || 0) + 1;
  });

  const totalPoints = visibleUsers.reduce((sum, user) => sum + user.points, 0);

  const pieChartData = {
    labels: Object.keys(pointFrequencies),
    datasets: [
      {
        label: "Points Distribution",
        data: Object.values(pointFrequencies),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
      },
    ],
  };

  const barChartData = {
    labels: visibleUsers.map(user => user.username),
    datasets: [
      {
        label: "Points",
        data: visibleUsers.map(user => user.points),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const barChartOptions: ChartOptions<"bar"> = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const percentage = totalPoints ? ((value / totalPoints) * 100).toFixed(2) : "0";
            return `${context.dataset.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const pieChartOptions: ChartOptions<"pie"> = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const total = context.dataset.data.reduce((sum, val) => sum + (val as number), 0);
            const percentage = total ? ((value / total) * 100).toFixed(2) : "0";
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <section className="summary p-6">
      <h2 className="text-2xl font-bold mb-8 text-center">Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-4 bg-white shadow-lg rounded-xl">
          <h3 className="text-lg font-medium mb-4 text-center">Points by User</h3>
          <Bar data={barChartData} options={barChartOptions} />
        </div>

        <div className="p-4 bg-white shadow-lg rounded-xl">
          <h3 className="text-lg font-medium mb-4 text-center">Points Distribution</h3>
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>
    </section>
  );
};

export default Summary;