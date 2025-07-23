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
}

interface AppContextType {
  drivers: Driver[];
  vehicles: Vehicle[];
  accessLogs: AccessLog[];
  addDriver: (driver: Driver) => void;
  addVehicle: (vehicle: Vehicle) => void;
  addAccessLog: (log: Omit<AccessLog, 'id' | 'entryTimestamp'>) => void;
  markVehicleExit: (logId: string) => void;
  updateDriver: (driver: Driver) => void;
  updateVehicle: (vehicle: Vehicle) => void;
  deleteDriver: (id: string) => void;
  deleteVehicle: (id: string) => void;
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

  const addAccessLog = (log: Omit<AccessLog, 'id' | 'entryTimestamp'>) => {
    setAccessLogs((prevLogs) => [...prevLogs, { ...log, id: String(prevLogs.length + 1), entryTimestamp: new Date().toISOString() }]);
  };

  const markVehicleExit = (logId: string) => {
    setAccessLogs((prevLogs) =>
      prevLogs.map((log) =>
        log.id === logId ? { ...log, exitTimestamp: new Date().toISOString() } : log
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

      // Add new driver if not already existing (simulated)
      if (!drivers.some(d => d.document === randomCpf)) {
        addDriver({ id: '', name: randomName, document: randomCpf });
      }

      addAccessLog({
        plate: randomPlate,
        document: randomCpf,
        driverName: randomName,
        destination: randomDestination,
      });
    }, 5000); // Generate a new entry every 5 seconds

    return () => clearInterval(interval);
  }, [addAccessLog, addDriver, drivers]);

  useEffect(() => {
    const interval = setInterval(() => {
      const vehiclesInPatio = accessLogs.filter(log => !log.exitTimestamp);
      if (vehiclesInPatio.length > 0) {
        const randomIndex = Math.floor(Math.random() * vehiclesInPatio.length);
        const logToExit = vehiclesInPatio[randomIndex];
        // Randomly decide if a vehicle should exit (e.g., 30% chance)
        if (Math.random() < 0.3) {
          markVehicleExit(logToExit.id);
        }
      }
    }, 5000); // Check every 5 seconds for exits

    return () => clearInterval(interval);
  }, [accessLogs, markVehicleExit]);

  return (
    <AppContext.Provider value={{ drivers, vehicles, accessLogs, addDriver, addVehicle, addAccessLog, updateDriver, updateVehicle, deleteDriver, deleteVehicle, markVehicleExit }}>
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
