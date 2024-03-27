import { Link } from '@tanstack/react-router';
import { Trans, useTranslation } from 'react-i18next';

import { cn } from '@sovereign-university/ui';

import { CategoryIcon } from '../../../components/CategoryIcon/index.tsx';
import { MainLayout } from '../../../components/MainLayout/index.tsx';
import { PageHeader } from '../../../components/PageHeader/index.tsx';
import { RESOURCES_CATEGORIES } from '../utils.tsx';

export const Resources = () => {
  const { t } = useTranslation();

  return (
    <MainLayout footerVariant="dark" fillScreen>
      <div className="flex flex-col">
        <PageHeader
          title={t('resources.pageTitle')}
          subtitle={t('resources.pageSubtitle')}
          description={t('resources.pageDescription')}
        />

        <div className="mt-6 self-center">
          <div className="grid max-w-5xl grid-cols-2 px-4 md:grid-cols-3 md:px-0">
            {RESOURCES_CATEGORIES.map((resourceCategory) => (
              <Link
                key={resourceCategory.name}
                to={`/resources/${resourceCategory.name}`}
                onClick={(event) =>
                  resourceCategory.unreleased && event.preventDefault()
                }
                className={cn(
                  'group',
                  resourceCategory.unreleased ? 'cursor-not-allowed' : '',
                )}
              >
                <div
                  className={cn(
                    'w-40 md:w-[272px] flex items-center rounded-2xl py-[5px] px-2.5 md:py-2.5 md:px-5 gap-5 md:gap-6 transition-all',
                    resourceCategory.unreleased
                      ? 'opacity-50'
                      : 'opacity-100 group-hover:bg-newBlack-3 group-focus:bg-newBlack-3',
                  )}
                >
                  <CategoryIcon
                    src={resourceCategory.image}
                    variant="resources"
                    imgClassName="max-md:filter-white max-md:group-hover:filter-newOrange1"
                  />
                  <h3
                    className={cn(
                      'text-sm md:text-2xl text-white max-md:leading-[1.43] max-md:tracking-[0.17px]',
                      resourceCategory.unreleased
                        ? ''
                        : 'group-hover:font-medium group-focus:font-medium',
                    )}
                  >
                    {t(`resources.${resourceCategory.name}.title`)}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <p className="max-w-3xl mx-auto leading-snug md:leading-relaxed tracking-015px md:text-xl md:font-medium text-center mt-8 md:mt-16 px-8">
          <Trans i18nKey="resources.github" className="">
            <a
              className="underline underline-offset-2 hover:text-darkOrange-5"
              href="https://github.com/DecouvreBitcoin/sovereign-university-data"
            >
              Github Repository
            </a>
          </Trans>
        </p>
      </div>
    </MainLayout>
  );
};
