import React from "react";
 import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";
import SignupImage  from "/images/Authentication/11573931_51374.svg"

export default function AuthLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2  dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <div className="flex flex-col items-center ">
              <img
                className="object-cover h-170 w-170  scale-x-[-1] "
                src={SignupImage}
                alt="Logo"
              />
            </div>
          </div>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
