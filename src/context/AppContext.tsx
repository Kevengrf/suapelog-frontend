import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { generateRandomName, generateRandomCpf, generateRandomPlate } from '../utils/formatters';

interface Driver {
  id: string;
  name: string;
  document: string;
  plate?: string; // Optional, as per your request (plate only)
}

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  color: string;
}

interface AccessLog {
  id: string;
  plate: string;
  document: string;
  driverName: string;
  destination: string;
  entryTimestamp: string;
  exitTimestamp?: string;
  vehicleType: 'Normal' | 'Cegonha' | 'Serviço';
  location: 'Triagem' | 'Em Rota p/ PC1' | 'PC1' | 'Em Rota p/ Terminal' | 'Terminal' | 'Saiu' | 'Pátio Público';
  pc1Timestamp?: string;
  terminalTimestamp?: string;
}

interface AppContextType {
  drivers: Driver[];
  vehicles: Vehicle[];
  accessLogs: AccessLog[];
  addDriver: (driver: Driver) => void;
  addVehicle: (vehicle: Vehicle) => void;
  addAccessLog: (log: Omit<AccessLog, 'id' | 'entryTimestamp' | 'exitTimestamp' | 'pc1Timestamp' | 'terminalTimestamp'>) => void;
  markVehicleExit: (logId: string) => void;
  updateDriver: (driver: Driver) => void;
  updateVehicle: (vehicle: Vehicle) => void;
  deleteDriver: (id: string) => void;
  deleteVehicle: (id: string) => void;
  markVehicleAtPC1: (logId: string) => void;
  markVehicleAtTerminal: (logId: string) => void;
  updateVehicleLocation: (logId: string, newLocation: AccessLog['location']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);

  const addDriver = (driver: Driver) => {
    setDrivers((prevDrivers) => [...prevDrivers, { ...driver, id: String(prevDrivers.length + 1) }]);
  };

  const updateDriver = (updatedDriver: Driver) => {
    setDrivers((prevDrivers) =>
      prevDrivers.map((driver) => (driver.id === updatedDriver.id ? updatedDriver : driver))
    );
  };

  const deleteDriver = (id: string) => {
    setDrivers((prevDrivers) => prevDrivers.filter((driver) => driver.id !== id));
  };

  const addVehicle = (vehicle: Vehicle) => {
    setVehicles((prevVehicles) => [...prevVehicles, { ...vehicle, id: String(prevVehicles.length + 1) }]);
  };

  const updateVehicle = (updatedVehicle: Vehicle) => {
    setVehicles((prevVehicles) =>
      prevVehicles.map((vehicle) => (vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle))
    );
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prevVehicles) => prevVehicles.filter((vehicle) => vehicle.id !== id));
  };

  const addAccessLog = (log: Omit<AccessLog, 'id' | 'entryTimestamp' | 'exitTimestamp' | 'pc1Timestamp' | 'terminalTimestamp'>) => {
    setAccessLogs((prevLogs) => [...prevLogs, { ...log, id: String(prevLogs.length + 1), entryTimestamp: new Date().toISOString() }]);
  };

  const markVehicleExit = (logId: string) => {
    setAccessLogs((prevLogs) =>
      prevLogs.map((log) =>
        log.id === logId ? { ...log, exitTimestamp: new Date().toISOString(), location: 'Saiu' } : log
      )
    );
  };

  const markVehicleAtPC1 = (logId: string) => {
    setAccessLogs((prevLogs) =>
      prevLogs.map((log) =>
        log.id === logId ? { ...log, pc1Timestamp: new Date().toISOString(), location: 'PC1' } : log
      )
    );
  };

  const markVehicleAtTerminal = (logId: string) => {
    setAccessLogs((prevLogs) =>
      prevLogs.map((log) =>
        log.id === logId ? { ...log, terminalTimestamp: new Date().toISOString(), location: 'Terminal' } : log
      )
    );
  };

  const updateVehicleLocation = (logId: string, newLocation: AccessLog['location']) => {
    setAccessLogs((prevLogs) =>
      prevLogs.map((log) =>
        log.id === logId ? { ...log, location: newLocation } : log
      )
    );
  };

  // Automated data generation for demo
  useEffect(() => {
    const interval = setInterval(() => {
      const randomPlate = generateRandomPlate();
      const randomName = generateRandomName();
      const randomCpf = generateRandomCpf();
      const randomDestination = Math.random() > 0.5 ? 'Pátio Interno - Carga Geral' : 'Pátio Externo - Descarga';
      
      // Ajuste na probabilidade de tipos de veículo
      const vehicleTypesWeighted: AccessLog['vehicleType'][] = [];
      for(let i = 0; i < 7; i++) vehicleTypesWeighted.push('Normal'); // 70%
      for(let i = 0; i < 2; i++) vehicleTypesWeighted.push('Serviço'); // 20%
      vehicleTypesWeighted.push('Cegonha'); // 10%

      const randomVehicleType = vehicleTypesWeighted[Math.floor(Math.random() * vehicleTypesWeighted.length)];

      // Possíveis localizações iniciais para simulação
      const possibleLocations: AccessLog['location'][] = [
        'Triagem',
        'Em Rota p/ PC1',
        'PC1',
        'Em Rota p/ Terminal',
        'Terminal',
      ];
      const randomLocation = possibleLocations[Math.floor(Math.random() * possibleLocations.length)];

      let initialLocation = randomLocation;
      let pc1Time: string | undefined = undefined;
      let terminalTime: string | undefined = undefined;

      if (randomVehicleType === 'Cegonha') {
        initialLocation = 'Pátio Público';
      } else {
        // Set timestamps based on initial location for more realistic simulation
        if (randomLocation === 'PC1' || randomLocation === 'Em Rota p/ Terminal' || randomLocation === 'Terminal') {
          pc1Time = new Date(Date.now() - Math.random() * 60 * 1000).toISOString(); // PC1 time in the last minute
        }
        if (randomLocation === 'Terminal') {
          terminalTime = new Date(Date.now() - Math.random() * 30 * 1000).toISOString(); // Terminal time in the last 30 seconds
        }
      }

      // Add new driver if not already existing (simulated)
      if (!drivers.some(d => d.document === randomCpf)) {
        addDriver({ id: '', name: randomName, document: randomCpf });
      }

      setAccessLogs(prevLogs => [...prevLogs, {
        id: String(prevLogs.length + 1),
        plate: randomPlate,
        document: randomCpf,
        driverName: randomName,
        destination: randomDestination,
        entryTimestamp: new Date().toISOString(),
        vehicleType: randomVehicleType,
        location: initialLocation,
        pc1Timestamp: pc1Time,
        terminalTimestamp: terminalTime,
      }]);
    }, 5000); // Generate a new entry every 5 seconds

    return () => clearInterval(interval);
  }, [drivers]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAccessLogs(prevLogs => prevLogs.map(log => {
        if (log.exitTimestamp || log.location === 'Pátio Público') return log; // Already exited or in public patio

        let newLog = { ...log };

        // Simulate movement through stages
        if (newLog.location === 'Triagem' && Math.random() < 0.5) {
          newLog.location = 'Em Rota p/ PC1';
        } else if (newLog.location === 'Em Rota p/ PC1' && Math.random() < 0.5) {
          newLog.pc1Timestamp = new Date().toISOString();
          newLog.location = 'PC1';
        } else if (newLog.location === 'PC1' && Math.random() < 0.5) {
          newLog.location = 'Em Rota p/ Terminal';
        } else if (newLog.location === 'Em Rota p/ Terminal' && Math.random() < 0.5) {
          newLog.terminalTimestamp = new Date().toISOString();
          newLog.location = 'Terminal';
        } else if (newLog.location === 'Terminal' && Math.random() < 0.5) { // Chance de sair do terminal
          newLog.exitTimestamp = new Date().toISOString();
          newLog.location = 'Saiu';
        }
        return newLog;
      }));
    }, 7000); // Simulate movement every 7 seconds

    return () => clearInterval(interval);
  }, [accessLogs]);

  return (
    <AppContext.Provider value={{
      drivers, vehicles, accessLogs,
      addDriver, addVehicle, addAccessLog,
      updateDriver, updateVehicle, deleteDriver, deleteVehicle,
      markVehicleExit, markVehicleAtPC1, markVehicleAtTerminal, updateVehicleLocation
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};