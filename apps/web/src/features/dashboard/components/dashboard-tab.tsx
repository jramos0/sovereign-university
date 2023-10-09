import { trpc } from '../../../utils';

import { CoursesProgressList } from './courses-progress-list';

const CoursesCardTitle = ({ children }: { children: string }) => (
  <div className="px-2 text-lg font-medium italic text-blue-800">
    {children}
  </div>
);

const CoursesCard = ({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) => (
  <div className="flex w-full flex-col space-y-2 rounded-3xl bg-white px-6 py-4">
    {children}
  </div>
);

export const DashboardTab = () => {
  const { data: progress } = trpc.user.courses.getProgress.useQuery();

  const completedCourses = progress?.filter(
    (course) => course.progress_percentage === 100,
  );

  const inProgressCourses = progress?.filter(
    (course) => course.progress_percentage !== 100,
  );

  return (
    <div className="space-y-8">
      <div className="px-8 text-lg font-semibold uppercase text-blue-700">
        Let's check where you're at !
      </div>
      <CoursesCard>
        <CoursesCardTitle>Courses in progress</CoursesCardTitle>
        <CoursesProgressList courses={inProgressCourses} />
      </CoursesCard>
      <CoursesCard>
        <CoursesCardTitle>Completed courses</CoursesCardTitle>
        <CoursesProgressList courses={completedCourses} />
      </CoursesCard>
    </div>
  );
};