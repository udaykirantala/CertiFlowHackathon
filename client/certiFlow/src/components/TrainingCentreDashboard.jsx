
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGauge,
    faLayerGroup,
    faPlus,
    faCertificate,
    faUsers,
    faCheckCircle,
    faXmarkCircle,
    faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

import api from "../services/api";
import "../styles/dashboard.css";

function TrainingCentreDashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "null");

    const [statistics, setStatistics] = useState({
        totalBatches: 0,
        totalStudents: 0,
        passedStudents: 0,
        failedStudents: 0,
    });

    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/batches");

                const result = response.data.data;

                setBatches(result.batches || []);
                setStatistics(
                    result.statistics || {
                        totalBatches: 0,
                        totalStudents: 0,
                        passedStudents: 0,
                        failedStudents: 0,
                    }
                );
            } catch (error) {
                console.error("Error fetching batches:", error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load batch information."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchBatches();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="dashboard-container">

            <aside className="sidebar">
                <div className="sidebar-brand">
                    <h2>CertiFlow</h2>
                    <span>Skills Mission Portal</span>
                </div>

                <nav className="sidebar-menu">
                    <p className="menu-heading">MAIN MENU</p>

                    <div className="menu-item active">
                        <FontAwesomeIcon icon={faGauge} />
                        <span>Dashboard</span>
                    </div>

                    <div
                        className="menu-item"
                        onClick={() => navigate("/create-batch")}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Create Batch</span>
                    </div>

                    <div
                        className="menu-item"
                        onClick={() => navigate("/batches")}
                    >
                        <FontAwesomeIcon icon={faLayerGroup} />
                        <span>My Batches</span>
                    </div>

                    <div className="menu-item" onClick={()=>navigate("/certificates")}>
                        <FontAwesomeIcon icon={faCertificate} />
                        <span>Certificates</span>
                    </div>
                </nav>

                <div className="sidebar-bottom">
                    <div className="menu-item" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        <span>Logout</span>
                    </div>
                </div>
            </aside>

            <main className="dashboard-content">

                <header className="dashboard-topbar">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Training Centre Management Portal</p>
                    </div>

                    <div className="user-info">
                        <div className="user-avatar">
                            {user?.name?.charAt(0).toUpperCase() || "T"}
                        </div>

                        <div>
                            <strong>{user?.name || "Training Centre"}</strong>
                            <span>Training Centre</span>
                        </div>
                    </div>
                </header>

                <section className="welcome-section">
                    <div>
                        <h2>Welcome, {user?.name || "Training Centre"}!</h2>
                        <p>
                            Manage your training batches, student results and certificates
                            from one place.
                        </p>
                    </div>

                    <button
                        className="primary-button"
                        onClick={() => navigate("/create-batch")}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        Create New Batch
                    </button>
                </section>

                {loading && (
                    <p className="loading-message">Loading dashboard data...</p>
                )}

                {error && (
                    <p className="error-message">{error}</p>
                )}

                <section className="stats-grid">

                    <div className="stat-card">
                        <div className="stat-icon blue">
                            <FontAwesomeIcon icon={faLayerGroup} />
                        </div>
                        <div>
                            <p>Total Batches</p>
                            <h2>{statistics.totalBatches}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon purple">
                            <FontAwesomeIcon icon={faUsers} />
                        </div>
                        <div>
                            <p>Total Students</p>
                            <h2>{statistics.totalStudents}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon green">
                            <FontAwesomeIcon icon={faCheckCircle} />
                        </div>
                        <div>
                            <p>Passed Students</p>
                            <h2>{statistics.passedStudents}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon red">
                            <FontAwesomeIcon icon={faXmarkCircle} />
                        </div>
                        <div>
                            <p>Failed Students</p>
                            <h2>{statistics.failedStudents}</h2>
                        </div>
                    </div>

                </section>

                {/* Recent Batches */}
                <section className="recent-batches">
                    <div className="section-header">
                        <div>
                            <h2>Recent Batches</h2>
                            <p>Overview of your recently created batches</p>
                        </div>

                        <button
                            className="secondary-button"
                            onClick={() => navigate("/batches")}
                        >
                            View All
                        </button>
                    </div>

                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Batch Name</th>
                                    <th>Total Students</th>
                                    <th>Passed</th>
                                    <th>Failed</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {!loading && batches.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="empty-table">
                                            No batches created yet.
                                        </td>
                                    </tr>
                                ) : (
                                    batches.slice(0, 5).map((batch) => (
                                        <tr key={batch._id}>
                                            <td><button
                                                className="view-batch-button"
                                                onClick={() => navigate(`/batches/${batch._id}`)}
                                            >
                                                {batch.batchName}
                                            </button></td>
                                            <td>{batch.totalStudents}</td>
                                            <td>{batch.passedStudents}</td>
                                            <td>{batch.failedStudents}</td>
                                            <td>
                                                <span className={`status-badge ${batch.status?.toLowerCase().replaceAll("_", "-")}`}>
                                                    {batch.status?.replaceAll("_", " ")}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

            </main>
        </div>
    );
}

export default TrainingCentreDashboard;
