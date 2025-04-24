import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
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
