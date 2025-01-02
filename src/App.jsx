import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "@fortawesome/fontawesome-free/css/all.min.css";
import Home from "./component/Home";
import Navbar from "./component/Navbar";
import { Route, Routes } from "react-router-dom";
import Movies from "./component/Movies";
import Tv from "./component/Tv";
import NotFound from "./component/NotFound";
import Details from "./component/Details";
import PersonDetails from "./Person/PersonDetails";
import Footer from "./component/Footer";
function App() {
  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="home"
            element={<Home />}
          />
          <Route
            path="Movies"
            element={<Movies />}
          />
          <Route
            path="tv"
            element={<Tv />}
          />
          <Route path="details/:mediatype/:id" element={<Details />} />
          <Route path="/person/:personId" element={<PersonDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
