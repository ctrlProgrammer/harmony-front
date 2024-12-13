import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactElement } from "react";

import styles from "./header.module.css";

interface HeaderProps {
  title: string;
  subtitle: string;
  actions: ReactElement;
}

export const Header = (props: HeaderProps) => {
  return (
    <div className={styles.header}>
      <div>
        <h4>{props.title}</h4>
        <p>{props.subtitle}</p>
      </div>
      <div>{props.actions}</div>
    </div>
  );
};

export const InternalHeader = (props: HeaderProps) => {
  return (
    <div className={styles.internalHeader}>
      <div>
        <h4>{props.title}</h4>
        <p>{props.subtitle}</p>
      </div>
      <div>{props.actions}</div>
    </div>
  );
};
