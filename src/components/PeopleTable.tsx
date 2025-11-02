import { useState, useEffect } from 'react';
import type { Person } from '../types/person';
import { personService } from '../services/personService';
import { PersonDetailsModal } from './PersonDetailsModal';

export function PeopleTable() {
  const [people, setPeople] = useState<Person[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadPeople();
  }, []);

  useEffect(() => {
    if (filter.trim() === '') {
      setFilteredPeople(people);
    } else {
      const searchTerm = filter.toLowerCase();
      const filtered = people.filter(
        (person) =>
          person.nome.toLowerCase().includes(searchTerm) ||
          person.cpf.includes(searchTerm) ||
          person.email.toLowerCase().includes(searchTerm)
      );
      setFilteredPeople(filtered);
    }
  }, [filter, people]);

  const loadPeople = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await personService.getAll();
      setPeople(data || []);
      setFilteredPeople(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Erro ao carregar pessoas';
      setError(errorMessage);
      console.error('Erro ao carregar pessoas:', err);
      // Mesmo com erro, deixa a tabela disponível (vazia) para não ficar travado
      setPeople([]);
      setFilteredPeople([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (person: Person) => {
    setSelectedPerson(person);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPerson(null);
    loadPeople(); // Recarrega para atualizar dados após edição/exclusão
  };

  const formatCPF = (cpf: string) => {
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) return cpf;
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p>Carregando pessoas...</p>
          <p className="text-muted">Carregando dados da API Random User...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Lista de Pessoas</h2>
        <button onClick={loadPeople} className="btn btn-primary">
          Atualizar
        </button>
      </div>

      {error && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <strong>⚠️ {error}</strong>
          <button type="button" className="btn-close" onClick={loadPeople} aria-label="Close"></button>
        </div>
      )}

      <div className="mb-3">
        <input
          type="text"
          placeholder="Filtrar por nome, CPF ou e-mail..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Endereço</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredPeople.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-muted">
                  {filter ? 'Nenhuma pessoa encontrada com os filtros aplicados' : 'Nenhuma pessoa cadastrada'}
                </td>
              </tr>
            ) : (
              filteredPeople.map((person) => (
                <tr key={person.id}>
                  <td>{person.nome}</td>
                  <td>{formatCPF(person.cpf)}</td>
                  <td>{person.email}</td>
                  <td>{formatPhone(person.telefone)}</td>
                  <td>{person.endereco}</td>
                  <td>
                    <span className={`badge ${person.status === 'ativo' ? 'bg-success' : 'bg-secondary'}`}>
                      {person.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleViewDetails(person)}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedPerson && (
        <PersonDetailsModal
          person={selectedPerson}
          onClose={handleModalClose}
          onUpdate={loadPeople}
        />
      )}
    </div>
  );
}

