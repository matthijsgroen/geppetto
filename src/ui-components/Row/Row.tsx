import styles from "./Row.module.css";

export const Row: React.FC = ({ children }) => (
  <div className={styles.row}>{children}</div>
);
