
import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const TriagemSaida = () => {
  const { accessLogs, markVehicleExit } = useAppContext();
  const [placa, setPlaca] = useState('');
  const [currentLog, setCurrentLog] = useState<any>(null);

  useEffect(() => {
    if (placa) {
      const log = accessLogs.find(log => log.plate === placa && !log.exitTimestamp);
      setCurrentLog(log);
    } else {
      setCurrentLog(null);
    }
  }, [placa, accessLogs]);

  const handleExit = () => {
    if (currentLog) {
      markVehicleExit(currentLog.id);
      alert(`Saída registrada para a placa ${placa}`);
      setPlaca('');
    } else {
      alert('Veículo não encontrado ou já saiu.');
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '80vh' }}>
      <div className="card shadow-lg" style={{ width: '100%', maxWidth: '500px' }}>
        <div className="card-header bg-danger text-white">
          <h2 className="text-center mb-0">Triagem de Saída</h2>
        </div>
        <div className="card-body p-4">
          <div className="mb-3">
            <label htmlFor="placa" className="form-label fs-5">Placa do Veículo</label>
            <input 
              type="text" 
              className="form-control form-control-lg text-center" 
              id="placa" 
              value={placa} 
              onChange={(e) => setPlaca(e.target.value.toUpperCase())} 
              placeholder="Insira a placa"
            />
          </div>
          {currentLog && (
            <div className="mb-3 text-center">
              <p className="mb-1">Motorista: <span className="fw-bold">{currentLog.driverName}</span></p>
              <p className="mb-0">Entrada: <span className="fw-bold">{new Date(currentLog.entryTimestamp).toLocaleString()}</span></p>
            </div>
          )}
          <div className="d-grid mt-4">
            <button type="button" className="btn btn-danger btn-lg" onClick={handleExit} disabled={!currentLog}>
              Confirmar Saída
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriagemSaida;
