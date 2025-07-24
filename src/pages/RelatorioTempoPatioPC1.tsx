
import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { differenceInMinutes, formatDistanceStrict } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const RelatorioTempoPatioPC1: React.FC = () => {
  const { accessLogs } = useAppContext();

  const dadosRelatorio = useMemo(() => {
    return accessLogs.filter(log => log.patioEntryTimestamp && log.pc1EntryTimestamp)
      .map(log => {
        const patioEntryTime = new Date(log.patioEntryTimestamp!);
        const pc1EntryTime = new Date(log.pc1EntryTimestamp!);
        const durationMinutes = differenceInMinutes(pc1EntryTime, patioEntryTime);
        const formattedDuration = formatDistanceStrict(patioEntryTime, pc1EntryTime, { locale: ptBR, unit: 'minute' });

        return {
          id: log.id,
          placa: log.plate,
          motorista: log.driverName,
          patioEntrada: patioEntryTime.toLocaleString('pt-BR'),
          pc1Entrada: pc1EntryTime.toLocaleString('pt-BR'),
          duracaoMinutos: durationMinutes,
          duracaoFormatada: formattedDuration,
        };
      })
      .sort((a, b) => b.duracaoMinutos - a.duracaoMinutos); // Ordena do maior tempo para o menor
  }, [accessLogs]);

  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-4 dashboard-title">Relatório: Tempo de Percurso (Pátio ao PC1)</h2>

      {dadosRelatorio.length === 0 ? (
        <div className="alert alert-info">Nenhum registro de percurso Pátio ao PC1 encontrado.</div>
      ) : (
        <div className="card shadow-sm dashboard-table-card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle dashboard-table">
                <thead className="table-light">
                  <tr>
                    <th>Placa</th>
                    <th>Motorista</th>
                    <th>Entrada Pátio</th>
                    <th>Entrada PC1</th>
                    <th>Duração</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosRelatorio.map(item => (
                    <tr key={item.id}>
                      <td data-label="Placa"><span className="fw-bold">{item.placa}</span></td>
                      <td data-label="Motorista">{item.motorista}</td>
                      <td data-label="Entrada Pátio">{item.patioEntrada}</td>
                      <td data-label="Entrada PC1">{item.pc1Entrada}</td>
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

export default RelatorioTempoPatioPC1;
