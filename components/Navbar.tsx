"use client"

import { removeAuthToken } from '@/services/api';
import React, { useState, useEffect } from 'react';
import { text } from 'stream/consumers';

// --- Hook useIsClient (Incoporado para garantir funcionamento) ---
function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient;
}

export default function Navbar() {
  const isClient = useIsClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const rotas = [
    {
      label: "Ver anuncios",
      path: "/home"
    },
    {
      label: "Anunciar",
      path: "/criar-anuncio"
    },
    {
      label: "Meus anuncios",
      path: "/meus-anuncios"
    },
    {
      label: "Sair da conta",
      path: "/login"
    },

  ]

  // Verifica login apenas no cliente
  useEffect(() => {
    if (isClient) {
      const token = localStorage.getItem('auth.token');
      setIsLoggedIn(!!token);
    }
  }, [isClient]);

  // Se não estiver no cliente ainda, renderiza um esqueleto ou nada para evitar erro de hidratação
  if (!isClient) return null;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* desktop */}
          <div className="flex items-center justify-between w-full">
            <p className="shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600">
                Conecta
              </span>
              <span className="text-2xl font-bold text-gray-700">Negócios</span>
            </p>

            <div className="hidden md:ml-8 md:flex md:space-x-4">
              {rotas.map((rota) => (
                <a
                  key={rota.path}
                  href={rota.path}
                  className={`text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors ${rota.path === "/login" ? "text-red-600" : "text-gray-600"}`}
                >
                  {rota.label}
                </a>
              ))}
            </div>
          </div>

          {/* Mobile - botao de abrir*/}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile (Dropdown) */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {rotas.map((rota) => (
              <a
                key={rota.path}
                href={rota.path}
                className={`block px-3 py-2 rounded-md text-base font-medium hover:text-indigo-600 hover:bg-gray-50 ${rota.path === "/login" ? "text-red-600" : "text-gray-600"}`}
              >
                {rota.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}