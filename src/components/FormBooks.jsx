import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const FormBooks = () => {
  const [book, setBook] = useState({
    title: "",
    description: "",
    image_url: "",
    release_year: "",
    price: "",
    total_page: "",
    category_id: "",
  });

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios
      .get("http://localhost:8080/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    if (id) {
      axios
        .get(`http://localhost:8080/books/${id}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        })
        .then((response) => {
          setBook({
            ...response.data,
            release_year: response.data.release_year.toString(),
            price: response.data.price.toString(),
            total_page: response.data.total_page.toString(),
          });
        })
        .catch((error) => {
          console.error("Error fetching book:", error);
          Swal.fire("Error", "Gagal memuat data buku", "error");
        });
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = id
      ? `http://localhost:8080/books/${id}`
      : "http://localhost:8080/books";
    const method = id ? axios.patch : axios.post;

    const dataToSend = {
      ...book,
      release_year: parseInt(book.release_year, 10),
      price: book.price.toString(),
      total_page: parseInt(book.total_page, 10),
      category_id: parseInt(book.category_id, 10),
    };

    try {
      await method(url, dataToSend, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      Swal.fire(
        "Success",
        `Buku berhasil ${id ? "diperbarui" : "ditambahkan"}`,
        "success"
      );
      navigate("/book");
    } catch (error) {
      console.error("Error:", error);
      const errorMessage =
        error.response?.data?.msg ||
        `Gagal ${id ? "memperbarui" : "menambahkan"} buku`;
      Swal.fire("Error", errorMessage, "error");
    }
  };
  return (
    <section className="p-4 border-2 rounded-lg bg-gray-100 mt-20 font-serif  dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {id ? "Edit" : "Tambah"} Buku
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="title"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Judul Buku
              </label>
              <input
                type="text"
                name="title"
                value={book.title}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Judul Buku"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="category_id"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Kategori
              </label>
              <select
                name="category_id"
                value={book.category_id}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              >
                <option value="" disabled>
                  Pilih Kategori
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Deskripsi Buku
              </label>
              <textarea
                type="text"
                name="description"
                value={book.description}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Deskripsi Buku"
                required
              ></textarea>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="image_url"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Image Url
              </label>
              <input
                type="text"
                name="image_url"
                value={book.image_url}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Deskripsi"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="release_year"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Tahun Terbit
              </label>
              <input
                type="number"
                min={1980}
                max={2021}
                name="release_year"
                value={book.release_year}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="tahun terbit"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="total_page"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Jumlah Halaman
              </label>
              <input
                type="number"
                min={1}
                name="total_page"
                value={book.total_page}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Total Buku"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="price"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Harga Buku
              </label>
              <input
                type="number"
                min={0}
                name="price"
                value={book.price}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Judul Buku"
                required
              />
            </div>
          </div>
          {/* Add other input fields for description, image_url, release_year, price, total_page, thickness */}
          <button
            type="submit"
            className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
          >
            {id ? "Update Buku" : "Tambah Buku"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default FormBooks;
