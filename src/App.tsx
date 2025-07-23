import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Admin from "./pages/Admin";
import Guarita from "./pages/Guarita";
import Motoristas from "./pages/Motoristas";
import Veiculos from "./pages/Veiculos";
import GuaritaSaida from "./pages/GuaritaSaida";
import RelatorioPermanencia from "./pages/RelatorioPermanencia";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/guarita" element={<Guarita />} />
          <Route path="/guarita-saida" element={<GuaritaSaida />} />
          <Route path="/motoristas" element={<Motoristas />} />
          <Route path="/veiculos" element={<Veiculos />} />
          <Route path="/admin/relatorios" element={<RelatorioPermanencia />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
