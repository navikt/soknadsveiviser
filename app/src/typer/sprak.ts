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
  [key: string]: Editorobjekt[] | undefined;
  nb?: Editorobjekt[];
  en?: Editorobjekt[];
  nn?: Editorobjekt[];
  se?: Editorobjekt[];
  fr?: Editorobjekt[];
  es?: Editorobjekt[];
  de?: Editorobjekt[];
  pl?: Editorobjekt[];
}

export interface EditorobjektChildren {
  _key: string;
  _type: string;
  marks: [];
  text: string;
}

export interface Editorobjekt {
  _key: string;
  _type: string;
  children: EditorobjektChildren[];
}
