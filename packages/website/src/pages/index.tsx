import  { useCallback } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";
import HomepageFeatures from "../components/HomepageFeatures";
import { Player, Animation } from "../components/Player";
import scenery from "@site/static/demo-assets/scenery.json";
import sceneryTextureUrl from "@site/static/demo-assets/scenery.png";
import socialImageUrl from "@site/static/img/static-image.jpg";
import fallbackUrl from "@site/static/img/static-homepage.jpg";
import { AnimationControls, ImageDefinition } from "geppetto-player";
import {  tick } from "../components/tween";
import BrowserOnly from "@docusaurus/BrowserOnly";

const DAY = 0.0;
const NIGHT = 0.5;

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const onAnimationReady = useCallback((controls: AnimationControls) => {
    controls.startAnimation("Wheel");
    controls.startAnimation("WheelBlades");
    controls.startAnimation("Tree");
    controls.startAnimation("Bird");
    controls.startAnimation("Cloud1", { speed: 0.15 });
    controls.startAnimation("Cloud2", { speed: 0.1 });
    controls.startAnimation("Cloud3", { speed: 0.15 });
    controls.startAnimation("Smoke");
    controls.startAnimation("Water");
    controls.startAnimation("LightOff");
    const html = document.querySelector("html");

    let mode = "light";
    let position = DAY;
    controls.setControlValue("DayNight", position);

    const updateMode = () => {
      if (html && html.getAttribute("data-theme") === "light" && mode === "dark") {
        controls.tweenControlTo("DayNight", DAY, 1_000, { easing: "easeInOut" });
        controls.startAnimation("LightOff");
        mode = "light";
      } else if (
        html && html.getAttribute("data-theme") === "dark" &&
        mode === "light"
      ) {
        controls.tweenControlTo("DayNight", NIGHT, 1_000, { easing: "easeInOut" });
        controls.startAnimation("LightFlicker");
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
        <BrowserOnly>
          {() => (
            <Player
              width={2048}
              height={800}
              fallbackUrl={fallbackUrl}
              onRender={onRender}
            >
              <Animation
                animation={scenery as unknown as ImageDefinition}
                textureUrl={sceneryTextureUrl}
                options={{ fitMode: "cover", panY: -0.2 }}
                onAnimationReady={onAnimationReady}
              />
            </Player>
          )}
        </BrowserOnly>
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
  return (
    <Layout
      title="Bring your art to life"
      description="Geppetto is a free and open animation tool to create and embed WebGL animations in a website."
      image={socialImageUrl}
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
