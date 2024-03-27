import type React from 'react';

// Define el tipo para tus términos del glosario
interface GlossaryTerm {
  term: string;
  definition: string;
}

// Componente de ejemplo que muestra términos y definiciones
export const GlossaryList: React.FC<{ glossaryTerms: GlossaryTerm[] }> = ({
  glossaryTerms,
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="p-4 text-left font-medium text-white">TERM</th>
              <th className="p-4 text-left font-medium text-white">
                DEFINITION
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {glossaryTerms.map((term) => (
              <tr key={term.term}>
                <td className="p-4 text-orange-500 font-bold">{term.term}</td>
                <td className="p-4 text-white">{term.definition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <button className="rounded-full bg-gray-800 px-6 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring">
          Load more words
        </button>
      </div>
    </div>
  );
};
