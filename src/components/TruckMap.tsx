
import React, { useState, useEffect } from 'react';
import { FaTruck } from 'react-icons/fa';

interface TruckMapProps {
  status: 'Triagem' | 'Em Rota p/ PC1' | 'PC1' | 'Em Rota p/ Terminal' | 'No Terminal' | 'Em Rota p/ Saída' | 'Saiu' | 'Pátio Público';
}

const TruckMap: React.FC<TruckMapProps> = ({ status }) => {
  // Define as posições estáticas para cada ponto no mapa (em porcentagem)
  const staticPositions: Record<TruckMapProps['status'], number> = {
    'Triagem': 5,
    'Em Rota p/ PC1': 20, // Posição intermediária
    'PC1': 35,
    'Em Rota p/ Terminal': 50, // Posição intermediária
    'No Terminal': 65,
    'Em Rota p/ Saída': 80, // Posição intermediária
    'Saiu': 95, // Posição final (quase fora do mapa visível)
    'Pátio Público': 5, // Posição padrão para veículos no pátio público (não visível)
  };

  // Estado para gerenciar a posição atual animada do caminhão
  const [currentTruckPosition, setCurrentTruckPosition] = useState(staticPositions[status]);

  // Efeito para lidar com a animação do movimento do caminhão
  useEffect(() => {
    let animationInterval: number; // Corrigido para 'number'
    const step = 0.5; // Pontos percentuais para mover por intervalo
    const intervalTime = 50; // Milissegundos por passo

    const targetPosition = staticPositions[status];

    // Se o status for de rota, anima o caminhão
    if (status.startsWith('Em Rota')) {
      let startPos: number;
      let endPos: number;

      if (status === 'Em Rota p/ PC1') {
        startPos = staticPositions['Triagem'];
        endPos = staticPositions['PC1'];
      } else if (status === 'Em Rota p/ Terminal') {
        startPos = staticPositions['PC1'];
        endPos = staticPositions['No Terminal'];
      } else if (status === 'Em Rota p/ Saída') {
        startPos = staticPositions['No Terminal'];
        endPos = staticPositions['Saiu'];
      } else {
        setCurrentTruckPosition(targetPosition);
        return; // Não animar se o status não for de rota
      }

      setCurrentTruckPosition(startPos); // Começa do início do segmento
      animationInterval = setInterval(() => {
        setCurrentTruckPosition(prevPos => {
          const newPos = prevPos + step;
          if (newPos >= endPos) {
            clearInterval(animationInterval);
            return endPos;
          }
          return newPos;
        });
      }, intervalTime);
    } else {
      // Para status estáticos, pula diretamente para a posição
      setCurrentTruckPosition(targetPosition);
    }

    // Limpa o intervalo ao desmontar o componente ou mudar o status
    return () => clearInterval(animationInterval);
  }, [status]); // Re-executa o efeito quando o status muda

  const isVisible = status !== 'Saiu' && status !== 'Pátio Público';

  return (
    <div className="truck-map-container" style={{
      height: '80px',
      width: '100%',
      backgroundColor: '#e9ecef',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      padding: '0 15px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: 'inset 0 0 8px rgba(0,0,0,0.05)',
    }}>
      {/* Zonas do Mapa */}
      <div style={{
        position: 'absolute',
        left: '0%',
        width: '20%',
        height: '100%',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        borderRight: '1px dashed rgba(0,0,0,0.1)',
      }} title="Zona Triagem"></div>
      <div style={{
        position: 'absolute',
        left: '20%',
        width: '20%',
        height: '100%',
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        borderRight: '1px dashed rgba(0,0,0,0.1)',
      }} title="Zona PC1"></div>
      <div style={{
        position: 'absolute',
        left: '40%',
        width: '20%',
        height: '100%',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        borderRight: '1px dashed rgba(0,0,0,0.1)',
      }} title="Zona Terminal"></div>
      <div style={{
        position: 'absolute',
        left: '60%',
        width: '20%',
        height: '100%',
        backgroundColor: 'rgba(108, 117, 125, 0.1)',
        borderRight: '1px dashed rgba(0,0,0,0.1)',
      }} title="Zona No Terminal"></div>
      <div style={{
        position: 'absolute',
        left: '80%',
        width: '20%',
        height: '100%',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
      }} title="Zona Saída"></div>

      {/* Linha da Estrada */}
      <div style={{
        position: 'absolute',
        left: '10px',
        right: '10px',
        height: '10px',
        backgroundColor: '#6c757d',
        borderRadius: '5px',
        zIndex: 0,
        border: '1px solid #495057',
      }}></div>

      {/* Pontos de referência */}
      <div style={{
        position: 'absolute',
        left: '5%',
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        backgroundColor: '#007bff',
        zIndex: 1,
        boxShadow: '0 0 5px rgba(0,0,0,0.2)',
      }} title="Triagem"></div>
      <div style={{
        position: 'absolute',
        left: '35%',
        transform: 'translateX(-50%)',
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        backgroundColor: '#ffc107',
        zIndex: 1,
        boxShadow: '0 0 5px rgba(0,0,0,0.2)',
      }} title="PC1"></div>
      <div style={{
        position: 'absolute',
        left: '65%',
        transform: 'translateX(-50%)',
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        backgroundColor: '#28a745',
        zIndex: 1,
        boxShadow: '0 0 5px rgba(0,0,0,0.2)',
      }} title="Terminal"></div>
      <div style={{
        position: 'absolute',
        left: '95%',
        transform: 'translateX(-50%)',
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        backgroundColor: '#dc3545',
        zIndex: 1,
        boxShadow: '0 0 5px rgba(0,0,0,0.2)',
      }} title="Saída"></div>

      {/* Caminhão 2D */}
      {isVisible && (
        <div style={{
          position: 'absolute',
          left: `${currentTruckPosition}%`,
          transform: 'translateX(-50%)',
          transition: 'left 0.8s ease-in-out',
          zIndex: 2,
          fontSize: '36px',
          color: '#a0522d',
          filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))',
        }}>
          <FaTruck />
        </div>
      )}
    </div>
  );
};

export default TruckMap;
