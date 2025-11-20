"use client"

import React, { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { api } from '@/services/api';
import axios from 'axios';

interface ImagemAnuncio {
  id: number;
  url: string;
}

interface Usuario {
  nome: string;
  cidade: string;
  estado: string;
}

interface Categoria {
  id: number,
  nome: string,
}

interface Categoria {
  nome: string;
}

interface Anuncio {
  id: number;
  titulo: string;
  descricao: string;
  preco: number;
  categoria: Categoria;
  createdAt: string;
  imagens: ImagemAnuncio[];
  usuario: Usuario;
}

interface Estado {
  id: number;
  sigla: string;
  nome: string;
}

interface Cidade {
  id: number;
  nome: string
}

export default function AnunciosPage() {

  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [estados, setEstados] = useState<Estado[]>([])
  const [cidades, setCidades] = useState<Cidade[]>([])

  const [busca, setBusca] = useState('');
  const [filtroCidade, setFiltroCidade] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroCat, setFiltroCat] = useState("")

  const fetchAnuncios = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        catId: filtroCat,
        q: busca || undefined,
        cidade: filtroCidade || undefined,
        estado: filtroEstado || undefined,
      };

      const response = await api.get('/anuncio', { params });
      setAnuncios(response.data);
    } catch (err) {
      console.error('Erro ao buscar anúncios:', err);
      setError('Falha ao carregar os anúncios. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEstados = async () => {
    try {
      const response = await axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
      setEstados(response.data)
    } catch (e) {
      console.log(e)
      setError("Erro ao buscar estados")
    }
  }

  const fetchCategorias = async () => {
    try {
      const response = await api.get("/categoria")
      setCategorias(response.data)
    } catch (e) {
      console.log(e)
      setError("Erro ao buscar categorias")
    }
  }

  const fetchMunicipio = async () => {
    try {
      const estadoSelecionado = estados.find((estado) => estado.nome === filtroEstado)

      const response = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado?.sigla}/distritos?orderBy=nome`)
      setCidades(response.data)
    } catch (e) {
      console.log(e)
      setError("Erro ao buscar estados")
    }
  }

  useEffect(() => {
    (async () => {
      await Promise.all([fetchEstados(), fetchAnuncios(), fetchCategorias()])
    })()
  }, []);

  useEffect(() => {
    (async () => {
      await fetchMunicipio()
    })()
  }, [filtroEstado])

  const handleFiltrar = (e: FormEvent) => {
    e.preventDefault();
    fetchAnuncios();
  };

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(value));
  };

  const clearFiltros = () => {
    setFiltroEstado("")
    setFiltroCidade("")
    setBusca("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">

        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <form onSubmit={handleFiltrar} className="grid grid-cols-1 lg:flex gap-4">

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">O que você procura?</label>
              <input
                type="text"
                placeholder="Ex: Encanador, iPhone, Bolo..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                name="Categoria"
                id="Categoria"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={filtroCat} onChange={(e) => setFiltroCat(e.target.value)}
              >
                <option value="" disabled>Selecione</option>
                {estados &&
                  categorias.map((categoria) => (
                    <option value={categoria.id}>{categoria.nome}</option>
                  ))
                }
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                name="Estado"
                id="Estado"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="" disabled>Selecione</option>
                {estados &&
                  estados.map((estado) => (
                    <option value={estado.nome}>{estado.nome}</option>
                  ))
                }
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
              <select
                name="Cidade"
                id="Cidade"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={filtroCidade} onChange={(e) => setFiltroCidade(e.target.value)}
              >
                <option value="" disabled>Selecione</option>
                {cidades &&
                  cidades.map((cidade) => (
                    <option value={cidade.nome}>{cidade.nome}</option>
                  ))
                }
              </select>
            </div>

            <div className='flex items-end'>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition h-10"
              >
                Buscar
              </button>
            </div>

            <div className='flex items-end'>
              <button
                // type="button"
                onClick={clearFiltros}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition h-10"
              >
                Limpar
              </button>
            </div>

          </form>
        </div>


        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md h-80 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-600 bg-red-50 rounded-lg border border-red-200">
            <p>{error}</p>
            <button onClick={fetchAnuncios} className="mt-2 text-indigo-600 underline">Tentar novamente</button>
          </div>
        ) : anuncios.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-xl">Nenhum anúncio encontrado 😕</p>
            <p className="text-sm mt-2">Tente mudar os filtros ou a localização.</p>
          </div>
        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {anuncios.map((anuncio) => (
              <Link href={`/anuncio/${anuncio.id}`} key={anuncio.id} className="group">
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden h-full flex flex-col">

                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {anuncio.imagens && anuncio.imagens.length > 0 ? (
                      <img
                        src={process.env.NEXT_PUBLIC_API_URL + "/uploads/" + anuncio.imagens[0].url}
                        alt={anuncio.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Sem+Imagem';
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <span className="text-sm">Sem imagem</span>
                      </div>
                    )}

                    <span className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                      {anuncio.categoria.nome}
                    </span>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-1 group-hover:text-indigo-600 transition">
                      {anuncio.titulo}
                    </h3>

                    <p className="text-2xl font-bold text-gray-900 mb-2">
                      {formatMoney(anuncio.preco)}
                    </p>

                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                      {anuncio.descricao}
                    </p>

                    <div className="pt-3 border-t border-gray-100 flex justify-between items-end text-xs text-gray-400">
                      <div className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        {anuncio.usuario.cidade} - {anuncio.usuario.estado}
                      </div>
                      <span>
                        {new Date(anuncio.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}