import { MyPluginSettings } from "./interfaces";

export const DEFAULT_SETTINGS: MyPluginSettings = {};

/** Match the entire SL element */
export const SL_ELEMENT = new RegExp(/<a.*?>.*?<\/a>/, "g");
export const A_TAG = new RegExp(/^\s*<a.*?>.*?<\/a>\s*$/);
/** Match the opening tag of the SL.
 *
 * Group 1: Attributes (if none, "")
 */
export const SL_OPEN = new RegExp(/<a(.*?)>/);

export const WIKILINK_STR = "(\\[\\[.*?\\]\\])";
export const LINK_BEFORE = new RegExp(WIKILINK_STR + "<a");
export const LINK_AFTER = new RegExp("<\\/a>" + WIKILINK_STR);
