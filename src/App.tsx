import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Admin from "./pages/Admin";
import Motoristas from "./pages/Motoristas";
import Veiculos from "./pages/Veiculos";
import RelatorioPermanencia from "./pages/RelatorioPermanencia";
import TriagemEntrada from "./pages/TriagemEntrada";
import TriagemSaida from "./pages/TriagemSaida";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/triagem-entrada" element={<TriagemEntrada />} />
          <Route path="/triagem-saida" element={<TriagemSaida />} />
          <Route path="/motoristas" element={<Motoristas />} />
          <Route path="/veiculos" element={<Veiculos />} />
          <Route path="/admin/relatorios" element={<RelatorioPermanencia />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
