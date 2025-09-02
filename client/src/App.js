// client/src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CustomerListPage from './pages/CustomerListPage';
import CustomerFormPage from './pages/CustomerFormPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import NotFoundPage from './pages/NotFoundPage'; 
import LoadingScreen from './components/LoadingScreen';

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <LoadingScreen />
        {/* Navigation Bar */}
        <nav className="bg-gray-800 text-white p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Qwipo Customers</h1>
            <div>
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">Customer List</Link>
              <Link to="/add" className="ml-4 px-3 py-2 rounded-md text-sm font-medium bg-blue-500 hover:bg-blue-600 transition-colors">Add Customer</Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto p-4 md:p-6">
          <Routes>
            <Route path="/" element={<CustomerListPage />} />
            <Route path="/add" element={<CustomerFormPage />} />
            <Route path="/edit/:id" element={<CustomerFormPage />} />
            <Route path="/customer/:id" element={<CustomerDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;