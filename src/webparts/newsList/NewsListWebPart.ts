import * as React from "react";
import * as ReactDom from "react-dom";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { loadBrandFonts } from "./utils/fonts";

import NewsList from "./components/NewsList";
import newsData from "../newsList/data/news.json";

export default class NewsWebPart extends BaseClientSideWebPart<{}> {
  public async onInit(): Promise<void> {
    loadBrandFonts();
  }

  public render(): void {
    const safeNews = Array.isArray(newsData) ? newsData : [];

    const element = React.createElement(NewsList, {
      items: safeNews,
    });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
}
