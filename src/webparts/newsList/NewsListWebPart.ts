import * as React from "react";
import * as ReactDom from "react-dom";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { loadBrandFonts } from "./utils/fonts";

import { NewsList } from "./components/NewsList";

export default class NewsWebPart extends BaseClientSideWebPart<{}> {
  public async onInit(): Promise<void> {
    loadBrandFonts();
  }

  public render(): void {
    const element = React.createElement(NewsList);

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
}
