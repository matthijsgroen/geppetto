import React, { FunctionComponent } from "react";
import styles from "./Dialog.module.css";

type Props = {
  text: string | null;
  title?: string;
  onClick?: () => void;
};

const Dialog: FunctionComponent<Props> = ({ text, title, onClick }) =>
  text ? (
    <div className={styles.dialogBox} onClick={onClick}>
      <h3 className={styles.dialogName}>{title}</h3>
      <p>{text}</p>
    </div>
  ) : null;

export default Dialog;
