interface IProps {
  label: string;
  color: string;
  onDismiss?: () => void;
  onClick?: () => void;
}

const Tag = ({ label, color, onDismiss, onClick }: IProps) => (
  <span
    className="m-1 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white"
    style={{ backgroundColor: color }}
    onClick={onClick || onDismiss}
    role="button"
  >
    {label}
    {onDismiss && (
      <button onClick={onDismiss} className="ml-2 text-white hover:text-gray-200">
        ×
      </button>
    )}
  </span>
);

export default Tag;
