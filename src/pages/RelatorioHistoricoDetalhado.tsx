
import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatDistanceStrict } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const RelatorioHistoricoDetalhado: React.FC = () => {
  const { accessLogs } = useAppContext();

  const dadosRelatorio = useMemo(() => {
    return accessLogs.map(log => {
      const entryTime = new Date(log.entryTimestamp);
      const exitTime = log.exitTimestamp ? new Date(log.exitTimestamp) : null;

      const patioDuration = (log.patioEntryTimestamp && log.patioExitTimestamp)
        ? formatDistanceStrict(new Date(log.patioEntryTimestamp), new Date(log.patioExitTimestamp), { locale: ptBR, unit: 'minute' })
        : 'N/A';

      const pc1Duration = (log.pc1EntryTimestamp && log.pc1ExitTimestamp)
        ? formatDistanceStrict(new Date(log.pc1EntryTimestamp), new Date(log.pc1ExitTimestamp), { locale: ptBR, unit: 'minute' })
        : 'N/A';

      const terminalDuration = (log.terminalEntryTimestamp && log.terminalExitTimestamp)
        ? formatDistanceStrict(new Date(log.terminalEntryTimestamp), new Date(log.terminalExitTimestamp), { locale: ptBR, unit: 'minute' })
        : 'N/A';

      return {
        id: log.id,
        placa: log.plate,
        motorista: log.driverName,
        tipoVeiculo: log.vehicleType,
        localizacaoAtual: log.location,
        entradaGeral: entryTime.toLocaleString('pt-BR'),
        saidaGeral: exitTime ? exitTime.toLocaleString('pt-BR') : 'No Pátio',
        patioEntrada: log.patioEntryTimestamp ? new Date(log.patioEntryTimestamp).toLocaleString('pt-BR') : '-',
        patioSaida: log.patioExitTimestamp ? new Date(log.patioExitTimestamp).toLocaleString('pt-BR') : '-',
        duracaoPatio: patioDuration,
        pc1Entrada: log.pc1EntryTimestamp ? new Date(log.pc1EntryTimestamp).toLocaleString('pt-BR') : '-',
        pc1Saida: log.pc1ExitTimestamp ? new Date(log.pc1ExitTimestamp).toLocaleString('pt-BR') : '-',
        duracaoPC1: pc1Duration,
        terminalEntrada: log.terminalEntryTimestamp ? new Date(log.terminalEntryTimestamp).toLocaleString('pt-BR') : '-',
        terminalSaida: log.terminalExitTimestamp ? new Date(log.terminalExitTimestamp).toLocaleString('pt-BR') : '-',
        duracaoTerminal: terminalDuration,
        velocidadeMedia: log.speedAverage ? `${log.speedAverage} km/h` : 'N/A',
        agendamento: log.appointmentTime ? new Date(log.appointmentTime).toLocaleString('pt-BR') : 'N/A',
        pegasus: log.pegasusLinkedData ? 'Sim' : 'Não',
        corPatio: log.patioColor || 'N/A',
      };
    }).sort((a, b) => new Date(b.entradaGeral).getTime() - new Date(a.entradaGeral).getTime());
  }, [accessLogs]);

  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-4 dashboard-title">Relatório: Histórico Detalhado de Veículos</h2>

      {dadosRelatorio.length === 0 ? (
        <div className="alert alert-info">Nenhum registro de veículo encontrado.</div>
      ) : (
        <div className="card shadow-sm dashboard-table-card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle dashboard-table">
                <thead className="table-light">
                  <tr>
                    <th>Placa</th>
                    <th>Motorista</th>
                    <th>Tipo</th>
                    <th>Localização</th>
                    <th>Entrada Geral</th>
                    <th>Saída Geral</th>
                    <th>Pátio (Entrada/Saída/Duração)</th>
                    <th>PC1 (Entrada/Saída/Duração)</th>
                    <th>Terminal (Entrada/Saída/Duração)</th>
                    <th>Velocidade Média</th>
                    <th>Agendamento</th>
                    <th>Pegasus</th>
                    <th>Cor Pátio</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosRelatorio.map(item => (
                    <tr key={item.id}>
                      <td data-label="Placa"><span className="fw-bold">{item.placa}</span></td>
                      <td data-label="Motorista">{item.motorista}</td>
                      <td data-label="Tipo">{item.tipoVeiculo}</td>
                      <td data-label="Localização">{item.localizacaoAtual}</td>
                      <td data-label="Entrada Geral">{item.entradaGeral}</td>
                      <td data-label="Saída Geral">{item.saidaGeral}</td>
                      <td data-label="Pátio">
                        Entrada: {item.patioEntrada}<br/>
                        Saída: {item.patioSaida}<br/>
                        Duração: <span className="badge bg-secondary">{item.duracaoPatio}</span>
                      </td>
                      <td data-label="PC1">
                        Entrada: {item.pc1Entrada}<br/>
                        Saída: {item.pc1Saida}<br/>
                        Duração: <span className="badge bg-secondary">{item.duracaoPC1}</span>
                      </td>
                      <td data-label="Terminal">
                        Entrada: {item.terminalEntrada}<br/>
                        Saída: {item.terminalSaida}<br/>
                        Duração: <span className="badge bg-secondary">{item.duracaoTerminal}</span>
                      </td>
                      <td data-label="Velocidade Média">{item.velocidadeMedia}</td>
                      <td data-label="Agendamento">{item.agendamento}</td>
                      <td data-label="Pegasus"><span className={`badge ${item.pegasus === 'Sim' ? 'bg-success' : 'bg-danger'}`}>{item.pegasus}</span></td>
                      <td data-label="Cor Pátio">
                        {item.corPatio && (
                          <span className={`badge bg-${item.corPatio}`}>{item.corPatio.toUpperCase()}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatorioHistoricoDetalhado;
