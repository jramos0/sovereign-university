import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AlphabetGlossary } from '../components/AlphabetGlossary/index.tsx';
import { GlossaryList } from '../components/GlossaryList/index.tsx';
import { FilterBar } from '../components/NewFilterBar/index.tsx';
import { ResourceLayout } from '../layout.tsx';

// Definición del tipo para los términos del glosario
interface GlossaryTerm {
  term: string;
  definition: string;
}

export const Lexique = () => {
  const { t } = useTranslation();
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryTerm[]>([]);

  // Aqui los datos que podrías cargar los términos cuando el usuario seleccione una letra en `AlphabetGlossary`

  return (
    <ResourceLayout
      title={t('Bitcoin glossary')}
      tagLine={t('Need help defining a technical word?')}
    >
      <div className="flex flex-col gap-4 sm:gap-8">
        <FilterBar onChange={() => {}} />
        <AlphabetGlossary
          onLetterSelect={(letter) => {
            // Aquí  la lógica para actualizar `glossaryTerms` basada en la letra seleccionada
          }}
        />
        <GlossaryList glossaryTerms={glossaryTerms} />
      </div>
    </ResourceLayout>
  );
};
