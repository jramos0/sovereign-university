interface ResourceCardProps {
  imageSrc?: string | null;
  name: string;
  author: string;
  year?: number | null;
}

export const ResourceCard = (props: ResourceCardProps) => {
  return (
    <div className="group flex md:flex-col gap-4 p-3  hover:bg-darkOrange-10 hover:shadow-[0px_0px_10px_0px_#FF5C00] hover:border border-transparent hover:border-darkOrange-6 rounded-2xl md:hover:z-10 md:hover:scale-110 transition-all duration-300">
      <img
        className="aspect-square object-contain w-[84px] md:w-full md:group-hover:blur-[10px] md:group-hover:brightness-[0.2] transition-all"
        src={props.imageSrc ? props.imageSrc : ''}
        alt={props.name}
      />
      <div className="flex flex-col gap-[10px] md:gap-4 ">
        <span className="text-white text-sm md:text-xl md:leading-5 font-medium">
          {props.name}
        </span>
        <span className="text-white group-hover:text-darkOrange-1 text-xs md:text-base md:leading-6 transition-all">
          {props.author}
          {props.year && (
            <>
              <span> · </span>
              <span className="text-white/75 group-hover:text-darkOrange-1 font-light transition-all">
                {props.year}
              </span>
            </>
          )}
        </span>
      </div>
    </div>
  );
};
