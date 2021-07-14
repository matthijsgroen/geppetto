const version = "1.2.0";

const BASE_URL = `https://github.com/matthijsgroen/geppetto/releases/download/${version}`;
const BUILDS = [
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

const populateDownloadLinks = () => {
  const title = document.getElementById("version") as HTMLHeadingElement;
  title.innerText = `Geppetto ${version}`;

  BUILDS.forEach((build) => {
    const downloadList = document.getElementById(
      `download-${build.platform.toLocaleLowerCase()}`
    ) as HTMLParagraphElement;
    const link = document.createElement("a");
    link.setAttribute("href", `${BASE_URL}/${build.filename}`);
    link.innerText = `${build.arch || build.platform} version`;
    const listItem = document.createElement("li");
    listItem.setAttribute("data-marker", "⬇");
    listItem.appendChild(link);
    downloadList.appendChild(listItem);
  });
};

populateDownloadLinks();
