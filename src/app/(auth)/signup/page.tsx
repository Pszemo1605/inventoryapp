"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
const SignUpForm = () => {
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    setLoader(true);
    setError("")
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: fullName,
        email: email,
        password: password,
      }),
    });
    if (response.ok) {
      router.push("/signin");
      setLoader(false)
    } else {
      console.error("Registration Failed");
      setError("Registration Failed");
      setLoader(false)
    }
  };
  return (
    <section className="gradient-form bg-gray-200 h-screen">
      <div className="container mx-auto py-12 px-6 h-full">
        <div className=" flex justify-center items-center flex-wrap h-full g-6 text-gray-800 ">
          <div className="">
            <div className="block bg-white shadow-lg rounded-lg">
              <div className="lg:flex lg:flex-wrap g-0">
                <div className="px-4 md:px-0">
                  <div className="p-4 py-5 md:p-12 md:mx-6">
                    <div className="text-center">
                      <h4 className="text-xl font-semibold mt-1 mb-5 pb-1">
                        Inventory Management System
                      </h4>
                    </div>
                    <form onSubmit={onSubmit}>
                      <p className="mb-4 text-center">Create a new account!</p>
                      <div className="mb-4">
                        <input
                          type="text"
                          className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                          placeholder="Full Name"
                          name="fullName"
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>
                      <div className="mb-4">
                        <input
                          type="email"
                          className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                          placeholder="Your Email"
                          name="userEmail"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="mb-4">
                        <input
                          type="password"
                          className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                          placeholder="Password"
                          name="pin"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <p className="text-center text-red-500 text-sm pb-2">{error}</p>
                      <div className="text-center pt-1 mb-12 pb-1">
                        <button
                          type="submit"
                          className="inline-block px-6 py-2 border-2 border-green-600 text-white bg-green-600 font-medium text-xs leading-tight uppercase rounded  hover:bg-opacity-75 focus:outline-none focus:ring-0 transition duration-150 ease-in-out w-full"
                        >
                       {loader? "Loading.." : "Signup"}   
                        </button>
                      </div>
                      <div className="flex items-center justify-between pb-6">
                        <p className="mb-0 mr-2">Already have an account?</p>
                        <button
                          type="button"
                          onClick={() => router.push("/signin")}
                          className="inline-block px-6 py-2 border-2 border-green-600 text-green-600 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
                        >
                          Login
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default SignUpForm;
