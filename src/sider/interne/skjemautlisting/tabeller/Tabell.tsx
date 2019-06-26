import * as React from "react";
import ReactTable from "react-table";
import { useState } from "react";
import { Select as NAVSelect } from "nav-frontend-skjema";
import Select from "react-select";
import { Normaltekst } from "nav-frontend-typografi";
import { Tabell } from "./Oversiktstabell";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";

interface TabellProps {
  tabeller: Tabell[];
  skjemaliste: { skjemanummer: string; skjemanavn: string }[];
}

type Props = TabellProps & InjectedIntlProps;

const VisTabell = (props: Props) => {
  const { tabeller, intl, skjemaliste } = props;

  const defaultValueEmneord = {
    value: "alle",
    label: intl.formatMessage({ id: "skjemautlisting.tabell.alleomrader" })
  };

  const defaultValueSkjema = {
    value: {
      skjemanummer: "alle",
      skjemanavn: ""
    },
    label: intl.formatMessage({
      id: "skjemautlisting.tabell.alleskjemaer"
    })
  };

  const [valgtEmneord, settValgtEmneord] = useState(defaultValueEmneord);
  const [valgtSkjema, settValgtSkjema] = useState(defaultValueSkjema);

  const settSkjema = (selected: any) => {
    settValgtEmneord(defaultValueEmneord);
    settValgtSkjema(selected);
  };

  const settEmneord = (selected: any) => {
    settValgtEmneord(selected.currentTarget);
    settValgtSkjema(defaultValueSkjema);
  };

  return (
    <>
      <div className="skjemautlisting__paneler">
        <NAVSelect
          className="skjemautlisting__select--padding"
          label={intl.formatMessage({
            id: "skjemautlisting.tabell.velgskjemaerfor"
          })}
          bredde={"xxl"}
          onChange={settEmneord}
          value={valgtEmneord.value}
        >
          <option key={defaultValueEmneord.value} value={defaultValueEmneord.value}>
            {defaultValueEmneord.label}
          </option>
          {tabeller.map(tabell => (
            <option key={tabell.emneord} value={tabell.emneord}>
              {tabell.emneord}
            </option>
          ))}
        </NAVSelect>
        <div style={{ width: "50%" }}>
          <Normaltekst className="skjemautlisting__selectlabel--padding">
            <FormattedMessage id="skjemautlisting.tabell.soketterskjema" />
          </Normaltekst>
          <Select
            onChange={settSkjema}
            value={valgtSkjema}
            options={[defaultValueSkjema].concat(
              skjemaliste.map(skjema => ({
                key: skjema.skjemanummer,
                value: skjema,
                label: `${skjema.skjemanummer} ${skjema.skjemanavn}`
              }))
            )}
          />
        </div>
      </div>
      <div className="flex">
        {filtrerTabell(valgtEmneord, valgtSkjema, tabeller).map(tabell => (
          <ReactTable
            className="-striped -highlight typo-normal skjemautlisting__litenmargin-overunder"
            key={tabell.emneord}
            data={tabell.data}
            columns={tabell.kolonneHeadersGittTema}
            showPagination={false}
            minRows={1}
            defaultPageSize={10000} // skal være "uendelig"
          />
        ))}
      </div>
    </>
  );
};

const filtrerTabell = (
  valgtEmneord: { value: string; label: string },
  valgtSkjema: {
    value: { skjemanummer: string; skjemanavn: string };
    label: string;
  },
  tabeller: Tabell[]
) => {
  return valgtEmneord.value === "alle"
    ? valgtSkjema.value.skjemanummer === "alle"
      ? tabeller
      : tabeller
          .map(tabell => {
            return {
              ...tabell,
              data: tabell.data.filter(
                data => (data.skjemanavn === valgtSkjema.value.skjemanavn && data.key === valgtSkjema.value.skjemanummer)
              )
            };
          })
          .filter(tabell => tabell.data.length > 0)
    : tabeller.filter(tabell => tabell.emneord === valgtEmneord.value);
};

export default injectIntl(VisTabell);
