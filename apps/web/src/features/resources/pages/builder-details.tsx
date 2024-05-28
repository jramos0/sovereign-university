import {
  BreakPointHooks,
  breakpointsTailwind,
} from '@react-hooks-library/core';
import { Link, useParams } from '@tanstack/react-router';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BsGithub, BsLink, BsTwitter } from 'react-icons/bs';
import { GiBirdMask } from 'react-icons/gi';

import { Card } from '../../../atoms/Card/index.tsx';
import { Tag } from '../../../atoms/Tag/index.tsx';
import { useNavigateMisc } from '../../../hooks/index.ts';
import { trpc } from '../../../utils/index.ts';
import { RelatedWork } from '../components/RelatedWork/index.tsx';
import { ResourceLayout } from '../layout.tsx';

import { BuilderEvents } from '../components/BuilderEvents/index.tsx';

const { useGreater } = BreakPointHooks(breakpointsTailwind);

export const Builder = () => {
  const { navigateTo404 } = useNavigateMisc();
  const { t, i18n } = useTranslation();
  const { builderId } = useParams({
    from: '/resources/builder/$builderId',
  });
  const isScreenMd = useGreater('sm');
  const { data: builder, isFetched } = trpc.content.getBuilder.useQuery({
    id: Number(builderId),
    language: i18n.language ?? 'en',
  });

  const { data: events = [] } = trpc.content.getEvents.useQuery();

  const builderEvents = useMemo(() => {
    if (!builder || !events) return [];
    const builderName = builder.name.toLowerCase();
    return events.filter(
      (event) => event.builder?.toLowerCase() === builderName,
    );
  }, [builder, events]);

  useEffect(() => {
    if (!builder && isFetched && !navigateTo404Called.current) {
      navigateTo404();
      navigateTo404Called.current = true;
    }
  }, [builder, isFetched, navigateTo404]);

  const navigateTo404Called = useRef(false);

  const formatDate = (dateInput: string | Date) => {
    let date: Date;
    date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(date.getTime())) {
      console.error(`Invalid date: ${dateInput}`);
      return t('builders.invalidDate');
    }
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatEventDates = (
    startDate: string | Date,
    endDate: string | Date,
  ) => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    if (start === end) {
      return start;
    }
    return `${start} to ${end}`;
  };

  return (
    <ResourceLayout
      title={t('builders.pageTitle')}
      tagLine={t('builders.pageSubtitle')}
      link={'/resources/builders'}
      activeCategory="builders"
      backToCategoryButton
    >
      {builder && (
        <Card className="mx-2 md:mx-auto">
          <div className="my-4 w-full grid-cols-1 grid-rows-6 px-4 sm:grid-cols-3 sm:px-8 md:grid">
            <h3 className="col-span-1 row-span-1 mb-4 text-3xl font-semibold uppercase text-blue-900 sm:text-4xl md:mb-8">
              {builder?.name}
            </h3>
            <div className="col-span-2 row-span-1 mb-5 mt-1 font-light md:mb-0 md:ml-12">
              {builder?.tags?.map((tag) => (
                <Link to={'/resources/builders'} key={tag}>
                  <Tag className="ml-1" size={isScreenMd ? 'm' : 's'}>
                    {tag}
                  </Tag>
                </Link>
              ))}
            </div>
            <div className="row-span-5 mb-4 flex flex-row flex-wrap items-center border-b-4 border-solid border-blue-900 md:mb-0 md:flex-col md:border-b-0 md:border-r-4 md:pb-10 md:pr-16">
              <img
                src={builder?.logo}
                className="w-full"
                alt={t('imagesAlt.sthRepresentingCompany')}
              />
              <div className="mx-2 my-6 flex w-full justify-evenly">
                {builder?.githubUrl && (
                  <a
                    href={builder?.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <BsGithub size={isScreenMd ? 32 : 24} />
                  </a>
                )}
                {builder?.twitterUrl && (
                  <a
                    href={builder?.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <BsTwitter size={isScreenMd ? 32 : 24} />
                  </a>
                )}
                {builder?.nostr && (
                  <a
                    href={builder?.nostr}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GiBirdMask size={isScreenMd ? 32 : 24} />
                  </a>
                )}
                {builder?.websiteUrl && (
                  <a
                    href={builder?.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <BsLink size={isScreenMd ? 32 : 24} />
                  </a>
                )}
              </div>
            </div>

            <div className="col-span-2 row-span-5 ml-0 flex flex-col space-y-4 text-sm md:ml-12">
              <p
                className="text-justify text-sm md:text-base"
                style={{ whiteSpace: 'pre-line' }}
              >
                {builder?.description}
              </p>
            </div>
          </div>
        </Card>
      )}
      <div>
        {builder?.category === 'community' && builderEvents.length > 0 && (
          <BuilderEvents
            events={builderEvents}
            formatEventDates={formatEventDates}
          />
        )}
      </div>
    </ResourceLayout>
  );
};
