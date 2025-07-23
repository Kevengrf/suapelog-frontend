import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { FaBars } from "react-icons/fa";
import '../styles/App.css';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`d-flex ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar />
      
      {/* Overlay para fechar a sidebar no mobile */}
      <div className="overlay d-lg-none" onClick={toggleSidebar}></div>

      <div id="content" className="flex-grow-1">
        {/* Cabeçalho superior para mobile */}
        <header className="top-header d-lg-none">
          <button className="btn btn-link text-white" onClick={toggleSidebar}>
            <FaBars size={24} />
          </button>
          <h4 className="mb-0 ms-3">SuapeLog</h4>
        </header>

        <main className="p-4">
          <Outlet /> {/* As páginas serão renderizadas aqui */}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;