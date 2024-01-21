import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { HiInformationCircle } from "react-icons/hi";
import { Alert } from "flowbite-react";
import Swal from "sweetalert2";

const Register = () => {
  const navigate = useNavigate();
  const [nama, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Register Account";
  }, []);

  const register = () => {
    if (!nama.trim()) {
      setError("Nama tidak boleh kosong.");
      return;
    }
    if (!username.trim()) {
      setError("Username tidak boleh kosong.");
      return;
    }
    if (password.length < 3) {
      setError("Password baru harus minimal 3 karakter.");
      return;
    }

    const data = {
      nama: nama,
      username: username,
      password: password,
    };

    axios
      .post("http://localhost:8080/register", data)
      .then((response) => {
        if (response.data && response.data.userId) {
          Cookies.set("userId", response.data.userId, { expires: 1 });
          Swal.fire("Success", "Berhasil membuat akun", "success");
          navigate("/login");
        } else {
          setError("Unexpected response structure from server.");
        }
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data.message || "Error during registration.");
        } else {
          setError("An error occurred during registration.");
        }
        Swal.fire("Error", "Gagal Membuat Akun", "error");
        console.error("Registration error:", error);
      });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-96 p-6 bg-white rounded-lg shadow-lg">
        {error && (
          <Alert color="failure" icon={HiInformationCircle}>
            {error}
          </Alert>
        )}
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Register Your Account
        </h1>
        <form className="mt-4 space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600" htmlFor="name">
              Name:
            </label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={nama}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="flex flex-col">
            <label
              className="text-sm font-medium text-gray-600"
              htmlFor="username"
            >
              username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="flex flex-col">
            <label
              className="text-sm font-medium text-gray-600"
              htmlFor="password"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                aria-describedby="terms"
                type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                required=""
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="terms"
                className="font-light text-gray-500 dark:text-gray-300"
              >
                I accept the{" "}
                <a
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  href="#"
                >
                  Terms and Conditions
                </a>
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={register}
            className="w-full p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Register
          </button>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
