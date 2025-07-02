import React from "react";
import RegisterForm from "../components/auth/RegisterForm";

const RegisterPage = () => (
  <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
    <div className="card p-4 shadow" style={{ minWidth: 350 }}>
      <RegisterForm />
    </div>
  </div>
);

export default RegisterPage;
