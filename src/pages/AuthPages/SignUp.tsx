import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";
import { AppRoutes } from "../../constants";
import { useNavigate } from "react-router";
import { useLayoutEffect } from "react";

export default function SignUp() {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate(AppRoutes.DASHBOARD);
    }
  }, [navigate]);
  return (
    <>
      <PageMeta
        title="Grow Your Business with Swiggy"
        description="Ready to expand your reach and boost your online orders? Register your restaurant today and connect with a wider audience."
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
