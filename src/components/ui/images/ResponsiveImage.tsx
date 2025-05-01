export default function ResponsiveImage({
  image,
  border,
  className = "w-full rounded-xl",
}: {
  readonly image: string;
  readonly border?: boolean;
  readonly className?: string;
}) {
  if (border) {
    className += "border border-gray-200  dark:border-gray-800";
  }
  return (
    <div className="relative">
      <div className="overflow-hidden">
        <img src={image} alt="Cover" className={className} />
      </div>
    </div>
  );
}
