import * as React from "react";
import { Field, FieldProps } from "formik";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import { medPersonalia, Personalia } from "states/providers/Personalia";
import { ValgtEnhet } from "states/providers/Personalia";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import { UndertekstBold } from "nav-frontend-typografi";
import InnsendingsEnhetsvelger from "./InnsendingsEnhetsvelger";
import { Enhetstype } from "../../../../../typer/soknad";

interface Routes {
  personEllerBedrift: string;
}

interface FlerePersonerPanelProps {
  muligeEnheterForInnsending: Enhetstype[] | undefined;
}

type MergedProps = Personalia & RouteComponentProps<Routes> & InjectedIntlProps & FlerePersonerPanelProps;
const FlerePersonerPanel = (props: MergedProps) => {
  const { intl, muligeEnheterForInnsending } = props;

  return (
    <Ekspanderbartpanel
      border={true}
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
            <InnsendingsEnhetsvelger
              label={intl.formatMessage({
                id: "personalia.label.velgnavkontor"
              })}
              placeholder={intl.formatMessage({
                id: "personalia.label.navkontor"
              })}
              enhetstyper={muligeEnheterForInnsending}
              {...pr}
            />
          </>
        )}
      />
    </Ekspanderbartpanel>
  );
};

export default injectIntl(withRouter(medPersonalia(FlerePersonerPanel)));
