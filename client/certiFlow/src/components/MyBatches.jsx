
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEye,
  faSearch,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";

import api from "../services/api";
import "../styles/dashboard.css";
import "../styles/myBatches.css";

function MyBatches() {
  const navigate = useNavigate();

  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await api.get("/batches");
        const data = response.data.data;

        setBatches(data.batches || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load your batches."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  const filteredBatches = batches.filter((batch) => {
    const matchesSearch = batch.batchName
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || batch.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatStatus = (status) =>
    status?.replaceAll("_", " ") || "UNKNOWN";

  return (
    <div className="my-batches-page">
      <Link to="/training-centre" className="back-link">
        <FontAwesomeIcon icon={faArrowLeft} />
        Back to Dashboard
      </Link>

      <div className="my-batches-heading">
        <div>
          <h1>My Batches</h1>
          <p>View and manage all your training batches.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => navigate("/create-batch")}
        >
          <FontAwesomeIcon icon={faLayerGroup} />
          Create New Batch
        </button>
      </div>

      <div className="batch-filters">
        <div className="batch-search">
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            placeholder="Search batch name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="DISTRICT_REVIEW">District Review</option>
          <option value="RETURNED_FOR_CORRECTION">Returned for Correction</option>
          <option value="DISTRICT_REJECTED">District Rejected</option>
          <option value="STATE_REVIEW">State Review</option>
          <option value="STATE_REJECTED">State Rejected</option>
          <option value="APPROVED">Approved</option>
          <option value="CERTIFICATES_ISSUED">Certificates Issued</option>
        </select>
      </div>

      {loading ? (
        <p className="page-message">Loading batches...</p>
      ) : error ? (
        <p className="page-error">{error}</p>
      ) : filteredBatches.length === 0 ? (
        <div className="empty-batches">
          <h3>No batches found</h3>
          <p>Try changing your search or create a new batch.</p>
        </div>
      ) : (
        <div className="my-batches-table">
          <table>
            <thead>
              <tr>
                <th>Batch Name</th>
                <th>Total Students</th>
                <th>Passed</th>
                <th>Failed</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredBatches.map((batch) => (
                <tr key={batch._id}>
                  <td>{batch.batchName}</td>
                  <td>{batch.totalStudents || 0}</td>
                  <td>{batch.passedStudents || 0}</td>
                  <td>{batch.failedStudents || 0}</td>
                  <td>
                    <span
                      className={`status-badge ${batch.status?.toLowerCase().replaceAll("_", "-")}`}
                    >
                      {formatStatus(batch.status)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="view-batch-button"
                      onClick={() => navigate(`/batches/${batch._id}`)}
                    >
                      <FontAwesomeIcon icon={faEye} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyBatches;
