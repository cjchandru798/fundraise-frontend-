import React, { useEffect, useState } from "react";
import axios from "axios";

interface InternDashboardResponse {
  greeting: string;
  totalAmountRaised: number;
  totalDonors: number;
  referralCode: string;
  donationLink: string;
  badge: string;
}

const InternDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<InternDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<InternDashboardResponse>(
          "http://localhost:8080/api/intern/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDashboardData(response.data);
        setLoading(false);
      } catch (err: any) {
        setError("Failed to fetch dashboard data.");
        setLoading(false);
        console.error(err);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p>Loading intern dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!dashboardData) return <p>No data available.</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>{dashboardData.greeting}</h2>
      <p><strong>Total Amount Raised:</strong> ₹{dashboardData.totalAmountRaised}</p>
      <p><strong>Total Donors:</strong> {dashboardData.totalDonors}</p>
      <p><strong>Your Referral Code:</strong> {dashboardData.referralCode}</p>
      <p>
        <strong>Donation Link:</strong>{" "}
        <a href={dashboardData.donationLink} target="_blank" rel="noopener noreferrer">
          {dashboardData.donationLink}
        </a>
      </p>
      <p><strong>Badge:</strong> {dashboardData.badge}</p>
    </div>
  );
};

export default InternDashboard;
