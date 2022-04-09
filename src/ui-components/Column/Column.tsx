import styles from "./Column.module.css";

export const Column: React.FC = ({ children }) => (
  <div className={styles.column}>{children}</div>
);
