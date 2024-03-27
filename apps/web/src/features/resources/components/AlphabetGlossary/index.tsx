import type React from 'react';
import { useState } from 'react';

// export const AlphabetGlossary: React.FC = () => {
export const AlphabetGlossary: React.FC<{
  onLetterSelect: (letter: string) => void;
}> = ({ onLetterSelect }) => {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  // Divide las letras en filas
  const rows = [
    [...'ABCDEFGHI'], // Primera fila
    [...'JKLMNOPQR'], // Segunda fila
    [...'STUVWXYZ'], // Tercera fila
  ];

  /*const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter);
  };*/
  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter);
    onLetterSelect(letter); // Llamar a la función pasada como prop
    console.log(letter); // Esto imprimirá la letra en consola cada vez que se hace clic en un botón.
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {rows.map((row, idx) => (
        <div key={idx} className="flex justify-center">
          {row.map((letter) => (
            <button
              key={letter}
              className={`m-1 p-2 rounded-full size-10 flex items-center justify-center font-bold ${
                selectedLetter === letter
                  ? 'bg-orange-500 text-white'
                  : 'bg-[#1F242D] text-gray-300'
              }`}
              onClick={() => handleLetterClick(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};
