import {
  EditorSuggest,
  EditorPosition,
  Editor,
  TFile,
  EditorSuggestTriggerInfo,
  EditorSuggestContext,
} from "obsidian";
import SLPlugin from "./main";

export default class EmojiSuggester extends EditorSuggest<string> {
  plugin: SLPlugin;
  options: string[] = ["type1", "type2", "another", "more"];

  constructor(plugin: SLPlugin) {
    super(plugin.app);
    this.plugin = plugin;
  }

  onTrigger(
    cursor: EditorPosition,
    editor: Editor
  ): EditorSuggestTriggerInfo | null {
    const sub = editor.getLine(cursor.line).substring(0, cursor.ch);
    const match = sub.match(/<a[\s\w]*?(\w*)$/);
    const query = match?.[1].trim();
    if (query !== undefined) {
      return {
        end: cursor,
        start: {
          ch: match.index,
          line: cursor.line,
        },
        query,
      };
    }

    return null;
  }

  getSuggestions(context: EditorSuggestContext): string[] {
    if (context.query === "") {
      return this.options;
    }
    return this.options.filter((p) =>
      p.includes(context.query.replace("<a", ""))
    );
  }

  renderSuggestion(suggestion: string, el: HTMLElement): void {
    const outer = el.createDiv({ cls: "SL-suggester-container" });
    outer.createDiv().setText(suggestion);
  }

  selectSuggestion(suggestion: string): void {
    const { editor, query, start, end } = this.context;
    const range = editor.getRange(start, end);
    const realStart = editor.posToOffset(editor.getCursor()) - query.length;

    if (this.context) {
      editor.replaceRange(
        `${range[range.length - 1] === " " ? "" : " "}${suggestion} `,
        editor.offsetToPos(realStart),
        end
      );
    }
  }
}
