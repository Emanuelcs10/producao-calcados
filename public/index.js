import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 font-sans">
      <h1 className="text-4xl font-bold mb-6">Sistema de Produção</h1>
      <p className="text-lg mb-10 text-center">
        Escolha uma opção abaixo para gerenciar os programas e acompanhar a produção:
      </p>

      <div className="flex flex-col gap-4 w-64">
        <Link href="/cadastro">
          <a className="block text-center bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition">
            Cadastro de Programas
          </a>
        </Link>

        <Link href="/controle">
          <a className="block text-center bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition">
            Controle de Produção
          </a>
        </Link>
      </div>
    </div>
  );
}
