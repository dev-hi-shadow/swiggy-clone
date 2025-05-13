export default function ResponsiveImage({
  image,
  border,
  className = "w-full rounded-xl",
  height,
  width,
  isCenter,
}: {
  image: string;
  border?: boolean;
  className?: string;
  height?: number;
  width?: number;
  isCenter?: boolean;
}) {
  if (border) {
    className += "border border-gray-200  dark:border-gray-800";
  }
  return (
    <div className="relative">
      <div
        className={`overflow-hidden ${isCenter ? "flex justify-center" : ""}  `}
      >
        <img
          src={image}
          alt="Cover"
          height={height}
          width={width}
          className={className}
        />
      </div>
    </div>
  );
}
