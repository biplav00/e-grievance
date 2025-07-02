import React, { useState, useMemo, useEffect, useContext } from "react";
import { FixedSizeList as List } from "react-window";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const GrievanceList = ({ grievances, title, onStatusChange, onViewDetail }) => {
  const { auth } = useContext(AuthContext);
  // State declarations at top level
  const [departments, setDepartments] = useState([]);
  const [deptsError, setDeptsError] = useState("");

  // Pagination state at top level
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(grievances.length / pageSize);
  const paginatedGrievances = useMemo(() => {
    const start = (page - 1) * pageSize;
    return grievances.slice(start, start + pageSize);
  }, [grievances, page]);

  // Virtualization decision at top level
  const useVirtualization = grievances.length > 100;

  // Fetch departments when component mounts
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get("/api/department", {
          headers: { "x-auth-token": auth.token }
        });
        setDepartments(res.data);
        setDeptsError("");
      } catch (err) {
        setDeptsError("Failed to load departments");
      }
    };

    if (auth.isAuthenticated) {
      fetchDepartments();
    }
  }, [auth]);

  if (deptsError) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">{deptsError}</div>
      </div>
    );
  }
  // Helper to get department name by ID or name
  const getDeptName = (deptRef) => {
    if (!deptRef) return "N/A";
    // If deptRef is a string (ID or name), try to find matching department
    if (typeof deptRef === "string") {
      const dept = departments.find((d) => d && (d._id === deptRef || d.name === deptRef));
      return dept ? dept.name : deptRef;
    }
    // If deptRef is an object, return its name property
    if (typeof deptRef === "object") {
      return deptRef.name || "N/A";
    }
    return "N/A";
  };


  const Row = ({ index, style }) => {
    const g = paginatedGrievances[index];
    if (!g) return null;
    return (
      <tr key={g._id} style={style}>
        <td>{g.trackingId}</td>
        <td>{g.category?.name || g.category || "N/A"}</td>
        <td>{g.department ? getDeptName(g.department) : "N/A"}</td>
        <td>{new Date(g.createdAt).toLocaleDateString()}</td>
        <td>
          <span className={
            g.status === 'Resolved' ? 'badge bg-success' :
            g.status === 'In Progress' ? 'badge bg-warning text-dark' :
            'badge bg-secondary'
          }>
            {g.status}
          </span>
        </td>
        <td className="text-center">
          <button className="btn btn-outline-primary btn-sm" onClick={() => onViewDetail && onViewDetail(g._id)}>
            View
          </button>
        </td>
      </tr>
    );
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <div>
      <h2 className="mb-3">{title}</h2>
      {grievances.length === 0 ? (
        <div className="alert alert-info">No grievances found.</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Tracking ID</th>
                  <th>Category</th>
                  <th>Dept</th>
                  <th>Submitted On</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {useVirtualization ? (
                  <List height={400} itemCount={paginatedGrievances.length} itemSize={50} width={"100%"}>
                    {Row}
                  </List>
                ) : (
                  paginatedGrievances.map((g) => (
                    <tr key={g._id}>
                      <td>{g.trackingId}</td>
                      <td>{g.category?.name || g.category || "N/A"}</td>
                      <td>{g.department ? getDeptName(g.department) : "N/A"}</td>
                      <td>{new Date(g.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={
                          g.status === 'Resolved' ? 'badge bg-success' :
                          g.status === 'In Progress' ? 'badge bg-warning text-dark' :
                          'badge bg-secondary'
                        }>
                          {g.status}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => onViewDetail && onViewDetail(g._id)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <nav className="d-flex justify-content-center mt-3">
              <ul className="pagination">
                <li className={`page-item${page === 1 ? " disabled" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(page - 1)}>
                    &laquo;
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i + 1} className={`page-item${page === i + 1 ? " active" : ""}`}>
                    <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item${page === totalPages ? " disabled" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(page + 1)}>
                    &raquo;
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default GrievanceList;
