import { Skjema } from "../sider/4-avslutning/steg/SkjemaVisning";
import { SprakBlockText, SprakString } from "./sprak";

export interface Vedleggsobjekt {
  _key: string;
  pakrevd?: boolean;
  situasjon?: SprakString;
  beskrivelse?: SprakBlockText;
  vedlegg: Vedlegg;
  skalSendes?: boolean;
  skalEttersendes?: boolean;
  soknadsobjektId?: string;
}

export interface Vedlegg {
  gosysid: string;
  kanskannes?: boolean;
  skjematilvedlegg?: Skjema;
  vedleggsid: string;
  navn: SprakString;
  beskrivelse?: SprakBlockText;
}
