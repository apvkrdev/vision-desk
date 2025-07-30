"use client";

import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Employee");
  const [contractType, setContractType] = useState("Water Supply");
  const [employees, setEmployees] = useState([]);
  const [contracts, setContracts] = useState([]); // Placeholder for contract data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // Contract registration modal state
  const [showContractForm, setShowContractForm] = useState(false);
  const [contractForm, setContractForm] = useState({ vendor: "", startDate: "", endDate: "" });
  const [formError, setFormError] = useState("");

  // Fetch employees on mount
  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch("/api/employee");
        const data = await res.json();
        if (data.success) {
          setEmployees(data.employees);
        } else {
          setError("Failed to fetch employees");
        }
      } catch (err) {
        setError("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  // Fetch contracts when contractType or Contractors tab is active
  useEffect(() => {
    if (activeTab !== "Contractors") return;
    async function fetchContracts() {
      try {
        const res = await fetch(`/api/contract?type=${encodeURIComponent(contractType)}`);
        const data = await res.json();
        if (data.success) {
          setContracts(data.contracts);
        }
      } catch (err) {
        // Optionally handle error
      }
    }
    fetchContracts();
  }, [activeTab, contractType]);

  // Separate handler for contract form submit
  async function handleContractFormSubmit(e) {
    e.preventDefault();
    if (!contractForm.vendor || !contractForm.startDate || !contractForm.endDate) {
      setFormError("All fields are required.");
      return;
    }
    // POST to API
    try {
      const res = await fetch("/api/contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: contractType,
          vendor: contractForm.vendor,
          startDate: contractForm.startDate,
          endDate: contractForm.endDate
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowContractForm(false);
        setFormError("");
        // Refetch contracts for this type
        const refetch = await fetch(`/api/contract?type=${encodeURIComponent(contractType)}`);
        const refetchData = await refetch.json();
        if (refetchData.success) setContracts(refetchData.contracts);
      } else {
        setFormError(data.error || "Failed to add contract.");
      }
    } catch (err) {
      setFormError("Failed to add contract.");
    }
  }

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.dashboardTitle}>Welcome to the Dashboard</h2>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <button
          onClick={() => { setActiveTab("Employee"); setSelectedEmployee(null); setSelectedContract(null); }}
          style={{
            padding: "8px 24px",
            borderRadius: 4,
            border: activeTab === "Employee" ? "2px solid #0070f3" : "1px solid #ccc",
            background: activeTab === "Employee" ? "#e6f0fa" : "#fff",
            fontWeight: activeTab === "Employee" ? 700 : 400,
            cursor: "pointer"
          }}
        >
          Employee
        </button>
        <button
          onClick={() => { setActiveTab("Contractors"); setSelectedEmployee(null); setSelectedContract(null); }}
          style={{
            padding: "8px 24px",
            borderRadius: 4,
            border: activeTab === "Contractors" ? "2px solid #0070f3" : "1px solid #ccc",
            background: activeTab === "Contractors" ? "#e6f0fa" : "#fff",
            fontWeight: activeTab === "Contractors" ? 700 : 400,
            cursor: "pointer"
          }}
        >
          Contractors
        </button>
      </div>
      <div className={styles.dashboardFlex}>
        <div className={styles.card} style={{ flex: 2 }}>
          {activeTab === "Employee" && (
            <>
              <h3>Employee Details</h3>
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className={styles.error}>{error}</p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Name</th>
                      <th className={styles.th}>Employee ID</th>
                      <th className={styles.th}>Department</th>
                      <th className={styles.th}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => (
                      <tr key={emp._id}>
                        <td className={styles.td}>{emp.name}</td>
                        <td className={styles.td}>{emp._id}</td>
                        <td className={styles.td}>{emp.department}</td>
                        <td className={styles.td}>
                          <button
                            className={styles.link}
                            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                            onClick={() => {
                              setSelectedEmployee(emp);
                              setShowModal(true);
                            }}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
          {activeTab === "Contractors" && (
            <>
              <div style={{ marginBottom: 16 }}>
                <label htmlFor="contractType" style={{ fontWeight: 600, marginRight: 8 }}>Contract Type:</label>
                <select
                  id="contractType"
                  value={contractType}
                  onChange={e => setContractType(e.target.value)}
                  style={{ padding: 6, borderRadius: 4 }}
                >
                  <option value="Water Supply">Water Supply</option>
                  <option value="Chemical Supply">Chemical Supply</option>
                </select>
              </div>
              <h3>{contractType} Contracts</h3>
              <button
                style={{ marginBottom: 12, padding: "4px 12px" }}
                onClick={() => {
                  setShowContractForm(true);
                  setContractForm({ vendor: "", startDate: "", endDate: "" });
                  setFormError("");
                }}
              >
                {`Add ${contractType} Contract`}
              </button>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Vendor</th>
                    <th className={styles.th}>Start Date</th>
                    <th className={styles.th}>End Date</th>
                    <th className={styles.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.filter(c => c.type === contractType).map(contract => (
                    <tr key={contract._id}>
                      <td className={styles.td}>{contract.vendor}</td>
                      <td className={styles.td}>{contract.startDate}</td>
                      <td className={styles.td}>{contract.endDate}</td>
                      <td className={styles.td}>
                        <button
                          className={styles.link}
                          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                          onClick={() => {
                            setSelectedContract(contract);
                            setShowModal(true);
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
      {/* Modal for Employee or Contract Details */}
      {showContractForm && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}
          onClick={() => setShowContractForm(false)}
        >
          <div
            style={{ background: "#fff", borderRadius: 8, padding: 32, minWidth: 350, minHeight: 300, position: "relative" }}
            onClick={e => e.stopPropagation()}
          >
            <button
              style={{ position: "absolute", top: 8, right: 12, fontSize: 20, background: "none", border: "none", cursor: "pointer" }}
              onClick={() => setShowContractForm(false)}
            >
              ×
            </button>
            <h2>Add {contractType} Contract</h2>
            <form onSubmit={handleContractFormSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontWeight: 600 }}>Vendor</label>
                <input
                  type="text"
                  value={contractForm.vendor}
                  onChange={e => setContractForm(f => ({ ...f, vendor: e.target.value }))}
                  style={{ width: "100%", padding: 6, borderRadius: 4, border: "1px solid #ccc" }}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontWeight: 600 }}>Start Date</label>
                <input
                  type="date"
                  value={contractForm.startDate}
                  onChange={e => setContractForm(f => ({ ...f, startDate: e.target.value }))}
                  style={{ width: "100%", padding: 6, borderRadius: 4, border: "1px solid #ccc" }}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontWeight: 600 }}>End Date</label>
                <input
                  type="date"
                  value={contractForm.endDate}
                  onChange={e => setContractForm(f => ({ ...f, endDate: e.target.value }))}
                  style={{ width: "100%", padding: 6, borderRadius: 4, border: "1px solid #ccc" }}
                />
              </div>
              {formError && <p style={{ color: "red", marginBottom: 8 }}>{formError}</p>}
              <button type="submit" style={{ padding: "6px 18px", borderRadius: 4, background: "#0070f3", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }}>Add Contract</button>
            </form>
          </div>
        </div>
      )}
      {showModal && (selectedEmployee || selectedContract) && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}
          onClick={() => {
            setShowModal(false);
            setSelectedEmployee(null);
            setSelectedContract(null);
          }}
        >
          <div
            style={{ background: "#fff", borderRadius: 8, padding: 32, minWidth: 350, minHeight: 300, position: "relative" }}
            onClick={e => e.stopPropagation()}
          >
            <button
              style={{ position: "absolute", top: 8, right: 12, fontSize: 20, background: "none", border: "none", cursor: "pointer" }}
              onClick={() => {
                setShowModal(false);
                setSelectedEmployee(null);
                setSelectedContract(null);
              }}
            >
              ×
            </button>
            {selectedEmployee && (
              <>
                <h2>Employee Details</h2>
                <p><strong>Name:</strong> {selectedEmployee.name}</p>
                <p><strong>Employee ID:</strong> {selectedEmployee._id}</p>
                <p><strong>Department:</strong> {selectedEmployee.department}</p>
                <hr style={{ margin: "16px 0" }} />
                <h3>Login Time</h3>
                <p>{selectedEmployee.loginTime || "N/A"}</p>
                <h3>Logout Time</h3>
                <p>{selectedEmployee.logoutTime || "N/A"}</p>
                <h3>Weekly Attendance</h3>
                <p>{selectedEmployee.weeklyAttendance || "N/A"}</p>
                <h3>Monthly Attendance</h3>
                <p>{selectedEmployee.monthlyAttendance || "N/A"}</p>
              </>
            )}
            {selectedContract && (
              <>
                <h2>{selectedContract.type} Contract Details</h2>
                <p><strong>Vendor:</strong> {selectedContract.vendor}</p>
                <p><strong>Start Date:</strong> {selectedContract.startDate}</p>
                <p><strong>End Date:</strong> {selectedContract.endDate}</p>
                {/* Add more contract details here as needed */}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
