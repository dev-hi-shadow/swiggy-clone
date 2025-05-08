import Button from "../ui/button/Button";
import ResponsiveImage from "../ui/images/ResponsiveImage";

interface ComponentCardProps {
  image?: {
    src: string;
    height?: number;
    width?: number;
    alt?: string;
    className?: string;
    isCenter?: boolean;
  };
  title?: string | React.ReactNode;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  button?: {
    label: string;
    onClick: () => void;
  };
  saveButton?: {
    label?: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    className?: string;
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
  };
  cancelButton?: {
    label?: string;
    onClick: () => void;
    type?: "button" | "submit" | "reset";
    className?: string;
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
  };
  imageClassname?: string;
  desClassName?: string;
  titleClassName?: string;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  image,
  title,
  children,
  className = "",
  desc = "",
  button,
  cancelButton,
  saveButton,
  desClassName,
  titleClassName,
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="px-6 py-5">
        <div className="flex justify-between items-center">
          <h3
            className={`text-base w-full font-medium text-gray-800 dark:text-white/90 ${titleClassName}`}
          >
            {image ? (
              <ResponsiveImage
                className={image.className}
                image={image.src}
                height={image.height}
                width={image.width}
                isCenter={image.isCenter}
              />
            ) : (
              title
            )}
          </h3>
          {desc && (
            <p
              className={`mt-1 text-sm text-gray-500 dark:text-gray-400 ${desClassName}`}
            >
              {desc}
            </p>
          )}
          {button && (
            <Button
              size="sm"
              type="button"
              className="sm:whitespace-nowrap"
              onClick={button.onClick}
            >
              {button.label}
            </Button>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div
        className={`p-4 border-t border-gray-100 dark:border-gray-800  ${
          !image && "sm:p-6"
        }`}
      >
        <div className="space-y-6">{children}</div>
      </div>
      {/* Card Footer */}
      {(cancelButton || saveButton) && (
        <div className="flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800 p-4">
          {cancelButton && (
            <Button
              type="button"
              variant="outline"
              onClick={cancelButton.onClick}
            >
              {cancelButton.label}
            </Button>
          )}
          {saveButton && (
            <Button
              type={saveButton.type}
              variant="primary"
              onClick={saveButton.onClick}
            >
              {saveButton.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ComponentCard;
