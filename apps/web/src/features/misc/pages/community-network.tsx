import {
  BreakPointHooks,
  breakpointsTailwind,
} from '@react-hooks-library/core';
import { useTranslation } from 'react-i18next';

import { Button, cn } from '@sovereign-university/ui';

import { PageLayout } from '#src/components/PageLayout/index.tsx';

import communityMap from '../../../assets/community/communitymaps.svg';
import { useDisclosure } from '../../../hooks/index.ts';

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
  const { t } = useTranslation();
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

  return (
    <PageLayout
      title={t('communityNetwork.title')}
      subtitle={t('about.subtitle')}
      description={t('about.description')}
    >
      <div className="flex flex-col items-center">
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
