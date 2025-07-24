import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { isWithinInterval } from 'date-fns';

// Função para gerar uma placa aleatória
const gerarPlacaAleatoria = () => {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numeros = '0123456789';
  let placa = '';
  for (let i = 0; i < 3; i++) placa += letras.charAt(Math.floor(Math.random() * letras.length));
  placa += '-';
  for (let i = 0; i < 4; i++) placa += numeros.charAt(Math.floor(Math.random() * numeros.length));
  return placa;
};

const TriagemEntrada = () => {
  const { addAccessLog, accessLogs } = useAppContext(); // Adicionado accessLogs para simular lookup
  const [placa, setPlaca] = useState(gerarPlacaAleatoria());
  const [vehicleType, setVehicleType] = useState<'Normal' | 'Cegonha' | 'Serviço'>('Normal');
  const [isAgendado, setIsAgendado] = useState<boolean | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<Date | null>(null);
  const [appointmentWindowStart, setAppointmentWindowStart] = useState<Date | null>(null);
  const [appointmentWindowEnd, setAppointmentWindowEnd] = useState<Date | null>(null);

  const isServico = vehicleType === 'Serviço';

  useEffect(() => {
    // Simula a busca de agendamento por placa (como se viesse do Pegasus)
    const foundLog = accessLogs.find(log => log.plate === placa && log.appointmentTime);
    if (foundLog && foundLog.appointmentTime && foundLog.appointmentWindowStart && foundLog.appointmentWindowEnd) {
      setAppointmentTime(new Date(foundLog.appointmentTime));
      setAppointmentWindowStart(new Date(foundLog.appointmentWindowStart));
      setAppointmentWindowEnd(new Date(foundLog.appointmentWindowEnd));
    } else {
      setAppointmentTime(null);
      setAppointmentWindowStart(null);
      setAppointmentWindowEnd(null);
    }
  }, [placa, accessLogs]);

  const handleNovaLeitura = () => {
    setPlaca(gerarPlacaAleatoria());
    setVehicleType('Normal');
    setIsAgendado(null);
    setAppointmentTime(null);
    setAppointmentWindowStart(null);
    setAppointmentWindowEnd(null);
  };

  const handleVerificarAgendamento = () => {
    if (appointmentTime && appointmentWindowStart && appointmentWindowEnd) {
      const currentTime = new Date();
      const withinWindow = isWithinInterval(currentTime, {
        start: appointmentWindowStart,
        end: appointmentWindowEnd,
      });
      setIsAgendado(withinWindow);
    } else {
      setIsAgendado(false); // No appointment data found
    }
  };

  const handleRegistroEntrada = () => {
    const newAccessLog = {
      plate: placa,
      document: 'N/A',
      driverName: 'N/A',
      destination: 'N/A',
      vehicleType: vehicleType,
      location: (vehicleType === 'Cegonha' ? 'Pátio Público' : 'Triagem') as 'Triagem' | 'Pátio Público',
      appointmentTime: appointmentTime?.toISOString(),
      appointmentWindowStart: appointmentWindowStart?.toISOString(),
      appointmentWindowEnd: appointmentWindowEnd?.toISOString(),
      patioEntryTimestamp: new Date().toISOString(), // Mark patio entry at triagem
      pegasusLinkedData: Math.random() > 0.2, // Simulate Pegasus linkage
      speedAverage: Math.floor(Math.random() * 60) + 20, // Simulate speed
    };
    addAccessLog(newAccessLog);
    alert(`Entrada registrada para ${placa} (${vehicleType}).`);
    handleNovaLeitura();
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '80vh' }}>
      <div className="card shadow-lg" style={{ width: '100%', maxWidth: '550px' }}>
        <div className="card-header bg-primary text-white">
          <h2 className="text-center mb-0">Triagem de Entrada</h2>
        </div>
        <div className="card-body p-4">
          <div className="text-center mb-3">
            <p className="lead">Placa Detectada</p>
            <h1 className="display-4 fw-bold">{placa}</h1>
            <button className="btn btn-secondary btn-sm mt-2" onClick={handleNovaLeitura}>Simular Nova Leitura</button>
          </div>

          <div className="mb-3">
            <label htmlFor="vehicleType" className="form-label fs-5">Tipo de Veículo</label>
            <select 
              id="vehicleType" 
              className="form-select form-select-lg" 
              value={vehicleType} 
              onChange={e => setVehicleType(e.target.value as 'Normal' | 'Cegonha' | 'Serviço')}
            >
              <option value="Normal">Normal</option>
              <option value="Cegonha">Caminhão Cegonha</option>
              <option value="Serviço">Veículo de Serviço</option>
            </select>
          </div>

          {!isServico && (
            <>
              {appointmentTime && (
                <div className="text-center p-2 rounded mb-3" style={{backgroundColor: '#f0f0f0'}}>
                  <p className="mb-0">Agendamento: <span className="fw-bold">{appointmentTime.toLocaleString()}</span></p>
                  {appointmentWindowStart && appointmentWindowEnd && (
                    <p className="mb-0">Janela: <span className="fw-bold">{appointmentWindowStart.toLocaleTimeString()} - {appointmentWindowEnd.toLocaleTimeString()}</span></p>
                  )}
                </div>
              )}

              <div className="d-grid mb-3">
                <button className="btn btn-info text-white" onClick={handleVerificarAgendamento}>Verificar Agendamento (Token)</button>
              </div>

              {isAgendado !== null && (
                <div className={`alert ${isAgendado ? 'alert-success' : 'alert-warning'}`}>
                  {isAgendado ? 'Veículo com agendamento confirmado e dentro da janela!' : 'Veículo sem agendamento ou fora da janela.'}
                </div>
              )}
            </>
          )}

          {isServico && (
             <div className="alert alert-info">Veículos de serviço têm acesso livre e são registrados automaticamente.</div>
          )}

          <div className="d-grid mt-4">
            <button type="button" className="btn btn-primary btn-lg" onClick={handleRegistroEntrada}>
              Confirmar Entrada
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriagemEntrada;
