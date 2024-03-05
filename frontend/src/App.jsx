import { Outlet } from "react-router-dom";
import FooterComp from "./components/Footer";
import HeaderComp from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <div className="min-h-[100vh] flex flex-col">
        <HeaderComp />
        <main className="py-3">
          <Outlet />
        </main>
        <FooterComp />
        <ToastContainer />
      </div>
    </>
  );
};

export default App;
