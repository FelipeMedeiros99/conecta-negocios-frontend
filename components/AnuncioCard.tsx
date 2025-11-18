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

export default function AnuncioCard ({anuncio} : {anuncio: Anuncio}){
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(anuncio.preco);

  return (
    <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition duration-300 border border-slate-200">
      <div className="w-full md:w-1/4 bg-gray-200 flex items-center justify-center">
        <img className='w-full h-full object-cover' src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${anuncio.imagens[0].url}`} alt="" />
      </div>

      <div className="w-full md:w-3/4 p-6 flex flex-col justify-between">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-slate-800 line-clamp-2">{anuncio.titulo}</h2>
          </div>
          <p className="text-slate-600 mb-3 text-sm line-clamp-3">
            {anuncio.descricao}
          </p>
          <p className="text-sm font-medium text-slate-500">
            Localidade: {anuncio.localidade}
          </p>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <span className="text-2xl font-extrabold text-blue-600">
            {formattedPrice}
          </span>
          <div className="space-x-2">
            <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-150 shadow-md">
              Editar
            </button>
            <button className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition duration-150">
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};