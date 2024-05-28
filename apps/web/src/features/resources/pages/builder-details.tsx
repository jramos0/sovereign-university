import { Link, useParams } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BsGithub, BsLink, BsTwitter } from 'react-icons/bs';
import { GiBirdMask } from 'react-icons/gi';

import { useGreater } from '#src/hooks/use-greater.js';

import { Card } from '../../../atoms/Card/index.tsx';
import { Tag } from '../../../atoms/Tag/index.tsx';
import { useNavigateMisc } from '../../../hooks/index.ts';
import { trpc } from '../../../utils/index.ts';
import { RelatedWork } from '../components/RelatedWork/index.tsx';
import { BuilderCard } from '../../resources/components/Cards/builder-card.tsx';

import { ResourceLayout } from '../layout.tsx';

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
  const navigateTo404Called = useRef(false);

  useEffect(() => {
    if (!builder && isFetched && !navigateTo404Called.current) {
      navigateTo404();
      navigateTo404Called.current = true;
    }
  }, [builder, isFetched, navigateTo404]);

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
            <div className="col-span-2 row-span-1 mb-3 mt-1 font-light md:mb-0 md:ml-12">
              {builder?.tags?.map((tag) => (
                <Link to={'/resources/builders'} key={tag}>
                  <Tag className="ml-1" size={isScreenMd ? 'm' : 's'}>
                    {tag}
                  </Tag>
                </Link>
              ))}
            </div>
            <div className="row-span-5 mb-4 flex max-md:flex-wrap flex-row items-center border-b-4 border-solid border-blue-900 md:mb-0 md:flex-col md:border-b-0 md:border-r-4 md:pb-10 md:pr-16">
              <img
                src={builder?.logo}
                className="md:w-full max-sm:h-40 max-md:h-60 mx-auto rounded-md"
                alt={t('imagesAlt.sthRepresentingCompany')}
              />
              <div className="mx-2 my-3 md:my-6 flex w-full justify-evenly">
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

              {/* <RelatedResources
                tutoriel={[{ label: 'Seed signer Device' }]}
                interview={[
                  {
                    label: 'CEO Interview',
                    path: replaceDynamicParam(Routes.Interview, {
                      interviewId: 'ja78172',
                    }),
                  },
                ]}
                course={[
                  {
                    label: 'BTC 204',
                    path: replaceDynamicParam(Routes.Course, {
                      courseId: 'btc-204',
                    }),
                  },
                ]}
              /> */}
            </div>
          </div>
        </Card>
      )}

      <div>
        {builder?.category === 'community' && <RelatedWork />}
        {/* Row for the community builder cards 
  <div className="flex flex-row flex-wrap items-start gap-4 md:gap-11">
    {communityBuilders.map((communityBuilder) => (
      <Link
        key={communityBuilder.id}
        to={`/resources/builder/${communityBuilder.id}`}
        params={{
          builderId: communityBuilder.id.toString(),
        }}
      >
        <BuilderCard name={communityBuilder.name} logo={communityBuilder.logo} />
      </Link>
    ))}
  </div>*/}
      </div>
    </ResourceLayout>
  );
};
