import {
  BreakPointHooks,
  breakpointsTailwind,
} from '@react-hooks-library/core';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { Button, cn } from '@sovereign-university/ui';

import { PageLayout } from '#src/components/PageLayout/index.tsx';

import communityMap from '../../../assets/community/communitymaps.svg';
import { useDisclosure } from '../../../hooks/index.ts';
import { trpc } from '../../../utils/index.ts';
import { BuilderCard } from '../../resources/components/Cards/builder-card.tsx';

const QnAItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const { isOpen, toggle } = useDisclosure();

  return (
    <div>
      <button onClick={toggle}>
        <div className="flex cursor-pointer flex-row text-base font-medium sm:text-xl items-center">
          <span className="uppercase text-orange-500">{question}</span>
          <div
            className={cn(
              'ml-2 text-2xl sm:text-3xl font-light mr-3 inline-block',
              isOpen ? 'rotate-45' : 'rotate-0',
            )}
          >
            {'+'}
          </div>
        </div>
      </button>
      {isOpen && (
        <p className="max-w-2xl whitespace-pre-line text-sm">{answer}</p>
      )}
      <hr className="mb-4 mt-6 border-gray-800" />
    </div>
  );
};

const QnA = () => {
  const { t } = useTranslation();

  const questions = [
    {
      question: t('nodeNetwork.question1'),
      answer: t('nodeNetwork.answer1'),
    },
    {
      question: t('nodeNetwork.question2'),
      answer: t('nodeNetwork.answer2'),
    },
    {
      question: t('nodeNetwork.question3'),
      answer: t('nodeNetwork.answer3'),
    },
    {
      question: t('nodeNetwork.question4'),
      answer: t('nodeNetwork.answer4'),
    },
    {
      question: t('nodeNetwork.question5'),
      answer: t('nodeNetwork.answer5'),
    },
  ];

  return (
    <div className="flex w-full flex-col gap-4 px-4 pt-6">
      {questions.map((item) => (
        <QnAItem
          question={item.question}
          answer={item.answer}
          key={item.question}
        />
      ))}
    </div>
  );
};

export const CommunityNetwork = () => {
  const { t, i18n } = useTranslation();

  const { useGreater } = BreakPointHooks(breakpointsTailwind);
  const isScreenXl = useGreater('xl');
  const isScreenLg = useGreater('lg');
  const isScreenMd = useGreater('md');
  const isScreenSm = useGreater('sm');

  let mapWidth;
  if (isScreenXl) {
    mapWidth = 1200;
  } else if (isScreenLg) {
    mapWidth = 900;
  } else if (isScreenMd) {
    mapWidth = 750;
  } else if (isScreenSm) {
    mapWidth = 700;
  } else {
    mapWidth = window.innerWidth - 100;
  }

  const {
    data: builders,
    isLoading,
    isError,
  } = trpc.content.getBuilders.useQuery({
    language: i18n.language ?? 'en',
  });
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading Communities.</p>;

  const miningBuilders = (builders ?? []).filter(
    (builder) => builder.category === 'community',
  );

  return (
    <PageLayout
      title={t('communityNetwork.title')}
      subtitle={t('communityNetwork.subtitle')}
      description={t('communityNetwork.content')}
    >
      <div className="flex flex-col items-center">
        <div className="col-span-1 gap-6 lg:grid-cols-2 self-start">
          <div className="mt-5 mx-4 sm:mx-6 md:mx-8 lg:mx-10 flex flex-col justify-center items-center gap-4 md:gap-11">
            {/* Title in its own row, aligned to the left */}
            <div className="w-full">
              <h2 className="text-3xl font-semibold uppercase text-orange-500">
                {t('communityNetwork.sectitle')}
              </h2>
            </div>

            {/* Row for the builder cards */}
            <div className="flex flex-row flex-wrap items-start gap-4 md:gap-11">
              {miningBuilders.map((builder) => (
                <Link
                  key={builder.id}
                  to={`/resources/builder/${builder.id}`}
                  params={{
                    builderId: builder.id.toString(),
                  }}
                >
                  <BuilderCard name={builder.name} logo={builder.logo} />
                </Link>
              ))}
            </div>
          </div>

          <div className="mb-12  self-start">
            <h2 className="mt-12 text-3xl font-semibold uppercase text-orange-500">
              {t('communityNetwork.sectitle')}
            </h2>
          </div>
        </div>
        <div className="mx-8 mt-8 flex max-w-4xl flex-col items-center text-white">
          <div className="mb-12 w-fit content-center self-center">
            <img
              id="btcmap"
              className="rounded-3xl"
              alt="BTC Map"
              width={mapWidth}
              src={communityMap}
            />
          </div>
          <QnA />
        </div>
        <a
          className="mt-8 place-self-center"
          href="https://framaforms.org/node-application-planb-network-1708081674"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="secondary" glowing={true} className="!text-black">
            {t('nodeNetwork.apply')}
          </Button>
        </a>
      </div>
    </PageLayout>
  );
};
