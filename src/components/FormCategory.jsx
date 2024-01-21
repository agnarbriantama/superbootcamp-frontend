import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const FormCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8080/categories/${id}`)
        .then((response) => {
          setName(response.data.name);
        })
        .catch((error) => {
          console.error("Error fetching category:", error);
          Swal.fire("Error", "Gagal memuat data kategori", "error");
        });
    }
  }, [id]);

  const handleInputChange = (e) => {
    setName(e.target.value);
    setError(""); // Clear the error when the user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");
    const url = id
      ? `http://localhost:8080/categories/${id}`
      : "http://localhost:8080/categories";
    const method = id ? "patch" : "post";

    if (name.trim() === "") {
      setError("Nama Kategori tidak boleh kosong.");
      return;
    }

    try {
      await axios[method](
        url,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire(
        "Success",
        `Kategori berhasil ${id ? "diperbarui" : "ditambahkan"}`,
        "success"
      );
      navigate("/category");
    } catch (error) {
      console.error("Error:", error);
      Swal.fire(
        "Error",
        `Gagal ${id ? "memperbarui" : "menambahkan"} kategori`,
        "error"
      );
    }
    setName("");
  };

  return (
    <section className="p-4 mt-20 bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {id ? "Edit" : "Tambah"} Kategori
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Nama Kategori
              </label>
              <input
                type="text"
                value={name}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Nama Kategori"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
          >
            {id ? "Update Kategori" : "Tambah Kategori"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default FormCategory;
