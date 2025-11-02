import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      <div 
        className={`bg-dark text-white position-fixed h-100 ${isOpen ? 'w-auto' : 'w-auto'}`}
        style={{ 
          width: isOpen ? '250px' : '60px',
          transition: 'width 0.3s',
          zIndex: 1000,
          left: 0,
          top: 0
        }}
      >
        <div className="p-3 d-flex justify-content-between align-items-center border-bottom">
          {isOpen && <h2 className="mb-0 h5">CORP.</h2>}
          <button 
            className="btn btn-link text-white p-0" 
            onClick={onToggle}
            style={{ textDecoration: 'none' }}
          >
            {isOpen ? '←' : '→'}
          </button>
        </div>
        <nav className="p-2">
          <Link
            to="/dashboard"
            className={`d-block p-3 text-white text-decoration-none rounded mb-2 ${location.pathname === '/dashboard' ? 'bg-primary' : 'hover-bg-secondary'}`}
            style={{ transition: 'background-color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = location.pathname === '/dashboard' ? '' : 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = location.pathname === '/dashboard' ? '' : 'transparent'}
          >
            <span>Dashboard</span>
          </Link>
          <Link
            to="/tabela"
            className={`d-block p-3 text-white text-decoration-none rounded mb-2 ${location.pathname === '/tabela' ? 'bg-primary' : 'hover-bg-secondary'}`}
            style={{ transition: 'background-color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = location.pathname === '/tabela' ? '' : 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = location.pathname === '/tabela' ? '' : 'transparent'}
          >
            <span>Tabela</span>
          </Link>
        </nav>
      </div>
    </>
  );
}

