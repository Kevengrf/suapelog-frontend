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
  location: 'Triagem' | 'Em Rota p/ PC1' | 'PC1' | 'Em Rota p/ Terminal' | 'Saiu' | 'Pátio Público';
  pc1Timestamp?: string;
  // New fields for the hackathon journey
  appointmentTime?: string; // Scheduled arrival time
  appointmentWindowStart?: string; // Start of appointment window
  appointmentWindowEnd?: string; // End of appointment window
  patioEntryTimestamp?: string; // Time entered patio
  patioExitTimestamp?: string; // Time exited patio
  pc1EntryTimestamp?: string; // Time entered PC1
  pc1ExitTimestamp?: string; // Time exited PC1
  pegasusLinkedData?: boolean; // Simulation of data linkage with Pegasus
  patioColor?: 'green' | 'yellow' | 'red'; // Simulated patio color
  speedAverage?: number; // Simulated average speed
}

interface AppContextType {
  drivers: Driver[];
  vehicles: Vehicle[];
  accessLogs: AccessLog[];
  addDriver: (driver: Driver) => void;
  addVehicle: (vehicle: Vehicle) => void;
  addAccessLog: (log: Omit<AccessLog, 'id' | 'entryTimestamp' | 'exitTimestamp' | 'pc1Timestamp' | 'patioEntryTimestamp' | 'patioExitTimestamp' | 'pc1EntryTimestamp' | 'pc1ExitTimestamp' | 'pegasusLinkedData' | 'patioColor' | 'speedAverage'>) => void;
  markVehicleExit: (logId: string) => void;
  updateDriver: (driver: Driver) => void;
  updateVehicle: (vehicle: Vehicle) => void;
  deleteDriver: (id: string) => void;
  deleteVehicle: (id: string) => void;
  markVehicleAtPC1: (logId: string) => void;
  updateVehicleLocation: (logId: string, newLocation: AccessLog['location']) => void;
  // New functions for updating specific timestamps and data
  markVehiclePatioEntry: (logId: string) => void;
  markVehiclePatioExit: (logId: string) => void;
  markVehiclePC1Entry: (logId: string) => void;
  markVehiclePC1Exit: (logId: string) => void;
  updatePegasusLink: (logId: string, linked: boolean) => void;
  updatePatioColor: (logId: string, color: AccessLog['patioColor']) => void;
  updateSpeedAverage: (logId: string, speed: number) => void;
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

  const addAccessLog = (log: Omit<AccessLog, 'id' | 'entryTimestamp' | 'exitTimestamp' | 'pc1Timestamp' | 'patioEntryTimestamp' | 'patioExitTimestamp' | 'pc1EntryTimestamp' | 'pc1ExitTimestamp' | 'pegasusLinkedData' | 'patioColor' | 'speedAverage'>) => {
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

  const updateVehicleLocation = (logId: string, newLocation: AccessLog['location']) => {
    setAccessLogs((prevLogs) =>
      prevLogs.map((log) =>
        log.id === logId ? { ...log, location: newLocation } : log
      )
    );
  };

  // New functions for updating specific timestamps and data
  const markVehiclePatioEntry = (logId: string) => {
    setAccessLogs(prevLogs => prevLogs.map(log => log.id === logId ? { ...log, patioEntryTimestamp: new Date().toISOString() } : log));
  };

  const markVehiclePatioExit = (logId: string) => {
    setAccessLogs(prevLogs => prevLogs.map(log => log.id === logId ? { ...log, patioExitTimestamp: new Date().toISOString() } : log));
  };

  const markVehiclePC1Entry = (logId: string) => {
    setAccessLogs(prevLogs => prevLogs.map(log => log.id === logId ? { ...log, pc1EntryTimestamp: new Date().toISOString() } : log));
  };

  const markVehiclePC1Exit = (logId: string) => {
    setAccessLogs(prevLogs => prevLogs.map(log => log.id === logId ? { ...log, pc1ExitTimestamp: new Date().toISOString() } : log));
  };

  const updatePegasusLink = (logId: string, linked: boolean) => {
    setAccessLogs(prevLogs => prevLogs.map(log => log.id === logId ? { ...log, pegasusLinkedData: linked } : log));
  };

  const updatePatioColor = (logId: string, color: AccessLog['patioColor']) => {
    setAccessLogs(prevLogs => prevLogs.map(log => log.id === logId ? { ...log, patioColor: color } : log));
  };

  const updateSpeedAverage = (logId: string, speed: number) => {
    setAccessLogs(prevLogs => prevLogs.map(log => log.id === logId ? { ...log, speedAverage: speed } : log));
  };

  // Automated data generation for demo
  useEffect(() => {
    const interval = setInterval(() => {
      const randomPlate = generateRandomPlate();
      // Removed: randomName, randomCpf, randomDestination
      
      // Ajuste na probabilidade de tipos de veículo
      const vehicleTypesWeighted: AccessLog['vehicleType'][] = [];
      for(let i = 0; i < 7; i++) vehicleTypesWeighted.push('Normal'); // 70%
      for(let i = 0; i < 2; i++) vehicleTypesWeighted.push('Serviço'); // 20%
      vehicleTypesWeighted.push('Cegonha'); // 10%

      const randomVehicleType = vehicleTypesWeighted[Math.floor(Math.random() * vehicleTypesWeighted.length)];

      // Simulate appointment time and window
      const now = new Date();
      const appointment = new Date(now.getTime() + (Math.random() * 60 - 30) * 60 * 1000); // +/- 30 min from now
      const windowStart = new Date(appointment.getTime() - 15 * 60 * 1000); // 15 min before
      const windowEnd = new Date(appointment.getTime() + 15 * 60 * 1000); // 15 min after

      // Possíveis localizações iniciais para simulação
      const possibleLocations: AccessLog['location'][] = [
        'Triagem',
        'Em Rota p/ PC1',
        'PC1',
        'Em Rota p/ Terminal',
      ];
      const randomLocation = possibleLocations[Math.floor(Math.random() * possibleLocations.length)];

      let initialLocation = randomLocation;
      let patioEntry: string | undefined = undefined;
      let patioExit: string | undefined = undefined;
      let pc1Entry: string | undefined = undefined;
      let pc1Exit: string | undefined = undefined;

      if (randomVehicleType === 'Cegonha') {
        initialLocation = 'Pátio Público';
      } else {
        // Set timestamps based on initial location for more realistic simulation
        if (randomLocation === 'Triagem') {
          patioEntry = new Date().toISOString();
        }
        if (randomLocation === 'Em Rota p/ PC1' || randomLocation === 'PC1' || randomLocation === 'Em Rota p/ Terminal') {
          patioEntry = new Date(Date.now() - Math.random() * 120 * 1000).toISOString(); // Patio entry in the last 2 minutes
          patioExit = new Date(Date.now() - Math.random() * 60 * 1000).toISOString(); // Patio exit in the last minute
        }
        if (randomLocation === 'PC1' || randomLocation === 'Em Rota p/ Terminal') {
          pc1Entry = new Date(Date.now() - Math.random() * 60 * 1000).toISOString(); // PC1 entry in the last minute
        }
        if (randomLocation === 'Em Rota p/ Terminal') {
          pc1Exit = new Date(Date.now() - Math.random() * 30 * 1000).toISOString(); // PC1 exit in the last 30 seconds
        }
      }

      // Add new driver if not already existing (simulated)
      // Removed: if (!drivers.some(d => d.document === randomCpf)) { addDriver({ id: '', name: randomName, document: randomCpf }); }

      setAccessLogs(prevLogs => [...prevLogs, {
        id: String(prevLogs.length + 1),
        plate: randomPlate,
        // Removed: document: randomCpf,
        // Removed: driverName: randomName,
        // Removed: destination: randomDestination,
        entryTimestamp: new Date().toISOString(),
        vehicleType: randomVehicleType,
        location: initialLocation,
        appointmentTime: appointment.toISOString(),
        appointmentWindowStart: windowStart.toISOString(),
        appointmentWindowEnd: windowEnd.toISOString(),
        patioEntryTimestamp: patioEntry,
        patioExitTimestamp: patioExit,
        pc1EntryTimestamp: pc1Entry,
        pc1ExitTimestamp: pc1Exit,
        pegasusLinkedData: Math.random() > 0.2, // 80% chance of being linked
        patioColor: Math.random() > 0.7 ? 'red' : (Math.random() > 0.5 ? 'yellow' : 'green'), // Random patio color
        speedAverage: Math.floor(Math.random() * 40) + 10, // Random speed between 10 and 50 km/h
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
          newLog.patioEntryTimestamp = new Date().toISOString(); // Mark patio entry when leaving triagem
        } else if (newLog.location === 'Em Rota p/ PC1' && Math.random() < 0.5) {
          newLog.pc1EntryTimestamp = new Date().toISOString();
          newLog.location = 'PC1';
          newLog.patioExitTimestamp = new Date().toISOString(); // Mark patio exit when entering PC1
        } else if (newLog.location === 'PC1' && Math.random() < 0.5) {
          newLog.pc1ExitTimestamp = new Date().toISOString();
          newLog.location = 'Em Rota p/ Terminal';
        } else if (newLog.location === 'Em Rota p/ Terminal' && Math.random() < 0.5) {
          // No terminalEntryTimestamp, just move to Saiu or stay in Em Rota p/ Terminal
          newLog.exitTimestamp = new Date().toISOString(); // Directly exit from Em Rota p/ Terminal
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
      markVehicleExit, markVehicleAtPC1, updateVehicleLocation,
      markVehiclePatioEntry, markVehiclePatioExit, markVehiclePC1Entry, markVehiclePC1Exit,
      updatePegasusLink, updatePatioColor, updateSpeedAverage
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
