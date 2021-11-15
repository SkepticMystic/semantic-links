import { App, PluginSettingTab } from "obsidian";
import SLPlugin from "./main";

export class SettingTab extends PluginSettingTab {
  plugin: SLPlugin;

  constructor(app: App, plugin: SLPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;
    containerEl.empty();
  }
}
