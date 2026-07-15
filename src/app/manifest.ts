import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cook for Me",
    short_name: "Cook for Me",
    description: "把每一道家常菜做明白",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF8ED",
    theme_color: "#F0643A",
    lang: "zh-CN",
  };
}
