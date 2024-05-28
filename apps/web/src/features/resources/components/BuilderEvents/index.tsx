import { Link } from '@tanstack/react-router';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { Card } from '../../../../atoms/Card/index.tsx';
import Flag from '../../../../atoms/Flag/index.tsx';
import { getDateString, getTimeString } from '../../../../utils/date.ts';

// /home/jramos/planB/sovereign-university/apps/web/src/utils/date.ts
//home/jramos/planB/sovereign-university/apps/web/src/features/resources/components/BuilderEvents/index.tsx

interface Event {
  id: string;
  path: string;
  name: string;
  description: string | null;
  startDate: string | Date;
  endDate: string | Date;
  picture: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  addressLine3: string | null;
  type: string;
  languages: string[];
  websiteUrl: string;
  priceDollars: number | null;
  timezone: string | null;
  bookOnline: boolean;
  bookInPerson: boolean;
}

interface BuilderEventsProps {
  events: Event[];
  formatEventDates: (
    startDate: string | Date,
    endDate: string | Date,
  ) => string;
}

export const BuilderEvents: React.FC<BuilderEventsProps> = ({
  events,
  formatEventDates,
}) => {
  const { t } = useTranslation();

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold text-orange-500">
        {t('communityNetwork.related')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {events.map((event) => {
          const startDate = new Date(event.startDate);
          const endDate = new Date(event.endDate);
          const timezone = event.timezone || undefined;
          const dateString = getDateString(startDate, endDate, timezone);
          const timeString = getTimeString(startDate, endDate, timezone);

          let capitalizedType = '';
          if (event.type) {
            capitalizedType =
              event.type.charAt(0).toUpperCase() + event.type.slice(1);
          }

          return (
            <Card
              key={event.id}
              className="p-4 bg-transparent border border-gray-700 rounded-lg"
            >
              {event.picture && (
                <div className="w-full overflow-hidden rounded-2xl relative mb-2 lg:mb-4">
                  <img
                    src={event.picture}
                    alt={event.name}
                    className="object-cover aspect-[432/308] w-full"
                  />
                  {event.type && (
                    <span className="absolute top-4 left-4 bg-white border border-newGray-3 text-black text-sm font-medium leading-none py-1 px-2 rounded-sm">
                      {capitalizedType}
                    </span>
                  )}
                  <div className="absolute top-4 right-4 bg-white border border-newGray-3 p-1 flex flex-col justify-center items-center gap-1 rounded-sm">
                    {event.languages.map((language: string) => (
                      <Flag code={language} size="m" key={language} />
                    ))}
                  </div>
                </div>
              )}
              <h3 className="font-bold text-lg lg:text-2xl text-white">
                {event.name}
              </h3>
              <div className="flex flex-col gap-1 text-white/75 text-xs lg:text-sm">
                <div className="flex gap-1">
                  <span>{dateString}</span>
                  {startDate.getUTCHours() !== 0 &&
                    endDate.getUTCHours() !== 0 && (
                      <>
                        <span>·</span>
                        <span>{timeString}</span>
                      </>
                    )}
                </div>
                {event.addressLine1 && <span>{event.addressLine1}</span>}
                {event.addressLine2 && <span>{event.addressLine2}</span>}
                {event.addressLine3 && <span>{event.addressLine3}</span>}
              </div>
              {event.websiteUrl && (
                <div className="w-fit mx-auto mt-auto pt-3 pb-1">
                  <Link to={event.websiteUrl} target="_blank">
                    <button className="bg-orange-500 text-white py-2 px-4 rounded-lg text-xs md:text-base">
                      {t('communityNetwork.visit')}
                    </button>
                  </Link>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
