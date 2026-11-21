
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faFileExcel,
  faUpload,
  faPaperPlane,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

import api from "../services/api";
import "../styles/dashboard.css";
import "../styles/batchDetails.css";

function BatchDetails() {
  const { batchId } = useParams();

  const [batch, setBatch] = useState(null);
  const [students, setStudents] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchBatchDetails = async () => {
    try {
      setError("");

      const response = await api.get(`/batches/${batchId}`);
      const data = response.data.data;

      setBatch(data.batch || data);
      setStudents(data.students || data.batch?.students || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load batch details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatchDetails();
  }, [batchId]);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select an Excel or CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setError("");
      setMessage("");

      await api.post(`/batches/${batchId}/upload`, formData);

      setMessage("Student file uploaded successfully.");
      setFile(null);

      // Refresh batch counts and student information.
      await fetchBatchDetails();
    } catch (err) {
      setError(
        err.response?.data?.message || "File upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitBatch = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to submit this batch for district approval?"
    );

    if (!confirmed) return;

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      await api.post(`/batches/${batchId}/submit`);

      setMessage("Batch submitted successfully.");
      await fetchBatchDetails();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to submit this batch."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="batch-details-page">Loading batch details...</div>;
  }

  if (!batch) {
    return (
      <div className="batch-details-page">
        <p>{error || "Batch not found."}</p>
        <Link to="/training-centre">Back to Dashboard</Link>
      </div>
    );
  }

  const isDraft = batch.status === "DRAFT";
  const hasStudents = Number(batch.totalStudents) > 0;

  return (
    <div className="batch-details-page">
      <Link to="/training-centre" className="back-link">
        <FontAwesomeIcon icon={faArrowLeft} />
        Back to Dashboard
      </Link>

      <div className="batch-details-heading">
        <div>
          <h1>{batch.batchName}</h1>
          <p>Batch information and student records</p>
        </div>

        <span className={`status-badge ${batch.status?.toLowerCase()}`}>
          {batch.status?.replaceAll("_", " ")}
        </span>
      </div>

      {error && <div className="batch-alert error-alert">{error}</div>}
      {message && <div className="batch-alert success-alert">{message}</div>}

      <div className="batch-stats">
        <div className="batch-stat-card">
          <span>Total Students</span>
          <strong>{batch.totalStudents || 0}</strong>
        </div>
        <div className="batch-stat-card">
          <span>Passed</span>
          <strong>{batch.passedStudents || 0}</strong>
        </div>
        <div className="batch-stat-card">
          <span>Failed</span>
          <strong>{batch.failedStudents || 0}</strong>
        </div>
      </div>

      {isDraft && (
        <div className="upload-section">
          <div className="section-heading">
            <FontAwesomeIcon icon={faFileExcel} />
            <div>
              <h2>Upload Student Records</h2>
              <p>Select an Excel or CSV file containing student information.</p>
            </div>
          </div>

          <form onSubmit={handleUpload}>
            <input
              type="file"
              accept=".csv,.xls,.xlsx"
              onChange={(e) => setFile(e.target.files[0] || null)}
            />

            {file && <p className="selected-file">{file.name}</p>}

            <button
              type="submit"
              className="primary-button"
              disabled={!file || uploading}
            >
              <FontAwesomeIcon icon={faUpload} />
              {uploading ? "Uploading..." : "Upload File"}
            </button>
          </form>
        </div>
      )}

      <div className="students-section">
        <div className="students-heading">
          <h2>
            <FontAwesomeIcon icon={faUsers} /> Student Records
          </h2>
          <span>{students.length} records shown</span>
        </div>

        {students.length > 0 ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id || student.studentCode}>
                    <td>{student.studentCode}</td>
                    <td>{student.name}</td>
                    <td>{student.courseName}</td>
                    <td>
                      <span className={`result-badge ${student.result?.toLowerCase()}`}>
                        {student.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-students">
            No student records are available to display.
            {hasStudents && (
              <p>
                The batch has {batch.totalStudents} students, but the details
                API may not be returning the student list yet.
              </p>
            )}
          </div>
        )}
      </div>

      {isDraft && (
        <div className="submit-batch-section">
          <div>
            <h2>Ready to submit?</h2>
            <p>
              Check your student records before submitting this batch for
              district approval.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={handleSubmitBatch}
            disabled={!hasStudents || uploading || submitting}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
            {submitting ? "Submitting..." : "Submit for Approval"}
          </button>
        </div>
      )}
    </div>
  );
}

export default BatchDetails;
