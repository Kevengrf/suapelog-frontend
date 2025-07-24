import { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import TimeCounter from '../components/TimeCounter';
import { useAppContext } from '../context/AppContext';
import TruckMap from '../components/TruckMap';
import PlacaMercosul from '../components/PlacaMercosul';
import { differenceInMinutes, format, isPast } from 'date-fns';

const Admin = () => {
  const { 
    accessLogs, 
    updateVehicleLocation, 
    markVehicleExit,
    markVehiclePC1Entry,
  } = useAppContext();
  const [filtroPlaca, setFiltroPlaca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [alerts, setAlerts] = useState<any[]>([]); 

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());

      const newAlerts: any[] = [];
      accessLogs.forEach(log => {
        if (!log.exitTimestamp) { 
          // Alertas de tempo em rota
          let timeInCurrentStage = 0;
          let alertMessage = '';

          if (log.location === 'Em Rota p/ PC1' && log.entryTimestamp) {
            timeInCurrentStage = differenceInMinutes(new Date(), new Date(log.entryTimestamp));
            alertMessage = `Veículo ${log.plate} está em rota para PC1 há ${timeInCurrentStage} minutos.`;
          } else if (log.location === 'Em Rota p/ Terminal' && log.pc1Timestamp) {
            timeInCurrentStage = differenceInMinutes(new Date(), new Date(log.pc1Timestamp));
            alertMessage = `Veículo ${log.plate} está em rota para Terminal há ${timeInCurrentStage} minutos.`;
          }

          if (timeInCurrentStage > 5) {
            newAlerts.push({ id: log.id + '-time', message: alertMessage, type: 'warning' });
          }

          // Alerta de janela de agendamento
          if (log.appointmentWindowStart && log.appointmentWindowEnd) {
            const windowEnd = new Date(log.appointmentWindowEnd);

            if (isPast(windowEnd) && log.location === 'Triagem') {
              newAlerts.push({ id: log.id + '-window', message: `Veículo ${log.plate} está fora da janela de agendamento.`, type: 'danger' });
            }
          }

          // Alerta de velocidade média baixa (simulado)
          if (log.speedAverage && log.speedAverage < 30 && (log.location === 'Em Rota p/ PC1' || log.location === 'Em Rota p/ Terminal')) {
            newAlerts.push({ id: log.id + '-speed', message: `Veículo ${log.plate} com velocidade média baixa (${log.speedAverage} km/h).`, type: 'warning' });
          }
        }
      });
      setAlerts(newAlerts);

    }, 10000); 
    return () => clearInterval(interval);
  }, [accessLogs]);

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
      Entrada: new Date(log.entryTimestamp).toLocaleString(),
      Saida: log.exitTimestamp ? new Date(log.exitTimestamp).toLocaleString() : 'No Pátio',
      Status: log.exitTimestamp ? 'Saiu' : 'No Pátio',
      Localizacao: log.location,
      TipoVeiculo: log.vehicleType,
      Agendamento: log.appointmentTime ? format(new Date(log.appointmentTime), 'dd/MM HH:mm') : 'N/A',
      JanelaAgendamento: log.appointmentWindowStart && log.appointmentWindowEnd ? `${format(new Date(log.appointmentWindowStart), 'HH:mm')} - ${format(new Date(log.appointmentWindowEnd), 'HH:mm')}` : 'N/A',
      Pegasus: log.pegasusLinkedData ? 'Sim' : 'Não',
      VelocidadeMedia: log.speedAverage ? `${log.speedAverage} km/h` : 'N/A',
      PatioEntrada: log.patioEntryTimestamp ? new Date(log.patioEntryTimestamp).toLocaleString() : '-',
      PatioSaida: log.patioExitTimestamp ? new Date(log.patioExitTimestamp).toLocaleString() : '-',
      PC1Entrada: log.pc1EntryTimestamp ? new Date(log.pc1EntryTimestamp).toLocaleString() : '-',
      PC1Saida: log.pc1ExitTimestamp ? new Date(log.pc1ExitTimestamp).toLocaleString() : '-',
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registros");
    XLSX.writeFile(workbook, "RelatorioSuapeLog.xlsx");
  };

  return (
    <div className="admin-dashboard">
      <h1 className="h2 mb-4 dashboard-title">Dashboard de Monitoramento</h1>

      {/* Painel de Alertas */}
      {alerts.length > 0 && (
        <div className="alert alert-danger mb-4">
          <h4 className="alert-heading">Alertas Urgentes!</h4>
          <ul className="mb-0">
            {alerts.map(alert => (
              <li key={alert.id}>{alert.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="row row-cols-1 row-cols-md-3 g-4 mb-4">
        <div className="col">
          <div className="card dashboard-card bg-primary text-white h-100">
            <div className="card-body d-flex flex-column justify-content-between">
              <h5 className="card-title">Veículos no Complexo</h5>
              <p className="card-text display-4">{veiculosNoPatio}</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card dashboard-card bg-success text-white h-100">
            <div className="card-body d-flex flex-column justify-content-between">
              <h5 className="card-title">Total de Entradas Hoje</h5>
              <p className="card-text display-4">{totalEntradasHoje}</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card dashboard-card bg-info text-white h-100">
            <div className="card-body d-flex flex-column justify-content-between">
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
                  <th>Tipo</th>
                  <th>Localização</th>
                  <th>Agendamento</th>
                  <th>Janela Agendamento</th>
                  <th>Pegasus</th>
                  <th>Velocidade Média</th>
                  <th>Entrada</th>
                  <th>Saída</th>
                  <th>Status / Tempo no Pátio</th>
                  <th>Tempo Triagem &#8594; PC1</th>
                  <th>Tempo PC1 &#8594; Saída</th>
                  <th>Mapa</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {registrosFiltrados.map(log => (
                  <tr key={log.id}>
                    <td data-label="Placa"><PlacaMercosul placa={log.plate} /></td>
                    <td data-label="Tipo">{log.vehicleType}</td>
                    <td data-label="Localização">{log.location}</td>
                    <td data-label="Agendamento">{log.appointmentTime ? format(new Date(log.appointmentTime), 'dd/MM HH:mm') : 'N/A'}</td>
                    <td data-label="Janela Agendamento">{log.appointmentWindowStart && log.appointmentWindowEnd ? `${format(new Date(log.appointmentWindowStart), 'HH:mm')} - ${format(new Date(log.appointmentWindowEnd), 'HH:mm')}` : 'N/A'}</td>
                    <td data-label="Pegasus"><span className={`badge ${log.pegasusLinkedData ? 'bg-success' : 'bg-danger'}`}>{log.pegasusLinkedData ? 'Sim' : 'Não'}</span></td>
                    <td data-label="Velocidade Média">{log.speedAverage ? `${log.speedAverage} km/h` : 'N/A'}</td>
                    <td data-label="Entrada">{new Date(log.entryTimestamp).toLocaleString()}</td>
                    <td data-label="Saída">{log.exitTimestamp ? new Date(log.exitTimestamp).toLocaleString() : '-'}</td>
                    <td data-label="Status / Tempo">
                      {!log.exitTimestamp ? (
                        <TimeCounter startTime={log.entryTimestamp} />
                      ) : (
                        <span className="badge bg-secondary fs-6">Saiu</span>
                      )}
                    </td>
                    <td data-label="Tempo Triagem &#8594; PC1">
                      {log.entryTimestamp && log.pc1EntryTimestamp
                        ? `${differenceInMinutes(new Date(log.pc1EntryTimestamp), new Date(log.entryTimestamp))} min`
                        : 'N/A'}
                    </td>
                    <td data-label="Tempo PC1 &#8594; Saída">
                      {log.pc1EntryTimestamp && log.exitTimestamp
                        ? `${differenceInMinutes(new Date(log.exitTimestamp), new Date(log.pc1EntryTimestamp))} min`
                        : 'N/A'}
                    </td>
                    <td data-label="Mapa">
                      {log.location && log.location !== 'Saiu' && log.location !== 'Pátio Público' && (
                        <TruckMap status={log.location} />
                      )}
                    </td>
                    <td data-label="Ações">
                      {!log.exitTimestamp && log.location !== 'Saiu' && log.location !== 'Pátio Público' && (
                        <div className="d-flex flex-column gap-2">
                          {log.location === 'Triagem' && (
                            <button className="btn btn-sm btn-outline-primary" onClick={() => updateVehicleLocation(log.id, 'Em Rota p/ PC1')}>Rota p/ PC1</button>
                          )}
                          {log.location === 'Em Rota p/ PC1' && (
                            <button className="btn btn-sm btn-primary" onClick={() => markVehiclePC1Entry(log.id)}>Chegou PC1</button>
                          )}
                          {log.location === 'PC1' && (
                            <button className="btn btn-sm btn-outline-primary" onClick={() => updateVehicleLocation(log.id, 'Em Rota p/ Terminal')}>Rota p/ Terminal</button>
                          )}
                          {log.location === 'Em Rota p/ Terminal' && (
                            <button className="btn btn-sm btn-danger" onClick={() => markVehicleExit(log.id)}>Registrar Saída</button>
                          )}
                        </div>
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