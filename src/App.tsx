import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/SideBar';
import { Dashboard } from './pages/Dashboard';
import { Tabela } from './pages/Tabela';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <BrowserRouter>
      <div className="d-flex vh-100">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className={`flex-grow-1 p-4 ${sidebarOpen ? '' : ''}`} style={{ marginLeft: sidebarOpen ? '250px' : '0', transition: 'margin-left 0.3s' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tabela" element={<Tabela />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
