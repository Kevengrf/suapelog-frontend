import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Admin from "./pages/Admin";
import Motoristas from "./pages/Motoristas";
import Veiculos from "./pages/Veiculos";
import RelatorioPermanencia from "./pages/RelatorioPermanencia";
import TriagemEntrada from "./pages/TriagemEntrada";
import TriagemSaida from "./pages/TriagemSaida";
import RelatorioTempoPercurso from "./pages/RelatorioTempoPercurso";
import RelatorioAuditoria from "./pages/RelatorioAuditoria";
import RelatorioTempoPatioPC1 from "./pages/RelatorioTempoPatioPC1";
import RelatorioHistoricoDetalhado from "./pages/RelatorioHistoricoDetalhado";
import EspCamViewer from "./pages/EspCamViewer";

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
          <Route path="/admin/relatorios/permanencia" element={<RelatorioPermanencia />} />
          <Route path="/admin/relatorios/percurso" element={<RelatorioTempoPercurso />} />
          <Route path="/admin/relatorios/patio-pc1" element={<RelatorioTempoPatioPC1 />} />
          <Route path="/admin/relatorios/historico-detalhado" element={<RelatorioHistoricoDetalhado />} />
          <Route path="/admin/relatorios/auditoria" element={<RelatorioAuditoria />} />
          <Route path="/esp-cam-viewer" element={<EspCamViewer />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
