import React from "react";
import LoginForm from "../components/auth/LoginForm";

const LoginPage = () => (
  <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
    <div className="card p-4 shadow" style={{ minWidth: 350 }}>
      <LoginForm />
    </div>
  </div>
);
export default LoginPage;
