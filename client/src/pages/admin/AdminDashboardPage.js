import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  TimeScale,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  TimeScale,
  ChartDataLabels
);

const StatCard = ({ title, value }) => (
  <div className="col-md-3 col-6 mb-4">
    <div className="card text-center h-100 border-0 shadow-lg bg-white rounded-4">
      <div className="card-body py-4">
        <h5 className="card-title text-uppercase text-secondary fw-semibold mb-2" style={{ letterSpacing: "1px" }}>
          {title}
        </h5>
        <p className="mb-0 display-4 fw-bold text-primary">{value}</p>
      </div>
    </div>
  </div>
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const api = require('../../api').default;
        const res = await api.get("/api/grievances/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Could not fetch dashboard stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="container py-4">
      <div className="mb-4 pb-2 border-bottom border-2 border-primary-subtle">
        <h1 className="fw-bold text-dark display-4 mb-1">Admin Dashboard</h1>
        <p className="fs-5 text-secondary mb-0">Welcome, {auth.user.fullname || auth.user.email}</p>
      </div>
      {stats ? (
        <>
          <div className="row g-3 mb-4">
            <StatCard title="Total Grievances" value={stats.totalGrievances} />
            <StatCard title="Submitted" value={stats.submitted} />
            <StatCard title="In Progress" value={stats.inProgress} />
            <StatCard title="Resolved" value={stats.resolved} />
          </div>

          <div className="row g-4">
            <div className="col-12 mb-4">
              <div className="card shadow-lg border-0 p-4 h-100 bg-light-subtle rounded-4">
                <h5 className="mb-4 text-success fw-bold text-uppercase">Grievances per Day (Last 14 Days)</h5>
                <Bar
                  data={{
                    labels: stats.grievancesPerDay ? stats.grievancesPerDay.map((d) => d.date) : [],
                    datasets: [
                      {
                        label: "Grievances",
                        data: stats.grievancesPerDay ? stats.grievancesPerDay.map((d) => d.count) : [],
                        backgroundColor: "rgba(40, 167, 69, 0.5)",
                        borderColor: "rgba(40, 167, 69, 1)",
                        borderWidth: 2,
                        borderRadius: 6,
                        maxBarThickness: 18,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                      title: { display: false },
                      datalabels: {
                        anchor: "end",
                        align: "end",
                        color: "#222",
                        font: { weight: "bold", size: 12 },
                        formatter: (value) => (value > 0 ? value : ""),
                        offset: 2,
                      },
                    },
                    scales: {
                      x: {
                        title: { display: false },
                        ticks: { color: "#666", font: { size: 11 } },
                        grid: { display: false },
                      },
                      y: {
                        beginAtZero: true,
                        title: { display: false },
                        ticks: { color: "#666", font: { size: 11 } },
                        grid: { color: "#eee" },
                        max:
                          Math.max(...(stats.grievancesPerDay ? stats.grievancesPerDay.map((d) => d.count) : [5]), 5) +
                          1,
                      },
                    },
                  }}
                  height={110}
                />
              </div>
            </div>
            <div className="col-md-7 mb-4">
              <div className="card shadow-lg border-0 p-4 h-100 bg-light-subtle rounded-4">
                <h5 className="mb-4 text-primary fw-bold text-uppercase">Grievances by Status</h5>
                <Bar
                  data={{
                    labels: ["Submitted", "In Progress", "Resolved"],
                    datasets: [
                      {
                        label: "Count",
                        data: [stats.submitted, stats.inProgress, stats.resolved],
                        backgroundColor: [
                          "rgba(54, 162, 235, 0.7)",
                          "rgba(255, 206, 86, 0.7)",
                          "rgba(75, 192, 192, 0.7)",
                        ],
                        borderRadius: 8,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                      title: { display: false },
                    },
                  }}
                  height={250}
                />
              </div>
            </div>
            <div className="col-md-5 mb-4">
              <div className="card shadow-lg border-0 p-4 h-100 bg-light-subtle rounded-4">
                <h5 className="mb-4 text-primary fw-bold text-uppercase">Grievances by Department</h5>
                <Doughnut
                  data={{
                    labels: stats.grievancesPerDepartment ? stats.grievancesPerDepartment.map((d) => d.department) : [],
                    datasets: [
                      {
                        data: stats.grievancesPerDepartment ? stats.grievancesPerDepartment.map((d) => d.count) : [],
                        backgroundColor: [
                          "#6a89cc",
                          "#38ada9",
                          "#e55039",
                          "#f6b93b",
                          "#b71540",
                          "#60a3bc",
                          "#78e08f",
                          "#fa983a",
                          "#e58e26",
                          "#079992",
                        ],
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "bottom" },
                    },
                  }}
                  height={250}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="alert alert-info mt-4">Loading stats...</div>
      )}
    </div>
  );
};
export default AdminDashboardPage;
