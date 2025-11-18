"use client"

import { useState, FormEvent, FocusEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/services/api';
import axios, { AxiosError } from 'axios';
import Input from '@/components/Input';

interface ApiErrorResponse {
  message: string;
}

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  estado: string;
  erro?: boolean;
}

interface UserData {
  nome: string;
  telefone: string;
  username: string;
  senha: string;
  confirmarSenha: string;
}

export interface EnderecoData {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

const userDataDefault = { nome: "", senha: "", confirmarSenha: "", username: "", telefone: "" };
const enderecoDataDefault = { cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "" }

export default function CadastroPage() {
  const router = useRouter();

  const [userData, setUserData] = useState<UserData>(userDataDefault)
  const [enderecoData, setEnderecoData] = useState<EnderecoData>(enderecoDataDefault);

  const [isLoading, setIsLoading] = useState(false);
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cepError, setCepError] = useState<string | null>(null);

  const handleCepBlur = async (e: FocusEvent<HTMLInputElement>) => {
    const cepInput = e.target.value.replace(/\D/g, '');

    if (cepInput.length !== 8) {
      setCepError('CEP deve conter 8 dígitos.');
      return;
    }

    setIsCepLoading(true);
    setCepError(null);
    try {
      const { data } = await axios.get<ViaCepResponse>(
        `https://viacep.com.br/ws/${cepInput}/json/`
      );

      if (data.erro) {
        setCepError('CEP não encontrado.');
        setEnderecoData(enderecoDataDefault)
      } else {
        const { logradouro, bairro, localidade, estado } = data;
        setEnderecoData(prev => ({ ...prev, logradouro, bairro, cidade: localidade, estado }))
        document.getElementById('numero')?.focus();
      }
    } catch (err) {
      setCepError('Erro ao buscar CEP. Tente novamente.');
    } finally {
      setIsCepLoading(false);
    }
  };

  const handleTelefone = (value: string) => {
    value = value.replace(/\D/g, "");
    value = value.substring(0,11)
    if (value.length === 0) {
      value = ""
    }
    if (value.length > 2) {
      value = value.replace(/^(\d{2})/, '($1) ');
    }
  
    if (value.length > 8) {
      value = value.replace(/^(\(\d{2}\)) (\d)/, '$1 $2 ');
    }
    if (value.length > 13) {
      value = value.replace(/^(\(\d{2}\) \d \d{4})/, '$1-');
    }

    setUserData(prev => ({ ...prev, "telefone": value }))
  }

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const telefone = userData.telefone.replaceAll(/\D/g, "");
    if(telefone.length !== 11){
      setError("O número precisa possuir 11 dígitos: DDD + 9 + número")
      setIsLoading(false)
      return
    }

    if (userData.senha !== userData.confirmarSenha) {
      setError('As senhas não coincidem.');
      setIsLoading(false);
      return;
    }

    try {
      await api.post('/cadastrar', { ...userData, telefone, ...enderecoData });
      alert('Cadastro realizado com sucesso! Você será redirecionado para a página de login.');
      router.push('/login');

    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const message =
        axiosError.response?.data?.message ||
        'Erro ao cadastrar. Tente novamente.';
      setError(message);
      setIsLoading(false);
    }
  };


  return (
    <>
      <h1 className="text-center text-3xl font-bold text-slate-800">
        Crie sua Conta
      </h1>
      <p className="mt-2 mb-8 text-center text-slate-500">
        Junte-se ao ConectaNegócios e dê visibilidade ao seu trabalho.
      </p>

      <form onSubmit={handleRegister} className="space-y-6">
        <fieldset className="space-y-4">
          <legend className="mb-2 text-lg font-semibold text-slate-700">
            Dados da Conta
          </legend>

          <Input
            type="text"
            placeholder="Nome Completo"
            required
            value={userData.nome}
            onChange={(e) => setUserData(prev => ({ ...prev, "nome": e.target.value }))}
          />
          <Input
            type="text"
            placeholder="Nome de usuário (ex: seu.nome)"
            required
            value={userData.username}
            onChange={(e) => setUserData(prev => ({ ...prev, "username": e.target.value }))}
          />

          <Input
            type="text"
            placeholder="Telefone"
            required
            value={userData.telefone}
            onChange={(e) => handleTelefone(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Senha (mín. 6 caracteres)"
            required
            minLength={6}
            value={userData.senha}
            onChange={(e) => setUserData(prev => ({ ...prev, "senha": e.target.value }))}
          />
          <Input
            type="password"
            placeholder="Confirme sua senha"
            required
            value={userData.confirmarSenha}
            onChange={(e) => setUserData(prev => ({ ...prev, "confirmarSenha": e.target.value }))}
          />
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="mb-2 text-lg font-semibold text-slate-700">
            Endereço
          </legend>

          <div>
            <div className="flex items-center space-x-2 w-full">
              <Input
                type="text"
                placeholder="CEP (apenas números)"
                required
                value={enderecoData.cep}
                onChange={(e) => setEnderecoData(prev => ({ ...prev, "cep": e.target.value }))}
                onBlur={handleCepBlur} // <-- A mágica acontece aqui
                maxLength={8}
              />
              {isCepLoading && (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-blue-500"></div>
              )}
            </div>
            {cepError && (
              <p className="mt-1 text-xs text-red-600">{cepError}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              type="text"
              placeholder="Logradouro (Rua, Av.)"
              required
              value={enderecoData.logradouro}
              onChange={(e) => setEnderecoData(prev => ({ ...prev, "logradouro": e.target.value }))}
              readOnly
            />
            <Input
              id="numero"
              type="text"
              placeholder="Número"
              required
              value={enderecoData.numero}
              onChange={(e) => setEnderecoData(prev => ({ ...prev, "numero": e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              type="text"
              placeholder="Complemento (Opcional)"
              value={enderecoData.complemento}
              onChange={(e) => setEnderecoData(prev => ({ ...prev, "complemento": e.target.value }))}
            />
            <Input
              type="text"
              placeholder="Bairro"
              required
              value={enderecoData.bairro}
              onChange={(e) => setEnderecoData(prev => ({ ...prev, "bairro": e.target.value }))}
              readOnly 
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              type="text"
              placeholder="Cidade"
              required
              value={enderecoData.cidade}
              onChange={(e) => setEnderecoData(prev => ({ ...prev, "cidade": e.target.value }))}
              readOnly
            />
            <Input
              type="text"
              placeholder="Estado (UF)"
              required
              value={enderecoData.estado}
              onChange={(e) => setEnderecoData(prev => ({ ...prev, "estado": e.target.value }))}
              readOnly
            />
          </div>
        </fieldset>

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
            disabled={isLoading || isCepLoading}
            className="flex w-full justify-center rounded-lg bg-blue-600 py-3 px-4 font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {isLoading ? 'Cadastrando...' : 'Criar Conta'}
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600">
        Já tem uma conta?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:underline">
          Entrar
        </Link>
      </p>
    </>
  );
}