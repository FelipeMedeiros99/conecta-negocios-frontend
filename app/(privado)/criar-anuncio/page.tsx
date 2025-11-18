"use client"

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { AxiosError } from 'axios';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input';

interface Categoria {
  id: number;
  nome: string;
  tipo: "PRODUTO" | "SERVICO"
}

interface AnuncioDataInterface {
  titulo: string;
  descricao: string;
  preco: string | number;
  tipo: "PRODUTO" | "SERVICO" | "";
  categoriaId: string | number;


}

const defaultAnuncioData: AnuncioDataInterface = { titulo: "", descricao: "", preco: "", tipo: "", categoriaId: "" }

export default function CriarAnuncio() {
  const router = useRouter()

  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [anuncioData, setAnuncioData] = useState<AnuncioDataInterface>(defaultAnuncioData)

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);


  useEffect(() => {
    async function fetchCategorias() {
      try {
        const response = await api.get('/categoria');
        setCategorias(response.data);
      } catch (err) {
        console.error('Falha ao buscar categorias:', err);
        setError('Não foi possível carregar as categorias. Tente recarregar a página.');
      }
    }
    fetchCategorias();
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    imagePreviews.forEach(URL.revokeObjectURL);

    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      const selectedFiles = filesArray.slice(0, 5);
      setImages(selectedFiles);

      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!anuncioData.categoriaId) {
      setError('Por favor, selecione uma categoria.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    let newAnuncioId: number | null = null;

    try {
      const response = await api.post('/anuncio', anuncioData);
      newAnuncioId = response.data.id;

      if (!newAnuncioId) {
        throw new Error('Ocorreu um erro ao criar o anúncio.');
      }

      setSuccess('Anúncio criado! Enviando imagens...');

      if (images.length > 0) {
        const formData = new FormData();
        images.forEach(image => {
          formData.append('imagens', image);
        });

        const response = await api.post(`/anuncio/${newAnuncioId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setIsLoading(false);
      setSuccess('Anúncio publicado com sucesso!');

      setAnuncioData(defaultAnuncioData)
      setImages([]);
      setImagePreviews([]);

      setTimeout(() => {
        router.push('/home');
      }, 1500);

    } catch (err) {
      console.error('Falha ao criar anúncio:', err);
      setIsLoading(false);
      const message = (err as AxiosError<any>)?.response?.data?.message || 'Erro desconhecido.';

      if (newAnuncioId) {
        setError(`Anúncio de texto criado, mas falha ao enviar imagens: ${message}`);
      } else {
        setError(`Falha ao criar anúncio: ${message}`);
      }
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Criar Novo Anúncio
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Título do Anúncio"
            id="titulo"
            type="text"
            placeholder="Ex: Web Design Profissional"
            required
            value={anuncioData.titulo}
            onChange={(e) => setAnuncioData(prev => ({ ...prev, "titulo": e.target.value }))}
          />

          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              id="descricao"
              placeholder="Descreva seu produto ou serviço em detalhes..."
              required
              maxLength={2000}
              rows={5}
              value={anuncioData.descricao}
              onChange={(e) => setAnuncioData(prev => ({ ...prev, "descricao": e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label='Preço (R$)'
              id="preco"
              type="number"
              placeholder="Ex: 150.00"
              required
              min="0.01"
              step="0.01"
              value={anuncioData.preco}
              onChange={(e) => setAnuncioData(prev => ({ ...prev, "preco": e.target.value }))}
            />

            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
                Tipo de Anúncio
              </label>
              <select
                id="tipo"
                value={anuncioData.tipo}
                onChange={(e) => setAnuncioData(prev => ({ ...prev, "tipo": e.target.value as "PRODUTO" | "SERVICO" }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="" disabled>Selecione o tipo</option>
                <option value="PRODUTO">Produto</option>
                <option value="SERVICO">Serviço</option>
              </select>
            </div>
          </div>


          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
              Categoria
            </label>
            <select
              id="categoria"
              required
              value={anuncioData.categoriaId || ''}
              onChange={(e) => setAnuncioData(prev => ({ ...prev, "categoriaId": Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={categorias.length === 0 || !anuncioData.tipo}
            >
              <option value="" disabled>
                {categorias.length === 0 ? 'Carregando categorias...' : 'Selecione uma categoria'}
              </option>
              {categorias.map((cat) => {
                if (cat.tipo === anuncioData.tipo) {
                  return (
                    <option key={cat.id} value={cat.id}>
                      {cat.nome}
                    </option>
                  )
                }
              })}
            </select>
          </div>

          <div>
            <label htmlFor="imagens" className="block text-sm font-medium text-gray-700">
              Imagens (até 5)
            </label>
            <Input
              id="imagens"
              type="file"
              multiple
              accept="image/png, image/jpeg, image/gif"
              onChange={handleImageChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {imagePreviews.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-md shadow-md"
                />
              ))}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || !anuncioData.categoriaId}
              className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (success || 'Publicando...') : 'Publicar Anúncio'}
            </button>
          </div>

          {error && (
            <div className="text-center p-2 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          {success && !isLoading && (
            <div className="text-center p-2 bg-green-100 text-green-700 rounded-md">
              {success}
            </div>
          )}

        </form>
      </div>
    </div>
  );
}