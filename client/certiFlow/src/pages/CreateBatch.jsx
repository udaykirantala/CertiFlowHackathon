
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faLayerGroup,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import api from "../services/api";
import "../styles/dashboard.css";
import "../styles/createBatch.css";

function CreateBatch() {
  const navigate = useNavigate();

  const [batchName, setBatchName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/batches", {
        batchName: batchName.trim(),
      });

      const batch = response.data.data.batch || response.data.data;

      alert("Batch created successfully!");

      navigate(`/batches/${batch._id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to create batch. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-batch-page">

      <div className="create-batch-header">
        <div>
          <Link to="/training-centre" className="back-link">
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Dashboard
          </Link>

          <h1>Create New Batch</h1>
          <p>Create a training batch and upload student information.</p>
        </div>
      </div>

      <div className="create-batch-card">

        <div className="create-batch-title">
          <div className="create-batch-icon">
            <FontAwesomeIcon icon={faLayerGroup} />
          </div>

          <div>
            <h2>Batch Information</h2>
            <p>Enter the basic details to create your batch.</p>
          </div>
        </div>

        {error && (
          <div className="create-batch-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="batchName">Batch Name</label>

            <input
              id="batchName"
              type="text"
              placeholder="Example: Java Full Stack - Batch 01"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              required
              minLength={2}
              maxLength={100}
            />

            <small>
              Enter a descriptive name to identify your training batch.
            </small>
          </div>

          <div className="create-batch-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/training-centre")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading || !batchName.trim()}
            >
              <FontAwesomeIcon icon={faPlus} />
              {loading ? "Creating..." : "Create Batch"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateBatch;
