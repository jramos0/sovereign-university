import { Link } from '@tanstack/react-router';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { Card } from '../../../../atoms/Card/index.tsx';

interface Event {
  id: string;
  path: string;
  name: string;
  description: string | null;
  startDate: string | Date;
  endDate: string | Date;
  picture: string | null;
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
      <h2 className="text-2xl font-semibold text-blue-900">
        {t('builders.events')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {events.map((event) => (
          <Card key={event.id} className="p-4">
            {event.picture && (
              <img
                src={event.picture}
                alt={event.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            )}
            <h3 className="text-xl font-semibold mt-4">{event.name}</h3>
            <p className="mt-2 text-sm">{event.description}</p>
            <p className="mt-2 text-sm">
              {t('builders.eventDate')}:{' '}
              {formatEventDates(event.startDate, event.endDate)}
            </p>
            <Link
              to={`/${event.path}`}
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              {t('builders.viewEvent')}
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};
