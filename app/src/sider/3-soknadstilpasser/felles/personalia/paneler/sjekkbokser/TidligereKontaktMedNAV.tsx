import React from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import Checkbox from "nav-frontend-skjema/lib/checkbox";

interface Props {
  tidligereKontaktMedNAV: boolean;
  toggleTidligereKontaktMedNav: () => void;
}

const TidligereKontaktMedNAV = (props: Props & InjectedIntlProps) => {
  const { tidligereKontaktMedNAV, toggleTidligereKontaktMedNav, intl } = props;
  return (
    <Checkbox
      label={intl.formatMessage({
        id: "personalia.label.tidligereKontaktMedNAV"
      })}
      checked={tidligereKontaktMedNAV}
      onChange={toggleTidligereKontaktMedNav}
    />
  );
};

export default injectIntl(TidligereKontaktMedNAV);
