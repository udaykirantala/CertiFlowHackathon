
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCertificate,
  faEye,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

import api from "../services/api";
import "../styles/dashboard.css";
import "../styles/certificates.css";

function Certificates() {
  const navigate = useNavigate();

  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await api.get("/batches");
        const allBatches = response.data.data.batches || [];

        const issuedBatches = allBatches.filter(
          (batch) => batch.status === "CERTIFICATES_ISSUED"
        );

        setBatches(issuedBatches);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load certificate information."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const filteredBatches = batches.filter((batch) =>
    batch.batchName?.toLowerCase().includes(search.toLowerCase())
  );

  const totalCertificates = batches.reduce(
    (total, batch) => total + (batch.passedStudents || 0),
    0
  );

  return (
    <div className="certificates-page">
      <Link to="/training-centre" className="back-link">
        <FontAwesomeIcon icon={faArrowLeft} />
        Back to Dashboard
      </Link>

      <div className="certificates-heading">
        <div>
          <h1>Certificates</h1>
          <p>View batches for which certificates have been issued.</p>
        </div>
      </div>

      <div className="certificate-summary">
        <div className="certificate-summary-icon">
          <FontAwesomeIcon icon={faCertificate} />
        </div>
        <div>
          <span>Certificates issued (estimated from passed students)</span>
          <strong>{totalCertificates}</strong>
        </div>
      </div>

      <div className="certificate-search">
        <FontAwesomeIcon icon={faSearch} />
        <input
          type="text"
          placeholder="Search by batch name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="page-message">Loading certificates...</p>
      ) : error ? (
        <p className="page-error">{error}</p>
      ) : filteredBatches.length === 0 ? (
        <div className="empty-certificates">
          <FontAwesomeIcon icon={faCertificate} />
          <h3>No issued certificates yet</h3>
          <p>
            Certificates will appear here after a batch completes the approval
            process and its certificates are issued.
          </p>
        </div>
      ) : (
        <div className="certificate-table">
          <table>
            <thead>
              <tr>
                <th>Batch Name</th>
                <th>Total Students</th>
                <th>Passed Students</th>
                <th>Certificates</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredBatches.map((batch) => (
                <tr key={batch._id}>
                  <td>{batch.batchName}</td>
                  <td>{batch.totalStudents || 0}</td>
                  <td>{batch.passedStudents || 0}</td>
                  <td>
                    <span className="issued-label">Issued</span>
                  </td>
                  <td>
                    <button
                      className="view-certificate-button"
                      onClick={() => navigate(`/batches/${batch._id}`)}
                    >
                      <FontAwesomeIcon icon={faEye} /> View Batch
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

export default Certificates;
