"use client"

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, removeAuthToken, setAuthToken } from '@/services/api';
import { AxiosError } from 'axios';
import Input from '@/components/Input';

interface ApiErrorResponse {
  message: string;
}

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({ username: "", senha: "" })

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/logar', formData);

      const { access_token } = response.data;

      setAuthToken(access_token);

      api.defaults.headers['Authorization'] = `Bearer ${access_token}`;

      router.push('/home');

    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || 'Erro ao tentar fazer login. Tente novamente.';
      setError(message);
      setIsLoading(false);
    }
  };

  const updateFormData = (key: "username" | "senha", value: string) => {
    setFormData(prev => {
      const copy = { ...prev }
      copy[key] = value
      return copy;
    })
  }

  useEffect(()=>{
    removeAuthToken();
  }, [])

  return (
    <>
      <h1 className="text-center text-3xl font-bold text-slate-800">
        ConectaNegócios
      </h1>
      <p className="mt-2 mb-8 text-center text-slate-500">
        Acesse sua conta para continuar
      </p>

      <form onSubmit={handleLogin} className="space-y-6">

        <Input
          label='Nome de usuário'
          name="username"
          type="text"
          required
          min={6}
          value={formData.username}
          onChange={(e) => updateFormData("username", e.target.value)}
          placeholder="seu_usuario"
        />

        <Input
          label="Senha"
          id="senha"
          name="senha"
          type="password"
          required
          minLength={6}
          value={formData.senha}
          onChange={(e) => updateFormData("senha", e.target.value)}
          placeholder="••••••••"
        />

        {error && (
          <div
            className="rounded-md border border-red-300 bg-red-50 p-3 text-center text-sm text-red-700"
            aria-live="polite"
          >
            {error}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded-lg bg-blue-600 py-3 px-4 font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600">
        Ainda não tem uma conta?{' '}
        <Link href="/cadastro" className="font-medium text-blue-600 hover:underline">
          Cadastre-se
        </Link>
      </p>
    </>
  );
}