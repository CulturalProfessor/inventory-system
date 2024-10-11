import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

const SignOut: React.FC = () => {
  const { logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    logout();

    navigate("/signin");
  }, [logout, navigate]);

  return null;
};

export default SignOut;
