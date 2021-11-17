import React from "react";
import clsx from "clsx";
import styles from "./HomepageFeatures.module.css";

type FeatureProps = {
  title: string;
  description: React.ReactNode;
  img: string;
};

const FeatureList: FeatureProps[] = [
  {
    title: "Bring your art to life",
    img: require("../../static/img/site-highlight1.png").default,
    description: (
      <>
        Geppetto makes your 2D images come to life using animations and
        real-time controls.
      </>
    ),
  },
  {
    title: "Small and Fast",
    img: require("../../static/img/site-highlight2.png").default,
    description: (
      <>
        With less than <strong>10 kB</strong> the library is small. But it also
        is focused on performance, to extend your battery life.
      </>
    ),
  },
  {
    title: "Studio and Player",
    img: require("../../static/img/site-highlight3.png").default,
    description: (
      <>
        Create awesome animations using the Studio, and embed them on any
        website using the player.
      </>
    ),
  },
];

const Feature: React.FunctionComponent<FeatureProps> = ({
  img,
  title,
  description,
}) => (
  <div className={clsx("col col--4")}>
    <div className="text--center">
      <img src={img} alt={title} width="300" />
    </div>
    <div className="text--center padding-horiz--md">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  </div>
);

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
