import { Plugin, TFile } from "obsidian";
import { A_TAG, DEFAULT_SETTINGS } from "./const";
import { Attr, MyPluginSettings, ParsedSemanticLink } from "./interfaces";
import { SettingTab } from "./SettingTab";

export default class MyPlugin extends Plugin {
  settings: MyPluginSettings;
  index: ParsedSemanticLink[];

  async onload() {
    await this.loadSettings();

    this.addCommand({
      id: "cmd",
      name: "Command",
      callback: async () => {
        console.time("cmd");
        console.log(await this.getSLs(this.app.workspace.getActiveFile()));
        console.timeEnd("cmd");
      },
    });
    this.addSettingTab(new SettingTab(this.app, this));
  }

  onunload() {}

  // parseAttrs(attrs: string): ParsedSemanticLink {

  // }

  // async getSLs(file: TFile): Promise<ParsedSemanticLink[]> {
  //   const SLs: ParsedSemanticLink[] = [];
  //   const { links } = this.app.metadataCache.getFileCache(file);
  //   if (!links) return;

  //   const content = await this.app.vault.cachedRead(file);
  //   const matches = [...content.matchAll(SL_ELEMENT)];

  //   matches.forEach((match) => {
  //     console.log({ match });
  //     const [text, index] = [match[0], match.index];
  //     const lBefore = links.find((l) => l.position.end.offset + 1 === index);
  //     const lAfter = links.find(
  //       (l) => l.position.start.offset - 1 === index + text.length
  //     );
  //     if (!lBefore && !lAfter) return;

  //     var { firstChild } = createEl("a", {}, (el) => (el.innerHTML = text));
  //     const attrs = [...firstChild.attributes];
  //     const currSL: ParsedSemanticLink = { inner: "" };
  //     currSL.from = lBefore.link;
  //     currSL.to = lAfter.link;
  //     currSL.inner = firstChild.innerText;
  //     attrs.forEach((attr) => {
  //       const { name, value } = attr;
  //       currSL[name] = value === "" ? true : value;
  //     });
  //     SLs.push(currSL);
  //   });
  //   return SLs;
  // }

  // async getSL(file: TFile): Promise<ParsedSemanticLink[]> {
  //   const { links } = this.app.metadataCache.getFileCache(file);
  //   if (!links) return;

  //   const content = await this.app.vault.cachedRead(file);

  //   const tempLinks: { link: LinkCache; aBefore: string; aAfter: string }[] =
  //     [];
  //   links.forEach((l) => {
  //     const {
  //       position: { start, end },
  //     } = l;
  //     const sOff = start.offset;
  //     const eOff = end.offset;

  //     const tBefore = content.slice(0, sOff === 0 ? 0 : sOff - 1);
  //     const tAfter = content.slice(
  //       eOff === content.length ? content.length : eOff + 1
  //     );

  //     const aBefore = tBefore.split("<a").last();
  //     const aAfter = tAfter.split("</a>").first();

  //     const currLink: { link: LinkCache; aBefore: string; aAfter: string } = {
  //       link: l,
  //       aBefore: undefined,
  //       aAfter: undefined,
  //     };

  //     if (aBefore) currLink.aBefore = "<a" + aBefore;
  //     if (aAfter) currLink.aAfter = aAfter + "</a>";

  //     tempLinks.push(currLink);
  //   });
  //   console.log(tempLinks);

  //   const SLs: ParsedSemanticLink[] = [];
  //   tempLinks.forEach((currL) => {
  //     const matchingLink = tempLinks.find(
  //       (l) =>
  //         currL.aAfter &&
  //         currL.link.position.end.offset + 2 + currL.aAfter.length ===
  //           l.link.position.start.offset
  //     );
  //     console.log({ matchingLink });
  //     if (matchingLink !== undefined) {
  //       var { firstChild } = createEl(
  //         "a",
  //         {},
  //         (el) => (el.innerHTML = matchingLink.aBefore)
  //       );
  //       const attrs = [...firstChild.attributes];
  //       const currSL: ParsedSemanticLink = { inner: "" };
  //       currSL.from = currL.link.link;
  //       currSL.to = matchingLink.link.link;
  //       currSL.inner = firstChild.innerText;
  //       attrs.forEach((attr) => {
  //         const { name, value } = attr;
  //         currSL[name] = value === "" ? true : value;
  //       });
  //       SLs.push(currSL);
  //     }
  //   });
  //   console.log({ SLs });
  // }

  async getSLs(file: TFile): Promise<ParsedSemanticLink[]> {
    const { links } = this.app.metadataCache.getFileCache(file);
    if (!links) return;
    const SLs: ParsedSemanticLink[] = [];

    const content = await this.app.vault.cachedRead(file);

    links.forEach((curr, i) => {
      const next = links[i + 1];
      if (!next) return;

      const currE = curr.position.end.offset;
      const nextS = next.position.start.offset;
      const between = content.slice(currE, nextS);

      const tag = between.match(A_TAG)?.[0];
      console.log(tag);
      if (tag) {
        var { firstChild } = createEl(
          "div",
          {},
          (el) => (el.innerHTML = tag.trim())
        );

        const currSL: ParsedSemanticLink = {
          inner: firstChild.innerText,
          from: curr.link,
          to: next.link,
        };

        [...firstChild.attributes].forEach((attr: Attr) => {
          const { name, value } = attr;
          currSL[name] = value || true;
        });
        SLs.push(currSL);
      }
    });
    return SLs;
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
