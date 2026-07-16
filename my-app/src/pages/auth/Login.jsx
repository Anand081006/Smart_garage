import './Login.css'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import loginBg from "../../assets/login.jpg";

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch("https://smartgarage-production.up.railway.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setIsLoggedIn(true);

        // 👇 role comes from DB now
        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/CoustomerDashboard");
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server error, please try again");
    }

    setLoading(false);
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url(${loginBg})` }}>
      <div className="login-card">
        <h1>LOGIN HERE</h1>
        <p className="login-subtitle">Enter your details to continue</p>

        {error && <p className="error-msg">❌ {error}</p>}

        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="email">USER ID / EMAIL</label>
          <input id="email" name="email" type="email" placeholder="Enter your email" />

          <label htmlFor="password" className="p">PASSWORD</label>
          <input id="password" name="password" type="password" placeholder="Enter your password" />

          <button className="login" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="login-footer">
            <Link to="/Register">don't have an account?</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;