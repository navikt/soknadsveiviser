export interface SprakString {
  [key: string]: string | undefined;
  nb?: string;
  en?: string;
  nn?: string;
  se?: string;
  fr?: string;
  es?: string;
  de?: string;
  pl?: string;
}

export interface SprakBlockText {
  [key: string]: Editorobjekt | undefined;
  nb?: Editorobjekt;
  en?: Editorobjekt;
  nn?: Editorobjekt;
  se?: Editorobjekt;
  fr?: Editorobjekt;
  es?: Editorobjekt;
  de?: Editorobjekt;
  pl?: Editorobjekt;
}

export interface Editorobjekt {
  children: any;
  markDefs: any;
}
