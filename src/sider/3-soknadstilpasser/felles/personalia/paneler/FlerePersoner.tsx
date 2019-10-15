import * as React from "react";
import { Field, FieldProps } from "formik";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import {
  ValgtEnhet,
  Fodselsnummer,
  Adresse,
  Personalia
} from "states/providers/Personalia";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import VisEnheter from "./felter/VisEnheter";
import { UndertekstBold } from "nav-frontend-typografi";
import { connect } from "react-redux";
import { Klage, Store } from "typer/store";
import ErVideresendtTilEnhet from "./ErVideresendtTilEnhet";

interface ReduxProps {
  klage: Klage;
}

type MergedProps = Personalia &
  InjectedIntlProps &
  ReduxProps &
  FieldProps<Fodselsnummer | Adresse>;

const FlerePersonerPanel = (props: MergedProps) => {
  const { intl, klage } = props;

  return (
    <Ekspanderbartpanel
      tittelProps="normaltekst"
      tittel={intl.formatMessage({ id: "personalia.bedrift.flerepersoner" })}
    >
      <Field
        name="flerepersoner"
        label="Flere personer"
        render={(pr: FieldProps<ValgtEnhet>) => (
          <>
            <UndertekstBold>
              <FormattedMessage
                id={"personalia.undertekstbold.flerepersoner"}
              />
            </UndertekstBold>
            <VisEnheter
              label={intl.formatMessage({
                id: "personalia.label.velgnavkontor"
              })}
              placeholder={intl.formatMessage({
                id: "personalia.label.navkontor"
              })}
              {...pr}
            />
            {klage.erVideresendt && <ErVideresendtTilEnhet {...pr} />}
          </>
        )}
      />
    </Ekspanderbartpanel>
  );
};

const mapStateToProps = (store: Store) => ({
  klage: store.klage
});

export default injectIntl<InjectedIntlProps>(
  connect(mapStateToProps)(FlerePersonerPanel)
);
