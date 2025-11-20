"use client"

import AnuncioCard from '@/components/AnuncioCard';
import { api } from '@/services/api';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';


interface Imagem {
  url: string
}

interface Anuncio {
  id: number;
  titulo: string;
  descricao: string;
  preco: number;
  localidade: string;
  status: 'Ativo' | 'Pendente' | 'Inativo';
  imagens: Imagem[]
}

export default function MeusAnunciosPage() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])

  console.log(anuncios)

  const fetchAnuncio = async() => {
    try{
      const response = await api.get("/anuncio/meus-anuncios")
      setAnuncios(response.data)
    }catch(e){
      console.log(e)
      alert("Erro ao buscar anuncios")
    }
  }

  useEffect(()=>{
    (
      async()=>{
        await fetchAnuncio()
      }
    )()
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8 lg:p-12 font-inter">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Meus Anúncios ({anuncios.length})
          </h1>
          <p className="text-slate-600 mt-1">
            Gerencie seus produtos e serviços publicados no ConectaNegocios.
          </p>
        </div>

        <div className="mb-8 flex justify-end">
          <Link href={"/criar-anuncio"} className="px-6 py-3 bg-green-500 text-white font-bold rounded-xl shadow-lg hover:bg-green-600 transition duration-150 flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            <span>Novo Anúncio</span>
          </Link>
        </div>

        <div className="space-y-6">
          {anuncios.map((anuncio) => (
            <AnuncioCard key={anuncio.id} anuncio={anuncio} setAnuncios={setAnuncios}/>
          ))}
        </div>
        
        {anuncios.length === 0 && (
          <div className="text-center p-12 bg-white rounded-xl shadow-md border border-dashed border-gray-300">
            <h2 className="text-xl font-semibold text-gray-700">Nenhum anúncio encontrado.</h2>
            <p className="text-gray-500 mt-2">Comece a dar visibilidade ao seu negócio agora mesmo!</p>
          </div>
        )}
      </div>
    </main>
  );
}