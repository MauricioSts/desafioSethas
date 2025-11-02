import { useState, useEffect } from 'react';
import type { Person } from '../types/person';
import { personService } from '../services/personService';

interface PersonDetailsModalProps {
  person: Person;
  onClose: () => void;
  onUpdate: () => void;
}

export function PersonDetailsModal({
  person: initialPerson,
  onClose,
  onUpdate,
}: PersonDetailsModalProps) {
  const [person, setPerson] = useState<Person>(initialPerson);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPerson, setEditedPerson] = useState<Person>(initialPerson);

  useEffect(() => {
    setPerson(initialPerson);
    setEditedPerson(initialPerson);
    // Tenta buscar dados atualizados do cache, mas usa initialPerson como fallback
    loadPersonDetails();
  }, [initialPerson.id]);

  const loadPersonDetails = async () => {
    try {
      setError(null);
      // Tenta buscar do cache (pode ter sido atualizado)
      const data = await personService.getById(initialPerson.id);
      setPerson(data);
      setEditedPerson(data);
    } catch (err) {
      // Se não encontrar no cache, usa o initialPerson que já foi setado
      console.warn('Pessoa não encontrada no cache, usando dados iniciais');
      setError(null); // Não mostra erro, pois temos os dados iniciais
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPerson(person);
    setError(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      const updated = await personService.update(person.id, editedPerson);
      setPerson(updated);
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar pessoa');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta pessoa?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await personService.delete(person.id);
      onClose();
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir pessoa');
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Person, value: string) => {
    setEditedPerson({ ...editedPerson, [field]: value });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
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

  const displayPerson = isEditing ? editedPerson : person;

  return (
    <div 
      className="modal fade show d-block" 
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
      tabIndex={-1}
    >
      <div className="modal-dialog modal-lg modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">Detalhes da Pessoa</h2>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>

          {error && (
            <div className="alert alert-danger m-3">
              <strong>⚠️ {error}</strong>
            </div>
          )}

          {loading && !person && (
            <div className="d-flex justify-content-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
            </div>
          )}

          {!loading && (
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-bold">Nome Completo</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedPerson.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    className="form-control"
                  />
                ) : (
                  <div className="form-control-plaintext">{person.nome}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">CPF</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedPerson.cpf}
                    onChange={(e) => handleChange('cpf', e.target.value)}
                    className="form-control"
                  />
                ) : (
                  <div className="form-control-plaintext">{formatCPF(person.cpf)}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">E-mail</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedPerson.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="form-control"
                  />
                ) : (
                  <div className="form-control-plaintext">{person.email}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Telefone</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedPerson.telefone}
                    onChange={(e) => handleChange('telefone', e.target.value)}
                    className="form-control"
                  />
                ) : (
                  <div className="form-control-plaintext">{formatPhone(person.telefone)}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Data de Nascimento</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedPerson.data_nascimento?.split('T')[0] || ''}
                    onChange={(e) => handleChange('data_nascimento', e.target.value)}
                    className="form-control"
                  />
                ) : (
                  <div className="form-control-plaintext">{formatDate(person.data_nascimento)}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Endereço</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedPerson.endereco}
                    onChange={(e) => handleChange('endereco', e.target.value)}
                    className="form-control"
                  />
                ) : (
                  <div className="form-control-plaintext">{person.endereco}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Data de Cadastro</label>
                <div className="form-control-plaintext">{formatDate(person.data_cadastro)}</div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Status</label>
                {isEditing ? (
                  <select
                    value={editedPerson.status}
                    onChange={(e) => handleChange('status', e.target.value as 'ativo' | 'inativo')}
                    className="form-select"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                ) : (
                  <div className="form-control-plaintext">
                    <span className={`badge ${person.status === 'ativo' ? 'bg-success' : 'bg-secondary'}`}>
                      {person.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="modal-footer">
            {isEditing ? (
              <>
                <button onClick={handleCancel} className="btn btn-secondary">
                  Cancelar
                </button>
                <button onClick={handleSave} className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Salvando...
                    </>
                  ) : (
                    'Salvar'
                  )}
                </button>
              </>
            ) : (
              <>
                <button onClick={handleDelete} className="btn btn-danger" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Excluindo...
                    </>
                  ) : (
                    'Excluir'
                  )}
                </button>
                <button onClick={handleEdit} className="btn btn-primary">
                  Editar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

