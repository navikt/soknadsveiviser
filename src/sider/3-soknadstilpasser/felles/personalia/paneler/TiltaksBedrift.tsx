import * as React from "react";
import { Field, FieldProps } from "formik";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import { ValgtEnhet } from "states/providers/Personalia";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import VisEnheter from "./felter/VisEnheter";
import { UndertekstBold } from "nav-frontend-typografi";
import { Klage, Store } from "typer/store";
import { connect } from "react-redux";

interface ReduxProps {
  klage: Klage;
}

type MergedProps = ReduxProps & InjectedIntlProps;
const FlerePersonerPanel = (props: MergedProps) => {
  const { intl } = props;

  return (
    <Ekspanderbartpanel
      tittel={intl.formatMessage({ id: "personalia.bedrift.tiltaksbedrift" })}
      tittelProps="normaltekst"
    >
      <Field
        name="tiltaksbedrift"
        label="Tiltaksbedrift"
        render={(pr: FieldProps<ValgtEnhet>) => (
          <>
            <UndertekstBold>
              <FormattedMessage
                id={"personalia.undertekstbold.tiltaksbedrift"}
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
