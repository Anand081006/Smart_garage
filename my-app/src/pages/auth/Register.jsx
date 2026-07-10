import './Register.css'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmEmail: "",
    dob: "",
    mobile: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.email !== formData.confirmEmail) {
      setError("Emails do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          dob: formData.dob,
          mobile: formData.mobile,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registered Successfully! Please Login ✅");
        navigate("/Login");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server error, please try again");
    }

    setLoading(false);
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <div className="register-header">
          <h1>Create Account</h1>
          <p className="register-subtitle">Fill in your details to get started</p>
        </div>

        {error && <p className="error-msg">❌ {error}</p>}

        <form className="register-form" onSubmit={handleSubmit}>

          {/* Row 1 */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">FULL NAME</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-mobile">MOBILE NUMBER</label>
              <input
                id="register-mobile"
                name="mobile"
                type="number"
                placeholder="Enter your mobile number"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="register-email">EMAIL</label>
              <input
                id="register-email"
                name="email"
                type="email"
                placeholder="Enter your email"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-confirm-email">CONFIRM EMAIL</label>
              <input
                id="register-confirm-email"
                name="confirmEmail"
                type="email"
                placeholder="Re-enter your email"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="register-password">PASSWORD</label>
              <input
                id="register-password"
                name="password"
                type="password"
                placeholder="Enter your password"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-dob">DATE OF BIRTH</label>
              <input
                id="register-dob"
                name="dob"
                type="date"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Create Account"}
          </button>

          <p className='Login-footer'>
            <Link to="/Login">Already have an account? Login</Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Register;