import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { differenceInHours, formatDistanceStrict } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// --- TIPOS E DADOS MOCKADOS ---

interface Registro {
  id: number;
  placa: string;
  motorista: string;
  entrada: Date;
  saida: Date | null;
}

// Gerador de dados iniciais
const getInitialData = (): Registro[] => [
  { id: 1, placa: 'ABC-1234', motorista: 'João Silva', entrada: new Date('2025-07-21T10:00:00'), saida: new Date('2025-07-21T18:30:00') },
  { id: 2, placa: 'DEF-5678', motorista: 'Maria Oliveira', entrada: new Date('2025-07-22T08:15:00'), saida: new Date('2025-07-23T12:00:00') },
  { id: 3, placa: 'GHI-9012', motorista: 'Carlos Pereira', entrada: new Date('2025-07-20T14:00:00'), saida: new Date('2025-07-22T20:45:00') }, // > 2 dias
  { id: 4, placa: 'JKL-3456', motorista: 'Ana Costa', entrada: new Date('2025-07-23T09:30:00'), saida: null }, // No pátio
  { id: 5, placa: 'MNO-7890', motorista: 'Pedro Martins', entrada: new Date('2025-07-23T11:00:00'), saida: null }, // No pátio
  { id: 6, placa: 'PQR-1234', motorista: 'Sandra Dias', entrada: new Date('2025-07-19T06:00:00'), saida: new Date('2025-07-19T15:20:00') },
];

// --- COMPONENTE PRINCIPAL DO DASHBOARD ---

const RelatorioPermanencia: React.FC = () => {
  const [registros, setRegistros] = useState<Registro[]>(getInitialData());
  const [now, setNow] = useState(new Date());

  // Efeito para simular "tempo real"
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60 * 1000); // Atualiza a hora a cada minuto
    
    const newEntryTimer = setInterval(() => {
      const newId = registros.length > 0 ? Math.max(...registros.map(r => r.id)) + 1 : 1;
      const newPlaca = `XYZ-${Math.floor(1000 + Math.random() * 9000)}`;
      const newMotorista = `Motorista ${newId}`;
      
      setRegistros(prev => [...prev, {
        id: newId,
        placa: newPlaca,
        motorista: newMotorista,
        entrada: new Date(),
        saida: null,
      }]);
    }, 15000); // Adiciona um novo caminhão a cada 15 segundos

    return () => {
      clearInterval(timer);
      clearInterval(newEntryTimer);
    };
  }, [registros]);

  // --- CÁLCULOS PARA KPIs E GRÁFICOS ---

  const registrosCompletos = registros.filter(r => r.saida !== null);
  const caminhoesNoPatio = registros.filter(r => r.saida === null).length;

  const tempoMedioHoras = registrosCompletos.length > 0
    ? registrosCompletos.reduce((acc, r) => acc + differenceInHours(r.saida!, r.entrada), 0) / registrosCompletos.length
    : 0;

  const dadosGrafico = registros.map(r => ({
    name: `${r.motorista.split(' ')[0]} (${r.placa.substring(0, 3)})`,
    'Tempo (horas)': r.saida ? differenceInHours(r.saida, r.entrada) : differenceInHours(now, r.entrada),
  })).sort((a, b) => b['Tempo (horas)'] - a['Tempo (horas)']);

  const formatarDuracao = (inicio: Date, fim: Date | null) => {
    return formatDistanceStrict(inicio, fim ?? now, { locale: ptBR, unit: 'hour' });
  };

  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-4">Dashboard de Permanência em Tempo Real</h2>

      {/* Cards de KPI */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card text-white bg-primary h-100">
            <div className="card-body">
              <h5 className="card-title">Caminhões Atualmente no Pátio</h5>
              <p className="card-text fs-1">{caminhoesNoPatio}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card text-white bg-success h-100">
            <div className="card-body">
              <h5 className="card-title">Tempo Médio de Permanência (Concluídos)</h5>
              <p className="card-text fs-1">{tempoMedioHoras.toFixed(1)} horas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="row mb-4">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Tempo de Permanência por Veículo (em horas)</h5>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <BarChart data={dadosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${Number(value).toFixed(1)} horas`} />
                    <Legend />
                    <Bar dataKey="Tempo (horas)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Registros */}
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Registros de Acesso</h5>
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Placa</th>
                      <th>Motorista</th>
                      <th>Entrada</th>
                      <th>Saída</th>
                      <th>Status</th>
                      <th>Tempo de Permanência</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registros.map(r => (
                      <tr key={r.id}>
                        <td data-label="Placa">{r.placa}</td>
                        <td data-label="Motorista">{r.motorista}</td>
                        <td data-label="Entrada">{r.entrada.toLocaleString('pt-BR')}</td>
                        <td data-label="Saída">{r.saida ? r.saida.toLocaleString('pt-BR') : '...'}</td>
                        <td data-label="Status">
                          <span className={`badge ${r.saida ? 'bg-secondary' : 'bg-info'}`}>
                            {r.saida ? 'Saiu' : 'No Pátio'}
                          </span>
                        </td>
                        <td data-label="Permanência">{formatarDuracao(r.entrada, r.saida)}</td>
                      </tr>
                    )).reverse()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatorioPermanencia;