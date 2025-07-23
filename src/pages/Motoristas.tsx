
import { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatDocument } from '../utils/formatters';

const Motoristas = () => {
  const { drivers, addDriver, updateDriver, deleteDriver } = useAppContext();
  const [filtroNome, setFiltroNome] = useState('');
  const [novoMotorista, setNovoMotorista] = useState<{ id: string; name: string; document: string; plate?: string }>({ id: '', name: '', document: '', plate: undefined });
  const [editingId, setEditingId] = useState<string | null>(null);

  const motoristasFiltrados = useMemo(() =>
    drivers.filter(m => m.name.toLowerCase().includes(filtroNome.toLowerCase())),
    [drivers, filtroNome]
  );

  useEffect(() => {
    if (editingId) {
      const driverToEdit = drivers.find(driver => driver.id === editingId);
      if (driverToEdit) {
        setNovoMotorista({ ...driverToEdit, plate: driverToEdit.plate || '' });
      }
    }
  }, [editingId, drivers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'document') {
      setNovoMotorista(prev => ({ ...prev, [name]: formatDocument(value) }));
    } else {
      setNovoMotorista(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddOrUpdateMotorista = () => {
    if (!novoMotorista.name || !novoMotorista.document) {
      alert('Nome e Documento são obrigatórios.');
      return;
    }

    if (editingId) {
      updateDriver(novoMotorista);
      setEditingId(null);
    } else {
      addDriver(novoMotorista);
    }
    setNovoMotorista({ id: '', name: '', document: '' }); // Limpa o formulário
  };

  const handleEditClick = (driverId: string) => {
    setEditingId(driverId);
  };

  const handleDeleteClick = (driverId: string) => {
    if (confirm('Tem certeza que deseja excluir este motorista?')) {
      deleteDriver(driverId);
    }
  };

  return (
    <div>
      <h1 className="h2 mb-4">Gestão de Motoristas</h1>

      {/* Formulário de Cadastro/Edição */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-light">
          <h3 className="mb-0">{editingId ? 'Editar Motorista' : 'Cadastrar Novo Motorista'}</h3>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="name" className="form-label">Nome Completo</label>
              <input type="text" className="form-control" id="name" name="name" value={novoMotorista.name} onChange={handleInputChange} />
            </div>
            <div className="col-md-4">
              <label htmlFor="document" className="form-label">Documento (CPF/CNH)</label>
              <input type="text" className="form-control" id="document" name="document" value={novoMotorista.document} onChange={handleInputChange} />
            </div>
          </div>
        </div>
        <div className="card-footer text-end">
          <button className="btn btn-primary" onClick={handleAddOrUpdateMotorista}>
            {editingId ? 'Atualizar Motorista' : 'Adicionar Motorista'}
          </button>
          {editingId && (
            <button className="btn btn-secondary ms-2" onClick={() => { setEditingId(null); setNovoMotorista({ id: '', name: '', document: '', plate: '' }); }}>
              Cancelar Edição
            </button>
          )}
        </div>
      </div>

      {/* Tabela de Motoristas */}
      <div className="card shadow-sm">
        <div className="card-header bg-light">
          <h3 className="mb-0">Motoristas Cadastrados</h3>
        </div>
        <div className="card-body">
          <input 
            type="text" 
            className="form-control mb-3" 
            placeholder="Buscar por nome..." 
            value={filtroNome}
            onChange={e => setFiltroNome(e.target.value)}
          />
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Nome</th>
                  <th>Documento</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {motoristasFiltrados.map(m => (
                  <tr key={m.id}>
                    <td><span className="fw-bold">{m.name}</span></td>
                    <td>{m.document}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditClick(m.id)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClick(m.id)}>Excluir</button>
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

export default Motoristas;
