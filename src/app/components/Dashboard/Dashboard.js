"use client";
import React from "react";

export default function Dashboard() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Welcome to the Dashboard</h2>
      <div style={{ display: "flex", gap: 24, marginTop: 32 }}>
        <div style={{ flex: 1, background: "#f5f5f5", borderRadius: 8, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <h3>Employee Details</h3>
          {/* Employee details content here */}
        </div>
        <div style={{ flex: 1, background: "#f5f5f5", borderRadius: 8, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <h3>Employee Login Time</h3>
          {/* Employee login time content here */}
        </div>
        <div style={{ flex: 1, background: "#f5f5f5", borderRadius: 8, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <h3>Employee Logout Time</h3>
          {/* Employee logout time content here */}
        </div>
      </div>
    </div>
  );
}
