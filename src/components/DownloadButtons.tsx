import React, { Fragment, useState, VFC } from "react";
import Link from "@docusaurus/Link";
import styles from "./DownloadButtons.module.css";
import BrowserOnly from "@docusaurus/BrowserOnly";

type VersionNumber = `${number}.${number}.${number}`;

const createUrl = (version: string, filename: string): string =>
  `https://github.com/matthijsgroen/geppetto/releases/download/${version}/${filename}`;

type Platform = "Mac" | "Windows" | "Linux";

type Build = {
  platform: Platform;
  filename: string;
  arch?: string;
};

const builds = (version: string): Build[] => [
  { platform: "Mac", arch: "x64", filename: `Geppetto-${version}.dmg` },
  {
    platform: "Mac",
    arch: "arm64",
    filename: `Geppetto-${version}-arm64-mac.dmg`,
  },
  {
    platform: "Windows",
    filename: `Geppetto.Setup.${version}.exe`,
  },
  {
    platform: "Linux",
    arch: "amd64",
    filename: `geppetto_${version}_amd64.deb`,
  },
  {
    platform: "Linux",
    arch: "arm64",
    filename: `geppetto_${version}_arm64.deb`,
  },
];

type Props = {
  version: VersionNumber;
};

type UserAgentData = {
  platform: string;
};

const platformString = (): string =>
  (navigator as Navigator & { userAgentData: UserAgentData })?.userAgentData
    ?.platform || navigator.platform;

function isMacintosh() {
  const ps = platformString();
  return ps.indexOf("Mac") > -1 || ps.indexOf("macOS") > -1;
}

function isWindows() {
  const ps = platformString();
  return ps.indexOf("win") > -1 || ps.indexOf("Win") > -1;
}

const DownloadButtons: VFC<Props> = ({ version }) => {
  const [platform, setPlatform] = useState<Platform>(() =>
    isMacintosh() ? "Mac" : isWindows() ? "Windows" : "Linux"
  );

  const eligibleBuilds = builds(version).filter((b) => b.platform === platform);
  const supportedPlatforms = builds(version)
    .map((b) => b.platform)
    .filter((platform, idx, list) => list.indexOf(platform) === idx);
  const otherPlatforms = supportedPlatforms.filter((p) => p !== platform);

  return (
    <div>
      <div className={styles.buttons}>
        {eligibleBuilds.map((build) => (
          <Link
            key={build.filename}
            className="button button--primary button--lg"
            href={createUrl(version, build.filename)}
          >
            Download Studio {version} for {build.platform} {build.arch}
          </Link>
        ))}
      </div>
      <p style={{ textAlign: "center" }}>
        Other platforms:{" "}
        {otherPlatforms.map((p, idx) => (
          <Fragment key={idx}>
            {idx !== 0 && " | "}
            <a href="#" onClick={() => setPlatform(p)}>
              {p}
            </a>
          </Fragment>
        ))}
      </p>
    </div>
  );
};

const WrappedDownload: React.FunctionComponent<Props> = (props) => (
  <BrowserOnly>{() => <DownloadButtons {...props} />}</BrowserOnly>
);

export default WrappedDownload;
