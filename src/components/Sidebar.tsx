
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaTruck, FaSignOutAlt, FaUsers, FaIdCard, FaChartBar } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/triagem-entrada', icon: <FaTruck />, label: 'Triagem: Entrada' },
    { path: '/triagem-saida', icon: <FaSignOutAlt />, label: 'Triagem: Saída' },
    { path: '/motoristas', icon: <FaUsers />, label: 'Motoristas' },
    { path: '/veiculos', icon: <FaIdCard />, label: 'Veículos' },
    { path: '/admin/relatorios/permanencia', icon: <FaChartBar />, label: 'Relatório: Permanência' },
    { path: '/admin/relatorios/percurso', icon: <FaChartBar />, label: 'Relatório: Percurso PC1-Terminal' },
    { path: '/admin/relatorios/patio-pc1', icon: <FaChartBar />, label: 'Relatório: Pátio-PC1' },
    { path: '/admin/relatorios/historico-detalhado', icon: <FaChartBar />, label: 'Relatório: Histórico Detalhado' },
    { path: '/admin/relatorios/auditoria', icon: <FaChartBar />, label: 'Relatório: Auditoria' },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h3>SuapeLog</h3>
      </div>
      <ul className="list-unstyled components">
        {navItems.map((item) => (
          <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
            <Link to={item.path}>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
