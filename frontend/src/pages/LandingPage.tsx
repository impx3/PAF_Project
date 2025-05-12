import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "../styles/LandingPage.module.css";
import logo from "../images/chop-chop-logo.png";

const LandingPage: React.FC = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (!context) {
    return null;
  }

  const { currentUser } = context;

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <div className={styles.wrapper}>
      <img src={logo} alt="Chop Chop Logo" className="rounded-logo" />
      <h1 className={styles.title}>Welcome to Chop Chop!</h1>
      <p>
        Discover passionate home chefs around the world. Join ChopChop and start
        sharing your unique cooking skills today.
      </p>
      <div className={styles.buttonGroup}>
        <button
          onClick={() => navigate("/register")}
          className={styles.registerBtn}
        >
          Register
        </button>
        <button onClick={() => navigate("/login")} className={styles.loginBtn}>
          Login
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
