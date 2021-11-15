import React, { useCallback } from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";
import HomepageFeatures from "../components/HomepageFeatures";
import { Player, Animation } from "../components/Player";
import scenery from "@site/static/demo-assets/scenery.json";
import sceneryTextureUrl from "@site/static/demo-assets/scenery.png";
import fallbackUrl from "@site/static/img/static-image.jpg";
import { AnimationControls } from "geppetto-player";
import { animationTween, tick } from "../components/tween";

const DAY = 0.1;
const NIGHT = 1.5;

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const onAnimationReady = useCallback((controls: AnimationControls) => {
    controls.startTrack("Wheel");
    controls.startTrack("WheelBlades");
    controls.startTrack("Tree");
    controls.startTrack("Bird");
    controls.startTrack("Cloud1", { speed: 0.15 });
    controls.startTrack("Cloud2", { speed: 0.1 });
    controls.startTrack("Cloud3", { speed: 0.15 });
    controls.startTrack("Smoke");
    controls.startTrack("Water");
    controls.startTrack("LightOff");
    const html = document.querySelector("html");

    let mode = "light";
    let position = DAY;
    const speed = 0.03;
    controls.setControlValue("DayNight", position);

    const updateMode = () => {
      if (html.getAttribute("data-theme") === "light" && mode === "dark") {
        animationTween("daylight", position, DAY, speed, (value) => {
          position = value;
          controls.setControlValue("DayNight", value);
        });
        controls.startTrack("LightOff");
        mode = "light";
      } else if (
        html.getAttribute("data-theme") === "dark" &&
        mode === "light"
      ) {
        animationTween("daylight", position, NIGHT, speed, (value) => {
          position = value;
          controls.setControlValue("DayNight", value);
        });
        controls.startTrack("LightFlicker");
        mode = "dark";
      }
    };

    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === "attributes") {
          updateMode();
        }
      });
    });
    updateMode();

    observer.observe(html, { attributes: true });
  }, []);

  const onRender = useCallback(() => {
    tick();
  }, []);

  return (
    <header className={styles.heroBanner}>
      <div className={styles.stacker}>
        <Player
          width={2048}
          height={800}
          fallbackUrl={fallbackUrl}
          onRender={onRender}
        >
          <Animation
            animation={scenery}
            textureUrl={sceneryTextureUrl}
            options={{ zoom: 2.95, panY: -0.1, panX: 0.05 }}
            onAnimationReady={onAnimationReady}
          />
        </Player>
        <div className={styles.overlay}>
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className="button button--primary button--lg"
              to="/docs/download"
            >
              Download
            </Link>
            <Link
              className="button button--secondary button--lg"
              to="/docs/demo"
            >
              Demo
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Bring your art to life"
      description="Geppetto is a free and open animation tool to create and embed WebGL animations in a website."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
