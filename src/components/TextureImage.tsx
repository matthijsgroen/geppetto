import React, { FunctionComponent } from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import style from "./TextureImage.module.css";

type Props = {
  src: string;
  alt: string;
};

const TextureImage: FunctionComponent<Props> = ({ src, alt }) => (
  <img src={useBaseUrl(src)} alt={alt} className={style.textureImage} />
);

export default TextureImage;
