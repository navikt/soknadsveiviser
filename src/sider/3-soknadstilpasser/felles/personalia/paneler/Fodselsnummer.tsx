import * as React from "react";
import { Field, FieldProps } from "formik";
import FodselsnummerFelter from "./felter/Fodselsnummer";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import InnsendingsEnhetsvelger from "./InnsendingsEnhetsvelger";
import { Fodselsnummer, medPersonalia, Personalia } from "states/providers/Personalia";
import { medValgtSoknadsobjekt, ValgtSoknad } from "states/providers/ValgtSoknadsobjekt";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import { finnesVisEnheter, finnesTilSkanning, finnesSpesifisertAdresse } from "utils/soknadsobjekter";
import { Klage, Store } from "typer/store";
import { connect } from "react-redux";
import { erKlageEllerAnkeOgSkalSendesTilKlageinstans } from "../../../../../utils/erKlageEllerAnke";
import BlockContent from "@sanity/block-content-to-react";
import { localeBlockTekst } from "../../../../../utils/sprak";
import { link } from "../../../../../utils/serializers";
import { Normaltekst } from "nav-frontend-typografi";
import { SkjemaGruppe } from "nav-frontend-skjema";

interface Routes {
  personEllerBedrift: string;
}

interface ReduxProps {
  klageType: Klage;
}

interface Props {
  skalKlage?: boolean;
  skalAnke?: boolean;
}

type MergedProps = Props & ValgtSoknad & Personalia & RouteComponentProps<Routes> & InjectedIntlProps & ReduxProps;

const FodselsnummerPanel = (props: MergedProps) => {
  const { intl, valgtSoknadsobjekt, klageType, skalAnke, skalKlage } = props;
  const { personEllerBedrift } = props.match.params;
  const { innsendingsmate, muligeEnheterForInnsending } = valgtSoknadsobjekt;
  const visEnheter = finnesVisEnheter(intl.locale, innsendingsmate);
  const skalTilSkanning = finnesTilSkanning(innsendingsmate);
  const skalTilSpesifisertAdresse = finnesSpesifisertAdresse(innsendingsmate);
  const skalTilValgtEnhet = !skalTilSkanning && !skalTilSpesifisertAdresse && visEnheter;

  const personHarFodselsnummerTekst = () =>
    personEllerBedrift === "bedrift"
      ? "personalia.bedrift.oppgiFodselsnummerDnummer"
      : "personalia.oppgiFodselsnummerDnummer";

  return (
    <Field name="fodselsnummer" label="Fodselsnummer">
      {(pr: FieldProps<Fodselsnummer>) => (
        <Ekspanderbartpanel
          apen={personEllerBedrift !== "bedrift"}
          tittel={<Normaltekst>{intl.formatMessage({ id: personHarFodselsnummerTekst() })}</Normaltekst>}
        >
          <SkjemaGruppe description={<FormattedMessage id={"personalia.undertekstbold.gdpr"} />}>
            <FodselsnummerFelter {...pr} />
            {skalTilValgtEnhet && !erKlageEllerAnkeOgSkalSendesTilKlageinstans(skalKlage, klageType, skalAnke) && (
              <>
                <BlockContent
                  blocks={localeBlockTekst(innsendingsmate.visenheter!, intl.locale)}
                  serializers={{ marks: { link } }}
                />
                <InnsendingsEnhetsvelger
                  placeholder={props.intl.formatMessage({
                    id: "personalia.label.navkontor"
                  })}
                  enhetstyper={muligeEnheterForInnsending}
                  {...pr}
                />
              </>
            )}
            {erKlageEllerAnkeOgSkalSendesTilKlageinstans(skalKlage, klageType, skalAnke) && (
              <InnsendingsEnhetsvelger
                placeholder={props.intl.formatMessage({
                  id: "personalia.label.navkontor"
                })}
                label={intl.formatMessage({
                  id: "klage.velg.behandlende.enhet"
                })}
                {...pr}
              />
            )}
          </SkjemaGruppe>
        </Ekspanderbartpanel>
      )}
    </Field>
  );
};

const mapStateToProps = (store: Store) => ({
  klageType: store.klage
});

export default medValgtSoknadsobjekt<Props & ValgtSoknad>(
  injectIntl<Props & ValgtSoknad & InjectedIntlProps>(
    withRouter<Props & ValgtSoknad & InjectedIntlProps & RouteComponentProps<Routes>, any>(
      // @ts-ignore
      medPersonalia<Exclude<MergedProps, ReduxProps>>(connect(mapStateToProps)(FodselsnummerPanel))
    )
  )
);
