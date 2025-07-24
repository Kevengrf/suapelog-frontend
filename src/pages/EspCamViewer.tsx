import React, { useState } from 'react';

const EspCamViewer: React.FC = () => {
  const [ipAddress, setIpAddress] = useState('');
  const [streamUrl, setStreamUrl] = useState('');

  const handleViewStream = () => {
    if (ipAddress) {
      // Assumindo que o stream da ESP32-CAM está em /stream
      setStreamUrl(`http://${ipAddress}/stream`);
    } else {
      setStreamUrl('');
      alert('Por favor, insira o endereço IP da ESP32-CAM.');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Visualizador da ESP32-CAM</h1>
      <div className="card p-4 shadow-sm">
        <div className="mb-3">
          <label htmlFor="ipInput" className="form-label">Endereço IP da ESP32-CAM:</label>
          <input
            type="text"
            className="form-control"
            id="ipInput"
            placeholder="Ex: 192.168.1.100"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
          />
        </div>
        <button className="btn btn-primary mb-4" onClick={handleViewStream}>
          Ver Stream
        </button>

        {streamUrl && (
          <div className="mt-4 text-center">
            <h3>Stream de Vídeo:</h3>
            <img
              src={streamUrl}
              alt="ESP32-CAM Stream"
              className="img-fluid border rounded shadow-sm"
              style={{ maxWidth: '100%', height: 'auto' }}
              onError={(e) => {
                e.currentTarget.onerror = null; // Evita loop infinito em caso de erro
                e.currentTarget.src = ''; // Limpa a URL para não tentar carregar novamente
                alert('Não foi possível carregar o stream. Verifique o IP e se a câmera está ativa.');
              }}
            />
            <p className="text-muted mt-2">Certifique-se de que o IP está correto e a câmera está transmitindo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EspCamViewer;
