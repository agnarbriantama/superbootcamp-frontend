import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { format } from "date-fns";
import Swal from "sweetalert2";
import { Button, Modal } from "flowbite-react";

const ListCategory = () => {
  const [fetchStatus, setFetchStatus] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [openModals, setOpenModals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");
        // setToken(tokenFromCookies); // Menyimpan token ke dalam state
        if (fetchStatus === true) {
          const response = await axios.get("http://localhost:8080/categories", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setJobs(response.data);
          setFetchStatus(false);
        }
      } catch (error) {
        console.error("Error fetching job list:", error);
      }
    };
    setOpenModals(new Array(jobs.length).fill(false));
    fetchData();
  }, [fetchStatus, setFetchStatus, jobs]);

  const formatTanggal = (created_at) => {
    return format(new Date(created_at), " dd MMMM yyyy HH:mm:ss");
  };

  const formatupdateTanggal = (updated_at) => {
    return format(new Date(updated_at), " dd MMMM yyyy HH:mm:ss");
  };

  const handleEdit = (id) => {
    navigate(`/category/update_category/${id}`);
  };

  const handleDelete = async (id) => {
    const token = Cookies.get("token");
    try {
      const isCategoryLinked = await checkCategoryLinkedWithBooks(id);

      if (isCategoryLinked) {
        Swal.fire(
          "Error",
          "Kategori terhubung dengan buku. Tidak dapat dihapus.",
          "error"
        );
        return;
      }
      const response = await axios.delete(
        `http://localhost:8080/categories/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire("Success", "Kategori berhasil dihapus", "success");

      const updatedResponse = await axios.get(
        "http://localhost:8080/categories"
      );
      setJobs(updatedResponse.data);
      setFetchStatus(true);
    } catch (error) {
      // Menangani kesalahan umum
      Swal.fire("Error", "Gagal menghapus kategori", "error");
    }
  };

  const checkCategoryLinkedWithBooks = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/categories/${id}/books`
      );
      const linkedBooks = response.data;

      return linkedBooks.length > 0;
    } catch (error) {
      return false;
    }
  };

  const handleOpenModal = (index) => {
    const newOpenModals = [...openModals];
    newOpenModals[index] = true;
    setOpenModals(newOpenModals);
  };

  // Function to handle closing the modal for a specific row
  const handleCloseModal = (index) => {
    const newOpenModals = [...openModals];
    newOpenModals[index] = false;
    setOpenModals(newOpenModals);
  };
  return (
    <>
      <div className="">
        <div className="p-4 border-2 rounded-lg bg-gray-100 mt-20 font-serif">
          <h1 className="text-center font-serif text-4xl">List Kategori</h1>
          <div className="mt-2">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="table rounded-lg overflow-hidden w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
                <thead className="text-xs text-gray-700 uppercase bg-blue-400 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-white">
                      No
                    </th>
                    <th scope="col" className="px-6 py-3 text-white">
                      Nama Kategori
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
                        <h1>{job.name}</h1>
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
                  onClick={() => navigate("/category/create_category")}
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
export default ListCategory;
