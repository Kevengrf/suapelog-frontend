import React from 'react';
import './PlacaMercosul.css';

interface PlacaMercosulProps {
  placa: string;
}

const PlacaMercosul: React.FC<PlacaMercosulProps> = ({ placa }) => {
  return (
    <div className="placa">
      <div className="topo">BRASIL</div>
      <div className="mercosul">MERCOSUL</div>
      <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg" className="bandeira" alt="Bandeira Brasil" />
      <div className="qr"></div>
      <div className="br">BR</div>
      <div className="codigo">{placa}</div>
    </div>
  );
};

export default PlacaMercosul;
