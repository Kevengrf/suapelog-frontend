
import React from 'react';

const RelatorioAuditoria: React.FC = () => {
  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-4 dashboard-title">Relatório: Auditoria de Cadastros Manuais</h2>
      <div className="alert alert-info">
        Esta tela é um placeholder para o relatório de auditoria de adições e remoções de cadastros manuais.
        Para que este relatório funcione, é necessário implementar a lógica de registro dessas ações no backend
        e integrar com esta interface.
      </div>
      <p>Aqui seriam listados os registros de:</p>
      <ul>
        <li>Adições manuais de motoristas/veículos.</li>
        <li>Remoções manuais de motoristas/veículos.</li>
        <li>Quem realizou a ação e quando.</li>
      </ul>
    </div>
  );
};

export default RelatorioAuditoria;
