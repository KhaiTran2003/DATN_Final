import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import "./AuthPage.css";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <div className="tab-header">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            SIGN IN
          </button>
          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            SIGN UP
          </button>
        </div>
        <div className="form-content">
          {isLogin ? <Login /> : <Signup />}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
