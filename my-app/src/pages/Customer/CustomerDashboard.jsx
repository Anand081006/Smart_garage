import './CoustomerDashboard.css'
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function CustomerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user ? user.name : "Customer";

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`https://smartgarage-production.up.railway.app/api/bookings/mybookings/${userName}`);
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      console.log("Error fetching bookings:", err);
    }
    setLoading(false);
  };


  const total = bookings.length;
  const pending = bookings.filter(b => b.status === "pending").length;
  const inProgress = bookings.filter(b => b.status === "inprogress").length;
  const completed = bookings.filter(b => b.status === "completed").length;

  return (
    <div className="dashboard">


      <div className="welcome-box">
        <h2>Welcome back, {userName}!</h2>
        <p>Here's a summary of your vehicle services</p>
      </div>


      <div className="stats-row">
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p className="stat-number">{total}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p className="stat-number pending">{pending}</p>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <p className="stat-number progress">{inProgress}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-number completed">{completed}</p>
        </div>
      </div>


      <div className="section">
        <h3>Recent Bookings</h3>

        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found. Book a service to get started!</p>
        ) : (
          <table className="booking-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Vehicle</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Pickup</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.service}</td>
                  <td>{booking.vehicle_number}</td>
                  <td>{booking.date ? booking.date.toString().split("T")[0] : "-"}</td>
                  <td>{booking.time_slot}</td>
                  <td>{booking.pickup_type}</td>
                  <td>
                    <span className={`badge ${booking.status}`}>
                      {booking.status === "inprogress" ? "In Progress" : booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>


      <div className="section">
        <h3>Quick Actions</h3>
        <div className="actions-row">
          <Link to="/Bookservice" className="action-btn">Book a Service</Link>
          <Link to="/Contact" className="action-btn">Contact Us</Link>
        </div>
      </div>

    </div>
  );
}

export default CustomerDashboard;