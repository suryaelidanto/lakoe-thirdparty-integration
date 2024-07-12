import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Biteship from "./pages/biteship";
import LeafletPage from "./pages/leaflet";
import MapBox from "./pages/mapbox";
import MidtransPage from "./pages/midtrans";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MidtransPage />} path="/midtrans" />
        <Route element={<LeafletPage />} path="/leaflet" />
        <Route element={<MapBox />} path="/mapbox" />
        <Route element={<Biteship />} path="/biteship" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
