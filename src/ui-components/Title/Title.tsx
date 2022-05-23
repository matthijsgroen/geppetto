import { PropsWithChildren } from "react";
import styles from "./Title.module.css";

type TitleProps = PropsWithChildren<{}>;

export const Title: React.FC<TitleProps> = ({ children }) => (
  <h3 className={styles.title}>{children}</h3>
);

Title.displayName = "Title";
