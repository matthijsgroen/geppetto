import styles from "./Logo.module.css";
import { ReactComponent as Image } from "./geppetto.svg";
import { Icon } from "../Icon/Icon";

export const LogoIcon: React.FC = () => (
  <Icon>
    <Image width={20} style={{ verticalAlign: "middle" }} />
  </Icon>
);

export const Logo: React.FC = () => (
  <div className={styles.logo}>
    <Image />
  </div>
);
