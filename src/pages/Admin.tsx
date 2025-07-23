import { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import TimeCounter from '../components/TimeCounter';
import { useAppContext } from '../context/AppContext';

const Admin = () => {
  const { accessLogs } = useAppContext();
  const [filtroPlaca, setFiltroPlaca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);

  const veiculosNoPatio = useMemo(() => accessLogs.filter(log => !log.exitTimestamp).length, [accessLogs]);
  const totalSaidasHoje = useMemo(() => 
    accessLogs.filter(log => 
      log.exitTimestamp && new Date(log.exitTimestamp).toDateString() === new Date().toDateString()
    ).length, 
    [accessLogs]
  );
  const totalEntradasHoje = useMemo(() => 
    accessLogs.filter(log => 
      new Date(log.entryTimestamp).toDateString() === new Date().toDateString()
    ).length, 
    [accessLogs]
  );

  const registrosFiltrados = useMemo(() => accessLogs.filter(log => {
    const matchPlaca = log.plate.toLowerCase().includes(filtroPlaca.toLowerCase());
    const status = log.exitTimestamp ? 'Saiu' : 'No Pátio';
    const matchStatus = filtroStatus === 'Todos' || status === filtroStatus;
    return matchPlaca && matchStatus;
  }).sort((a, b) => new Date(b.entryTimestamp).getTime() - new Date(a.entryTimestamp).getTime()), [accessLogs, filtroPlaca, filtroStatus]);

  const handleExportExcel = () => {
    const dataToExport = registrosFiltrados.map(log => ({
      Placa: log.plate,
      Motorista: log.driverName,
      Documento: log.document,
      Destino: log.destination,
      Entrada: new Date(log.entryTimestamp).toLocaleString(),
      Saida: log.exitTimestamp ? new Date(log.exitTimestamp).toLocaleString() : 'No Pátio',
      Status: log.exitTimestamp ? 'Saiu' : 'No Pátio',
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registros");
    XLSX.writeFile(workbook, "RelatorioSuapeLog.xlsx");
  };

  return (
    <div className="admin-dashboard">
      <h1 className="h2 mb-4 dashboard-title">Dashboard de Monitoramento</h1>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card dashboard-card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Veículos no Pátio</h5>
              <p className="card-text display-4">{veiculosNoPatio}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card dashboard-card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Total de Entradas Hoje</h5>
              <p className="card-text display-4">{totalEntradasHoje}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card dashboard-card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">Total de Saídas Hoje</h5>
              <p className="card-text display-4">{totalSaidasHoje}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm dashboard-table-card">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Histórico de Acessos</h3>
          <div className="d-flex align-items-center">
            <span className="text-muted me-3">Última atualização: {lastUpdated.toLocaleTimeString()}</span>
            <button className="btn btn-success" onClick={handleExportExcel}>
              Exportar para Excel
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-4">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Filtrar por placa..." 
                value={filtroPlaca}
                onChange={e => setFiltroPlaca(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select className="form-select" value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
                <option value="Todos">Todos</option>
                <option value="No Pátio">No Pátio</option>
                <option value="Saiu">Saiu</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle dashboard-table">
              <thead className="table-light">
                <tr>
                  <th>Placa</th>
                  <th>Motorista</th>
                  <th>Documento</th>
                  <th>Destino</th>
                  <th>Entrada</th>
                  <th>Saída</th>
                  <th>Status / Tempo no Pátio</th>
                </tr>
              </thead>
              <tbody>
                {registrosFiltrados.map(log => (
                  <tr key={log.id}>
                    <td data-label="Placa"><span className="fw-bold">{log.plate}</span></td>
                    <td data-label="Motorista">{log.driverName}</td>
                    <td data-label="Documento">{log.document}</td>
                    <td data-label="Destino">{log.destination}</td>
                    <td data-label="Entrada">{new Date(log.entryTimestamp).toLocaleString()}</td>
                    <td data-label="Saída">{log.exitTimestamp ? new Date(log.exitTimestamp).toLocaleString() : '-'}</td>
                    <td data-label="Status / Tempo">
                      {!log.exitTimestamp ? (
                        <TimeCounter startTime={log.entryTimestamp} />
                      ) : (
                        <span className="badge bg-secondary fs-6">Saiu</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;