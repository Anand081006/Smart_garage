import "./Service.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch("https://smart-garage-2.onrender.com/api/services/all");
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.log("Error fetching services:", err);
    }
    setLoading(false);
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.role === "admin";

  return (
    <div className="services-page">

      <div className="services-header">
        <h1>Our Services</h1>
        <p>Quality vehicle services at affordable prices</p>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", padding: "40px" }}>Loading services...</p>
      ) : services.length === 0 ? (
        <p style={{ textAlign: "center", padding: "40px" }}>No services available yet</p>
      ) : (
        <div className="services-grid">
          {services.map((service) => (
            <div className="service-card" key={service.id}>
              <h3>{service.name}</h3>
              <p className="service-desc">{service.description}</p>
              <div className="service-info">
                <span className="price">₹{service.price}</span>
                <span className="time">⏱ {service.duration}</span>
              </div>
              {!isAdmin && (
                <button
                  className="book-now-btn"
                  onClick={() => navigate("/Bookservice")}
                >
                  Book Now
                </button>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Services;