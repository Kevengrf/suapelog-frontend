
import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatDocument } from '../utils/formatters';

// Função para gerar uma placa aleatória no formato brasileiro (ABC-1234 ou ABC1D23)
const gerarPlacaAleatoria = () => {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numeros = '0123456789';
  const formatoMercosul = Math.random() > 0.5;

  let placa = '';
  for (let i = 0; i < 3; i++) placa += letras.charAt(Math.floor(Math.random() * letras.length));
  
  if (formatoMercosul) {
    placa += numeros.charAt(Math.floor(Math.random() * numeros.length));
    placa += letras.charAt(Math.floor(Math.random() * letras.length));
    placa += numeros.charAt(Math.floor(Math.random() * numeros.length));
    placa += numeros.charAt(Math.floor(Math.random() * numeros.length));
  } else {
    placa += '-';
    for (let i = 0; i < 4; i++) placa += numeros.charAt(Math.floor(Math.random() * numeros.length));
  }
  return placa;
};

const Guarita = () => {
  const { drivers, addAccessLog } = useAppContext();
  const [placa, setPlaca] = useState(gerarPlacaAleatoria());
  const [documento, setDocumento] = useState('');
  const [driverName, setDriverName] = useState('');
  const [destination, setDestination] = useState('');

  useEffect(() => {
    const foundDriver = drivers.find(d => d.document === documento);
    if (foundDriver) {
      setDriverName(foundDriver.name);
      // Simulate destination from scheduling system
      setDestination('Pátio Interno - Carga Geral'); 
    } else {
      setDriverName('');
      setDestination('');
    }
  }, [documento, drivers]);

  const handleNovaLeitura = () => {
    setPlaca(gerarPlacaAleatoria());
    setDocumento('');
    setDriverName('');
    setDestination('');
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumento(formatDocument(e.target.value));
  };

  const handleRegistroEntrada = () => {
    if (!documento || !driverName || !destination) {
      alert('Por favor, preencha todos os campos necessários.');
      return;
    }

    const newAccessLog = {
      plate: placa,
      document: documento,
      driverName: driverName,
      destination: destination,
    };
    addAccessLog(newAccessLog);
    alert(`Entrada registrada para a placa ${placa}, motorista ${driverName} com destino ${destination}`);
    handleNovaLeitura(); // Simula a leitura da próxima placa
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '80vh' }}>
      <div className="card shadow-lg" style={{ width: '100%', maxWidth: '500px' }}>
        <div className="card-header bg-primary text-white">
          <h2 className="text-center mb-0">Registro de Acesso da Guarita</h2>
        </div>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <p className="lead">Placa Detectada</p>
            <h1 className="display-4 fw-bold text-monospace">{placa}</h1>
            <button className="btn btn-secondary btn-sm mt-2" onClick={handleNovaLeitura}>Simular Nova Leitura</button>
          </div>
          <div className="mb-3">
            <label htmlFor="documento" className="form-label fs-5">Documento do Motorista</label>
            <input 
              type="text" 
              className="form-control form-control-lg text-center" 
              id="documento" 
              value={documento} 
              onChange={handleDocumentChange} 
              placeholder="Insira o CPF ou CNH"
            />
          </div>
          {driverName && destination && (
            <div className="mb-3 text-center">
              <p className="mb-1">Motorista: <span className="fw-bold">{driverName}</span></p>
              <p className="mb-0">Destino: <span className="fw-bold">{destination}</span></p>
            </div>
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

export default Guarita;

