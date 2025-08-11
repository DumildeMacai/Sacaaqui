import React from 'react';
import Link from 'next/link'; // Importe o componente Link

const AdminATMsPage: React.FC = () => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gerenciamento de ATMs</h1>
        {/* Botão Adicionar ATM */}
        <Link href="/admin/atms/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          + Adicionar ATM
        </Link>
      </div>
      {/* Adicione aqui o conteúdo da lista de ATMs */}
    </div>
  );
};

export default AdminATMsPage;