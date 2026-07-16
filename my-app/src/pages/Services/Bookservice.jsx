import { useState, useEffect } from "react";
import "./Bookservice.css";

function Bookservice() {
  const [pickupType, setPickupType] = useState("self");
  const [deliveryType, setDeliveryType] = useState("self-collect");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [services, setServices] = useState([]);

  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    vehicle_number: "",
    vehicle_type: "",
    vehicle_brand: "",
    vehicle_model: "",
    service: "",
    date: "",
    time_slot: "",
    notes: "",
    address: "",
    city: "",
    pincode: "",
  });

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
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {

  if (step === 1) {
    if (!formData.customer_name || !formData.phone || !formData.vehicle_number || !formData.vehicle_type || !formData.vehicle_brand) {
      setError("Please fill all required fields!");
      return;
    }
  }


  if (step === 2) {
    if (!formData.service || !formData.date || !formData.time_slot) {
      setError("Please select service, date and time slot!");
      return;
    }
  }


  if (step === 3) {
    if (pickupType === "door" && (!formData.address || !formData.city || !formData.pincode)) {
      setError("Please fill pickup address details!");
      return;
    }
  }

  setError("");
  setStep(step + 1);
};
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://smart-garage-2.onrender.com/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          pickup_type: pickupType,
          delivery_type: deliveryType,
          address: `${formData.address}, ${formData.city}, ${formData.pincode}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setStep(5);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server error, please try again");
    }

    setLoading(false);
  };

  return (
    <div className="book-page">
      <div className="book-header">
        <h1>Book a Service</h1>
        <p>Fill in the details to reserve your vehicle service</p>
      </div>

      <div className="book-content">
        <div className="book-container">

        <div className="steps">
          <div className={`step ${step >= 1 ? "active" : ""}`}>1. Vehicle Info</div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? "active" : ""}`}>2. Service & Date</div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? "active" : ""}`}>3. Pickup & Delivery</div>
          <div className="step-line"></div>
          <div className={`step ${step >= 4 ? "active" : ""}`}>4. Confirm</div>
        </div>

        {error && <p className="error-msg">{error}</p>}

        {step === 1 && (
          <div className="form-section">
            <h3>Vehicle Information</h3>

            <label>Full Name</label>
            <input name="customer_name" type="text" placeholder="Enter your full name" onChange={handleChange} value={formData.customer_name} />

            <label>Phone Number</label>
            <input name="phone" type="tel" placeholder="+91 9876543210" onChange={handleChange} value={formData.phone} />

            <label>Vehicle Number</label>
            <input name="vehicle_number" type="text" placeholder="e.g. TN 01 AB 1234" onChange={handleChange} value={formData.vehicle_number} />

            <label>Vehicle Type</label>
            <select name="vehicle_type" onChange={handleChange} value={formData.vehicle_type}>
              <option value="">-- Select Vehicle Type --</option>
              <option>Car</option>
              <option>Bike</option>
              <option>SUV</option>
              <option>Truck</option>
            </select>

            <label>Vehicle Brand</label>
            <input name="vehicle_brand" type="text" placeholder="e.g. Honda, Toyota, BMW" onChange={handleChange} value={formData.vehicle_brand} />

            <label>Vehicle Model</label>
            <input name="vehicle_model" type="text" placeholder="e.g. City, Fortuner, X5" onChange={handleChange} value={formData.vehicle_model} />

            <button className="next-btn" onClick={handleNext}>Next</button>
          </div>
        )}

        {step === 2 && (
          <div className="form-section">
            <h3>Service & Date</h3>

            <label>Select Service</label>
            <select name="service" onChange={handleChange} value={formData.service}>
              <option value="">-- Select a Service --</option>
              {services.length === 0 ? (
                <option disabled>No services available</option>
              ) : (
                services.map((service) => (
                  <option key={service.id} value={service.name}>
                    {service.name} - ₹{service.price}
                  </option>
                ))
              )}
            </select>

            <label>Preferred Date</label>
            <input name="date" type="date" min={new Date().toISOString().split("T")[0]} onChange={handleChange} value={formData.date} />

            <label>Preferred Time Slot</label>
            <select name="time_slot" onChange={handleChange} value={formData.time_slot}>
              <option value="">-- Select Time Slot --</option>
              <option>9:00 AM - 11:00 AM</option>
              <option>11:00 AM - 1:00 PM</option>
              <option>2:00 PM - 4:00 PM</option>
              <option>4:00 PM - 6:00 PM</option>
            </select>

            <label>Additional Notes</label>
            <textarea name="notes" rows={3} placeholder="Describe any specific issue..." onChange={handleChange} value={formData.notes} />

            <div className="btn-row">
              <button className="back-btn" onClick={handleBack}>Back</button>
              <button className="next-btn" onClick={handleNext}>Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-section">
            <h3>Pickup & Delivery Options</h3>

            <label>How will you bring your vehicle?</label>
            <div className="pickup-options">
              <div className={`pickup-card ${pickupType === "self" ? "selected" : ""}`} onClick={() => setPickupType("self")}>
                <h4>Self Drop</h4>
                <p>You bring your vehicle to our garage</p>
              </div>
              <div className={`pickup-card ${pickupType === "door" ? "selected" : ""}`} onClick={() => setPickupType("door")}>
                <h4>Door Pickup</h4>
                <p>We pick up your vehicle from your location</p>
              </div>
            </div>

            {pickupType === "door" && (
              <div className="door-section">
                <label>Pickup Address</label>
                <input name="address" type="text" placeholder="Enter your full address" onChange={handleChange} value={formData.address} />
                <label>City</label>
                <input name="city" type="text" placeholder="e.g. Chennai" onChange={handleChange} value={formData.city} />
                <label>Pincode</label>
                <input name="pincode" type="text" placeholder="e.g. 600001" onChange={handleChange} value={formData.pincode} />
              </div>
            )}

            <label style={{ marginTop: "20px" }}>Delivery Option</label>
            <div className="pickup-options">
              <div className={`pickup-card ${deliveryType === "self-collect" ? "selected" : ""}`} onClick={() => setDeliveryType("self-collect")}>
                <h4>Self Collect</h4>
                <p>You pick up from our garage after service</p>
              </div>
              <div className={`pickup-card ${deliveryType === "home-delivery" ? "selected" : ""}`} onClick={() => setDeliveryType("home-delivery")}>
                <h4>Home Delivery</h4>
                <p>We deliver your vehicle back to you</p>
              </div>
            </div>

            <div className="btn-row">
              <button className="back-btn" onClick={handleBack}>Back</button>
              <button className="next-btn" onClick={handleNext}>Next</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="form-section confirm-section">
            <h3>Confirm Your Booking</h3>
            <p>Please review and confirm your service booking.</p>

            <div className="confirm-box">
              <p><strong>Name:</strong> {formData.customer_name}</p>
              <p><strong>Vehicle Number:</strong> {formData.vehicle_number}</p>
              <p><strong>Service:</strong> {formData.service}</p>
              <p><strong>Date:</strong> {formData.date}</p>
              <p><strong>Time:</strong> {formData.time_slot}</p>
              <p><strong>Pickup:</strong> {pickupType}</p>
              <p><strong>Delivery:</strong> {deliveryType}</p>
            </div>

            <div className="btn-row">
              <button className="back-btn" onClick={handleBack}>Back</button>
              <button className="confirm-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="form-section confirm-section">
            <h3>Booking Confirmed!</h3>
            <p>Your vehicle service has been booked successfully.</p>
            <p>We will contact you shortly to confirm your appointment.</p>
            <button className="confirm-btn" onClick={() => window.location.href = "/"}>
              Go to Home
            </button>
          </div>
        )}

      </div>
      </div>
    </div>
  );
}

export default Bookservice;