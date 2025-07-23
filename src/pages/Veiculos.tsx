import { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const Veiculos = () => {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useAppContext();
  const [filtroPlaca, setFiltroPlaca] = useState('');
  const [novoVeiculo, setNovoVeiculo] = useState({ id: '', plate: '', model: '', color: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const veiculosFiltrados = useMemo(() =>
    vehicles.filter(v => v.plate.toLowerCase().includes(filtroPlaca.toLowerCase())),
    [vehicles, filtroPlaca]
  );

  useEffect(() => {
    if (editingId) {
      const vehicleToEdit = vehicles.find(vehicle => vehicle.id === editingId);
      if (vehicleToEdit) {
        setNovoVeiculo(vehicleToEdit);
      }
    }
  }, [editingId, vehicles]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNovoVeiculo(prev => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdateVeiculo = () => {
    if (!novoVeiculo.plate) {
      alert('Placa é obrigatória.');
      return;
    }

    if (editingId) {
      updateVehicle(novoVeiculo);
      setEditingId(null);
    } else {
      addVehicle(novoVeiculo);
    }
    setNovoVeiculo({ id: '', plate: '', model: '', color: '' }); // Limpa o formulário
  };

  const handleEditClick = (vehicleId: string) => {
    setEditingId(vehicleId);
  };

  const handleDeleteClick = (vehicleId: string) => {
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
      deleteVehicle(vehicleId);
    }
  };

  return (
    <div>
      <h1 className="h2 mb-4">Gestão de Veículos</h1>

      {/* Formulário de Cadastro/Edição */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-light">
          <h3 className="mb-0">{editingId ? 'Editar Veículo' : 'Cadastrar Novo Veículo'}</h3>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="plate" className="form-label">Placa</label>
              <input type="text" className="form-control" id="plate" name="plate" value={novoVeiculo.plate} onChange={handleInputChange} />
            </div>
            <div className="col-md-4">
              <label htmlFor="model" className="form-label">Modelo</label>
              <input type="text" className="form-control" id="model" name="model" value={novoVeiculo.model} onChange={handleInputChange} />
            </div>
            <div className="col-md-4">
              <label htmlFor="color" className="form-label">Cor</label>
              <input type="text" className="form-control" id="color" name="color" value={novoVeiculo.color} onChange={handleInputChange} />
            </div>
          </div>
        </div>
        <div className="card-footer text-end">
          <button className="btn btn-primary" onClick={handleAddOrUpdateVeiculo}>
            {editingId ? 'Atualizar Veículo' : 'Adicionar Veículo'}
          </button>
          {editingId && (
            <button className="btn btn-secondary ms-2" onClick={() => { setEditingId(null); setNovoVeiculo({ id: '', plate: '', model: '', color: '' }); }}>
              Cancelar Edição
            </button>
          )}
        </div>
      </div>

      {/* Tabela de Veículos */}
      <div className="card shadow-sm">
        <div className="card-header bg-light">
          <h3 className="mb-0">Veículos Cadastrados</h3>
        </div>
        <div className="card-body">
          <input 
            type="text" 
            className="form-control mb-3" 
            placeholder="Buscar por placa..." 
            value={filtroPlaca}
            onChange={e => setFiltroPlaca(e.target.value)}
          />
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Placa</th>
                  <th>Modelo</th>
                  <th>Cor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {veiculosFiltrados.map(v => (
                  <tr key={v.id}>
                    <td><span className="fw-bold">{v.plate}</span></td>
                    <td>{v.model}</td>
                    <td>{v.color}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditClick(v.id)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClick(v.id)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Veiculos;
