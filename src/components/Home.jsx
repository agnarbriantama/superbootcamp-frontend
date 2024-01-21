import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/books")
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  const formatRupiah = (price) => {
    if (price === 0) {
      return "Free";
    } else {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(price);
    }
  };

  const sliceword = (description) => {
    const words = description.split(" ");
    const first8Words = words.slice(0, 10).join(" ");

    return first8Words;
  };

  return (
    <div className="md:p-8">
      <div className=" text-center text-4xl font-serif">List Book</div>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-6xl">
          {books.map((book) => (
            <div key={book.id} className="mt-5 m-1 md:m-1">
              <div className="transition ease-in-out delay-150  hover:-translate-y-1  flex flex-col items-start bg-white border border-gray-200 rounded-lg shadow-slate-800 shadow-lg hover:bg-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                <img
                  className="object-cover w-full h-64 rounded-t-lg"
                  src={book.image_url}
                  alt=""
                />
                <div className="flex flex-col justify-start p-4 sm:h-64 lg:h-64 md:h-80 leading-normal">
                  <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {book.title}
                  </h5>
                  <h5 className="text-gray-500 font-semibold">
                    {book.category.name}
                  </h5>
                  <h5 className=" font-semibold ">
                    {formatRupiah(book.price)}
                  </h5>
                  <div className="flex item-center">
                    <svg
                      className="w-[14px] h-[14px] mt-2 mr-2 text-gray-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 18"
                    >
                      <path d="M9 1.334C7.06.594 1.646-.84.293.653a1.158 1.158 0 0 0-.293.77v13.973c0 .193.046.383.134.55.088.167.214.306.366.403a.932.932 0 0 0 .5.147c.176 0 .348-.05.5-.147 1.059-.32 6.265.851 7.5 1.65V1.334ZM19.707.653C18.353-.84 12.94.593 11 1.333V18c1.234-.799 6.436-1.968 7.5-1.65a.931.931 0 0 0 .5.147.931.931 0 0 0 .5-.148c.152-.096.279-.235.366-.403.088-.167.134-.357.134-.55V1.423a1.158 1.158 0 0 0-.293-.77Z" />
                    </svg>
                    <span>
                      {" "}
                      <h5 className=" ">{book.total_page} Halaman</h5>
                    </span>
                  </div>

                  <p>Ketebalan Buku : {book.thickness}</p>
                  <p>{sliceword(book.description)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Home;
