import {
  BreakPointHooks,
  breakpointsTailwind,
} from '@react-hooks-library/core';
import { Link, useParams } from '@tanstack/react-router';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BsGithub } from 'react-icons/bs';
import { TbWorld } from 'react-icons/tb';
import { GiOstrich } from 'react-icons/gi';
import { RiTwitterXLine } from 'react-icons/ri';

import { Card } from '../../../atoms/Card/index.tsx';
import { Tag } from '../../../atoms/Tag/index.tsx';
import { useNavigateMisc } from '../../../hooks/index.ts';
import { trpc } from '../../../utils/index.ts';
import { BuilderEvents } from '../components/BuilderEvents/index.tsx';
import { RelatedWork } from '../components/RelatedWork/index.tsx';
import { ResourceLayout } from '../layout.tsx';

const { useGreater } = BreakPointHooks(breakpointsTailwind);

interface Event {
  id: string;
  path: string;
  name: string;
  startDate: string | Date;
  endDate: string | Date;
  addressLine1: string | null;
  addressLine2: string | null;
  type: string;
  picture: string | null;
  websiteUrl: string | null;
}

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

  const builderEvents = useMemo<Event[]>(() => {
    if (!builder || !events) return [];
    return events.filter(
      (event) => event.builder?.toLowerCase() === builder.name.toLowerCase(),
    );
  }, [builder, events]);

  useEffect(() => {
    if (!builder && isFetched) {
      navigateTo404();
    }
  }, [builder, isFetched, navigateTo404]);

  const formatEventDates = (
    startDate: string | Date,
    endDate: string | Date,
  ): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.error(`Invalid date(s): ${startDate} - ${endDate}`);
      return t('builders.invalidDate');
    }
    return start.toDateString() === end.toDateString()
      ? start.toLocaleDateString()
      : `${start.toLocaleDateString()} to ${end.toLocaleDateString()}`;
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
        <Card className="mx-2 bg-orange-600/30 border-2 border-orange-500 md:mx-auto">
          <div className="my-1 w-full grid-cols-1  px-4  sm:px-8 md:grid">
            <div className="mx-2 flex flex-row w-full sm:items-start">
              <div className="  items-center sm:mr-2 md:mb-0 md:flex-col  md:pb-2 ">
                <img
                  src={builder?.logo}
                  className="w-36 sm:size-40  rounded-lg"
                  alt={t('imagesAlt.sthRepresentingCompany')}
                />
              </div>
              <div className="col-span-2 row-span-1 mb-5 mx-3 mt-1 font-light md:mb-0 md:ml-1">
                <h3 className="col-span-1 row-span-1 mb-4 text-xl md:text-3xl  font-semibold uppercase text-gray-200 sm:text-4xl md:mb-8">
                  {builder?.name}
                </h3>
                {/* This Logos Divs*/}
                <div className="mx-2 text-gray-200 my-6 flex w-auto space-x-4 justify-start">
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
                      <RiTwitterXLine size={isScreenMd ? 32 : 24} />
                    </a>
                  )}
                  {builder?.nostr && (
                    <a
                      href={builder?.nostr}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GiOstrich size={isScreenMd ? 32 : 24} />
                    </a>
                  )}
                  {builder?.websiteUrl && (
                    <a
                      href={builder?.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <TbWorld size={isScreenMd ? 32 : 24} />
                    </a>
                  )}
                </div>
                {builder?.tags?.map((tag) => (
                  <Link to={'/resources/builders'} key={tag}>
                    <Tag
                      className="ml-1 bg-gray-400/80 text-gray-100 text-xs sm:text-sm rounded-sm"
                      size={isScreenMd ? 'm' : 's'}
                    >
                      {tag}
                    </Tag>
                  </Link>
                ))}
              </div>
            </div>
            <div className="col-span-2 sm:mt-4 row-span-5 ml-0 flex flex-col space-y-4 text-sm ">
              <p
                className="text-justify text-gray-200 text-sm md:text-base"
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
