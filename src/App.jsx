import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/navbar/Navbar";
import Login from "./components/auth/Login";
import ListCategory from "./components/ListCategory";
import FormCategory from "./components/FormCategory";
import ListBooks from "./components/ListBooks";
import FormBooks from "./components/FormBooks";
import Sidebar from "./components/navbar/Sidebar";
import Register from "./components/auth/Register";
import PrivateRoutes from "./components/auth/PrivateRoute";
import Footer from "./components/navbar/Footer";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
                <Footer />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route exact element={<PrivateRoutes />}>
            <Route
              path="/category"
              element={
                <>
                  <Sidebar />
                  <ListCategory />
                </>
              }
            />
          </Route>
          <Route exact element={<PrivateRoutes />}>
            <Route
              path="/category/create_category"
              element={
                <>
                  <Sidebar />
                  <FormCategory />
                </>
              }
            />
          </Route>
          <Route exact element={<PrivateRoutes />}>
            <Route
              path="/category/update_category/:id"
              element={
                <>
                  <Sidebar />
                  <FormCategory />
                </>
              }
            />
          </Route>
          <Route exact element={<PrivateRoutes />}>
            <Route
              path="/book"
              element={
                <>
                  <Sidebar />
                  <ListBooks />
                </>
              }
            />
          </Route>
          <Route exact element={<PrivateRoutes />}>
            <Route
              path="/book/create_book"
              element={
                <>
                  <Sidebar />
                  <FormBooks />
                </>
              }
            />
          </Route>
          <Route exact element={<PrivateRoutes />}>
            <Route
              path="/book/update_book/:id"
              element={
                <>
                  <Sidebar />
                  <FormBooks />
                </>
              }
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
