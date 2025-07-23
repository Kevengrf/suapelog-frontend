
import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { differenceInMinutes, formatDistanceStrict } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const RelatorioTempoPercurso: React.FC = () => {
  const { accessLogs } = useAppContext();

  const dadosRelatorio = useMemo(() => {
    return accessLogs.filter(log => log.pc1Timestamp && log.terminalTimestamp)
      .map(log => {
        const pc1Time = new Date(log.pc1Timestamp!);
        const terminalTime = new Date(log.terminalTimestamp!);
        const durationMinutes = differenceInMinutes(terminalTime, pc1Time);
        const formattedDuration = formatDistanceStrict(pc1Time, terminalTime, { locale: ptBR, unit: 'minute' });

        return {
          id: log.id,
          placa: log.plate,
          motorista: log.driverName,
          pc1Chegada: pc1Time.toLocaleString('pt-BR'),
          terminalChegada: terminalTime.toLocaleString('pt-BR'),
          duracaoMinutos: durationMinutes,
          duracaoFormatada: formattedDuration,
        };
      })
      .sort((a, b) => b.duracaoMinutos - a.duracaoMinutos); // Ordena do maior tempo para o menor
  }, [accessLogs]);

  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-4 dashboard-title">Relatório: Tempo de Percurso (PC1 ao Terminal)</h2>

      {dadosRelatorio.length === 0 ? (
        <div className="alert alert-info">Nenhum registro de percurso PC1 ao Terminal encontrado.</div>
      ) : (
        <div className="card shadow-sm dashboard-table-card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle dashboard-table">
                <thead className="table-light">
                  <tr>
                    <th>Placa</th>
                    <th>Motorista</th>
                    <th>Chegada PC1</th>
                    <th>Chegada Terminal</th>
                    <th>Duração</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosRelatorio.map(item => (
                    <tr key={item.id}>
                      <td data-label="Placa"><span className="fw-bold">{item.placa}</span></td>
                      <td data-label="Motorista">{item.motorista}</td>
                      <td data-label="Chegada PC1">{item.pc1Chegada}</td>
                      <td data-label="Chegada Terminal">{item.terminalChegada}</td>
                      <td data-label="Duração"><span className="badge bg-primary fs-6">{item.duracaoFormatada}</span></td>
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

export default RelatorioTempoPercurso;
