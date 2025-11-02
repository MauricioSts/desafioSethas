import { PeopleTable } from '../components/PeopleTable';

export function Dashboard() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="display-4">Dashboard</h1>
        <p className="lead text-muted">Gerencie e visualize todas as pessoas cadastradas no sistema</p>
      </div>
      <PeopleTable />
    </div>
  );
}

