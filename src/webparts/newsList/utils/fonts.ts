import { SPComponentLoader } from "@microsoft/sp-loader";

export function loadBrandFonts() {
  SPComponentLoader.loadCss(
    "https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&display=swap"
  );
}
