export interface MyPluginSettings {}

export interface RawSemanticLink {
  from: string;
  to: string;
  /* The HTML is sanitised to a string*/
  [attr: string]: string;
}

export interface ParsedSemanticLink {
  from?: string;
  to?: string;
  inner: string;
  [attr: string]: string | number | Date | boolean;
}

export interface Attr {
  name: string;
  value: string;
}
