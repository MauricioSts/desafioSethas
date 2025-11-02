import { PeopleTable } from '../components/PeopleTable';

export function Tabela() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="display-4">Tabela de Pessoas</h1>
        <p className="lead text-muted">Visualize e gerencie todas as pessoas cadastradas</p>
      </div>
      <PeopleTable />
    </div>
  );
}
