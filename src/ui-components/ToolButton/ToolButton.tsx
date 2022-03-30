type ToolButtonProps = {
  label?: string;
  onClick?: () => void;
};

export const ToolButton: React.FC<ToolButtonProps> = ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
);
