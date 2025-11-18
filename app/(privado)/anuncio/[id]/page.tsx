"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/services/api';


// --- Tipos ---
interface Imagem {
  id: number;
  url: string;
}

interface Categoria {
  id: number;
  nome: string;
  tipo: string;
}

interface Usuario {
  id: number;
  nome: string;
  cidade: string;
  estado: string;
  telefone: string;
}

interface AnuncioDetalhado {
  id: number;
  titulo: string;
  descricao: string;
  preco: number;
  createdAt: string;
  usuario: Usuario;
  categoria: Categoria;
  imagens: Imagem[];
}


export default function AnuncioDetalhe() {
  const router = useRouter();
  const params = useParams(); 
  const {id} = params;

  const [anuncio, setAnuncio] = useState<AnuncioDetalhado | null>(null);
  const [imagemSelecionada, setImagemSelecionada] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    async function fetchAnuncio() {
      try {
        setIsLoading(true);
        const response = await api.get(`/anuncio/${id}`);
        const data = response.data;

        console.log(data)
        setAnuncio(data);

        if (data.imagens && data.imagens.length > 0) {
          setImagemSelecionada(data.imagens[0].url);
        }
      } catch (err) {
        console.error(err);
        setError('Anúncio não encontrado ou erro ao carregar.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnuncio();
  }, [id]);

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(value));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getImageUrl = (path: string) => {
    if (path.startsWith('http')) return path;
    return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${path}`;
  };

  const whatsappLink = `https://api.whatsapp.com/send?phone=55${anuncio?.usuario?.telefone}&text=Olá, ${anuncio?.usuario?.nome}! \nvi seu anúncio "${anuncio?.titulo}" no ConectaNegócios.`;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !anuncio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Ops!</h1>
        <p className="text-gray-600 mb-6">{error || 'Anúncio não encontrado.'}</p>
        <button 
          onClick={() => router.back()} 
          className="text-indigo-600 hover:underline font-medium"
        >
          &larr; Voltar para a listagem
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      {/* Header Simplificado */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={() => router.push('/home')} 
            className="text-gray-500 hover:text-indigo-600 flex items-center text-sm font-medium transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para anúncios
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- COLUNA DA ESQUERDA: Imagens --- */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Imagem Principal (Destaque) */}
            <div className="rounded-xl shadow-sm border border-gray-100 overflow-hidden aspect-video flex items-center justify-center bg-gray-100 relative">
              {anuncio.imagens.length > 0 ? (
                <img 
                  src={getImageUrl(imagemSelecionada)} 
                  alt={anuncio.titulo} 
                  className="w-full h-full object-contain max-h-[500px]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Erro+na+Imagem';
                  }}
                />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Sem fotos disponíveis</span>
                </div>
              )}
              
              {/* Badge de Tipo na imagem */}
               <span className="absolute top-4 left-4 bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                  {anuncio.categoria.tipo}
                </span>
            </div>

            {/* Carrossel de Miniaturas */}
            {anuncio.imagens.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {anuncio.imagens.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setImagemSelecionada(img.url)}
                    className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      imagemSelecionada === img.url 
                        ? 'border-indigo-600 opacity-100 ring-2 ring-indigo-100' 
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={getImageUrl(img.url)} 
                      alt="Miniatura" 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Descrição (Mobile e Desktop) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Descrição</h2>
              <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                {anuncio.descricao}
              </div>
            </div>
          </div>

          {/* --- COLUNA DA DIREITA: Informações e Contato --- */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Card de Preço e Título */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <span className="text-sm text-gray-500 block mb-1">
                Publicado em {formatDate(anuncio.createdAt)}
              </span>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
                {anuncio.titulo}
              </h1>
              <div className="text-3xl font-extrabold text-indigo-600 mb-4">
                {formatMoney(anuncio.preco)}
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                <span className="font-medium">Categoria:</span>
                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-semibold">
                  {anuncio.categoria.nome}
                </span>
              </div>
            </div>

            {/* Card do Vendedor */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Informações do Vendedor</h3>
              
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full bg-linear-to-tr from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {anuncio.usuario.nome.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-lg font-bold text-gray-800">{anuncio.usuario.nome}</p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {anuncio.usuario.cidade} - {anuncio.usuario.estado}
                  </p>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="space-y-3">
                <a 
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                  Chamar no WhatsApp
                </a>
                
                <button className="flex items-center justify-center w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition">
                  Ver Telefone
                </button>
              </div>
            </div>

            {/* Segurança / Dicas */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-sm text-blue-800">
              <h4 className="font-bold mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Dicas de Segurança
              </h4>
              <ul className="list-disc list-inside space-y-1 text-blue-700/80 text-xs">
                <li>Evite pagamentos antecipados.</li>
                <li>Combine o encontro em local público.</li>
                <li>Verifique o produto antes de comprar.</li>
              </ul>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}