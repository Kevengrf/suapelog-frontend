
import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatDocument } from '../utils/formatters';

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
  const { drivers, addAccessLog } = useAppContext();
  const [placa, setPlaca] = useState(gerarPlacaAleatoria());
  const [documento, setDocumento] = useState('');
  const [driverName, setDriverName] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicleType, setVehicleType] = useState<'Normal' | 'Cegonha' | 'Serviço'>('Normal'); // Novo estado
  const [isAgendado, setIsAgendado] = useState<boolean | null>(null);

  const isServico = vehicleType === 'Serviço';

  useEffect(() => {
    if (isServico) {
      setDriverName('Veículo de Serviço');
      setDestination('Acesso Livre');
      setDocumento('N/A');
    } else {
      const foundDriver = drivers.find(d => d.document === documento);
      if (foundDriver) {
        setDriverName(foundDriver.name);
        setDestination(vehicleType === 'Cegonha' ? 'Pátio Público' : 'Triagem'); // Destino inicial é Triagem
      } else {
        setDriverName('');
        setDestination('');
      }
    }
  }, [documento, drivers, vehicleType, isServico]);

  const handleNovaLeitura = () => {
    setPlaca(gerarPlacaAleatoria());
    setDocumento('');
    setDriverName('');
    setDestination('');
    setVehicleType('Normal');
    setIsAgendado(null);
  };

  const handleVerificarAgendamento = () => {
    // Simula a verificação de token
    setIsAgendado(Math.random() > 0.3); // 70% de chance de estar agendado
  };

  const handleRegistroEntrada = () => {
    if (!isServico && (!documento || !driverName)) {
      alert('Por favor, preencha todos os campos necessários.');
      return;
    }

    const newAccessLog = {
      plate: placa,
      document: documento,
      driverName: driverName,
      destination: destination,
      vehicleType: vehicleType,
      location: (vehicleType === 'Cegonha' ? 'Pátio Público' : 'Triagem') as 'Triagem' | 'Pátio Público', // Explicitamente o tipo literal
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
              onChange={e => setVehicleType(e.target.value as 'Normal' | 'Cegonha' | 'Serviço')} // Cast para o tipo correto
            >
              <option value="Normal">Normal</option>
              <option value="Cegonha">Caminhão Cegonha</option>
              <option value="Serviço">Veículo de Serviço</option>
            </select>
          </div>

          {!isServico && (
            <>
              <div className="mb-3">
                <label htmlFor="documento" className="form-label fs-5">Documento do Motorista</label>
                <input 
                  type="text" 
                  className="form-control form-control-lg text-center" 
                  id="documento" 
                  value={documento} 
                  onChange={e => setDocumento(formatDocument(e.target.value))} 
                  placeholder="Insira o CPF ou CNH"
                />
              </div>

              {driverName && (
                <div className="text-center p-2 rounded mb-3" style={{backgroundColor: '#f0f0f0'}}>
                  <p className="mb-1">Motorista: <span className="fw-bold">{driverName}</span></p>
                  <p className="mb-0">Destino: <span className="fw-bold">{destination}</span></p>
                </div>
              )}

              <div className="d-grid mb-3">
                <button className="btn btn-info text-white" onClick={handleVerificarAgendamento}>Verificar Agendamento (Token)</button>
              </div>

              {isAgendado !== null && (
                <div className={`alert ${isAgendado ? 'alert-success' : 'alert-warning'}`}>
                  {isAgendado ? 'Veículo com agendamento confirmado!' : 'Veículo sem agendamento prévio.'}
                </div>
              )}
            </>
          )}

          {isServico && (
             <div className="alert alert-info">Veículos de serviço têm acesso livre e são registrados automaticamente.</div>
          )}

          <div className="d-grid mt-4">
            <button type="button" className="btn btn-primary btn-lg" onClick={handleRegistroEntrada} disabled={!driverName}>
              Confirmar Entrada
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriagemEntrada;
