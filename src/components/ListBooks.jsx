import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { format } from "date-fns";
import Swal from "sweetalert2";
import { Button, Modal } from "flowbite-react";

const ListBooks = () => {
  const [fetchStatus, setFetchStatus] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [openModals, setOpenModals] = useState([]);
  const navigate = useNavigate();
  const [categories, setCategories] = useState();
  const [filter, setFilter] = useState({
    title: "",
    minYear: "",
    maxYear: "",

    // Add other filters as needed
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (fetchStatus) {
      fetchData();
    }
  }, [fetchStatus]);

  const fetchData = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get("http://localhost:8080/books", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: filter,
      });
      setJobs(response.data);
      setFetchStatus(false);
    } catch (error) {
      console.error("Error fetching book list:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      // Fetch categories from your API
      const response = await axios.get("http://localhost:8080/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    setFetchStatus(true);
  };

  const formatTanggal = (created_at) => {
    return format(new Date(created_at), "dd MMMM yyyy HH:mm:ss");
  };

  const formatupdateTanggal = (updated_at) => {
    return format(new Date(updated_at), "dd MMMM yyyy HH:mm:ss");
  };

  const handleEdit = (id) => {
    navigate(`/book/update_book/${id}`);
  };

  const handleDelete = async (id) => {
    const token = Cookies.get("token");
    try {
      const response = await axios.delete(`http://localhost:8080/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire("Success", "Book deleted successfully", "success");
      setFetchStatus(true);

      // Close the modal after successful deletion
      const updatedOpenModals = [...openModals];
      const index = jobs.findIndex((job) => job.id === id);
      if (index !== -1) {
        updatedOpenModals[index] = false;
        setOpenModals(updatedOpenModals);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.msg || "Failed to delete book";
      Swal.fire("Error", errorMessage, "error");
    }
  };

  const handleOpenModal = (index) => {
    const newOpenModals = [...openModals];
    newOpenModals[index] = true;
    setOpenModals(newOpenModals);
  };

  const handleCloseModal = (index) => {
    const newOpenModals = [...openModals];
    newOpenModals[index] = false;
    setOpenModals(newOpenModals);
  };

  return (
    <>
      <div className="">
        <div className="p-4 border-2 rounded-lg bg-gray-100 mt-20 font-serif">
          <h1 className="text-center font-serif text-4xl">List Buku</h1>
          <div className="mt-2">
            <div>
              <input
                type="text"
                name="title"
                className="sm:mt-3 md:mt-0 mr-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg"
                placeholder="Cari judul"
                value={filter.title}
                onChange={handleFilterChange}
              />
              <input
                type="number"
                name="minYear"
                className="sm:mt-3 md:mt-0 mt-0 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg "
                placeholder="Minimum Year"
                value={filter.minYear}
                onChange={handleFilterChange}
              />
              <button
                className="sm:mt-3 md:mt-0 mt-0 ml-2 focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-2">
              <table className="table rounded-lg overflow-hidden w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
                <thead className="text-xs text-gray-700 uppercase bg-blue-400 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-white">
                      No
                    </th>
                    <th scope="col" className="px-6 py-3 text-white">
                      Judul
                    </th>
                    <th scope="col" className="px-6 py-3 text-white">
                      Kategori
                    </th>
                    <th scope="col" className="px-6 py-3 text-white">
                      Deskripsi
                    </th>
                    <th scope="col" className="px-6 py-3 text-white">
                      Image
                    </th>
                    <th scope="col" className="px-6 py-3 text-white">
                      Tahun Terbit
                    </th>
                    <th scope="col" className="px-6 py-3 text-white">
                      Harga
                    </th>
                    <th scope="col" className="px-6 py-3 text-white">
                      Total Halaman
                    </th>
                    <th scope="col" className="px-6 py-3 text-white">
                      Ketebalan
                    </th>

                    <th scope="col" className="px-6 py-3 text-white">
                      Created At
                    </th>
                    <th scope="col" className="px-6 py-3 text-white">
                      Updated At
                    </th>
                    <th scope="col" className="px-6 py-3 text-white">
                      Action
                    </th>
                  </tr>
                </thead>

                {jobs.map((job, numb) => (
                  <tbody key={job.id}>
                    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        key={numb}
                      >
                        {numb + 1}
                      </th>
                      <td className="px-6 py-4 font-bold">
                        <h1>{job.title}</h1>
                      </td>
                      <td className="px-6 py-4 ">
                        <h1>{job.category.name}</h1>
                      </td>
                      <td className="px-6 py-4 ">
                        <h1>{job.description}</h1>
                      </td>
                      <td className="px-6 py-4 ">
                        <img src={job.image_url} />
                      </td>
                      <td className="px-6 py-4 ">
                        <h1>{job.release_year}</h1>
                      </td>
                      <td className="px-6 py-4 ">
                        <h1>{job.price}</h1>
                      </td>
                      <td className="px-6 py-4 ">
                        <h1>{job.total_page}</h1>
                      </td>
                      <td className="px-6 py-4 ">
                        <h1>{job.thickness}</h1>
                      </td>
                      <td className="px-6 py-4">
                        {formatTanggal(job.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        {formatupdateTanggal(job.updated_at)}
                      </td>
                      <td className="px-6 py-4 space-x-4 space-x-reverse ">
                        <button
                          type="button"
                          value={job.id}
                          onClick={() => handleEdit(job.id)}
                          className=" text-white bg-yellow-300 border border-yellow-300 focus:outline-none hover:bg-yellow-100 focus:ring-4 focus:ring-yellow-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-yellow-800 dark:text-yellow dark:border-yellow-600 dark:hover:bg-yellow-700 dark:hover:border-yellow-600 dark:focus:ring-yellow-700"
                        >
                          Edit
                        </button>
                        <Button
                          color="failure"
                          onClick={() => handleOpenModal(numb)}
                        >
                          Delete
                        </Button>
                        <Modal
                          show={openModals[numb]}
                          onDelete={() => handleDelete(job.id)}
                          onClose={() => handleCloseModal(numb)}
                        >
                          <Modal.Header>Warning</Modal.Header>
                          <Modal.Body>
                            <div className="space-y-6">
                              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                Apakah anda yakin mau dihapus ?
                              </p>
                            </div>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button
                              color="failure"
                              onClick={() =>
                                handleDelete(job.id) && setOpenModal(false)
                              }
                            >
                              I accept
                            </Button>
                            <Button
                              color="gray"
                              onClick={() => handleCloseModal(numb)}
                            >
                              Decline
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
              <div className="p-4">
                <button
                  onClick={() => navigate("/book/create_book")}
                  type="button"
                  className=" focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                  Tambah Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ListBooks;
