import * as React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { useState } from "react";
import { Select as NAVSelect } from "nav-frontend-skjema";
import Select from "react-select";
import { Normaltekst } from "nav-frontend-typografi";
import { Tabell } from "./Oversiktstabell";

export const VisTabell = (props: {
  tabeller: Tabell[];
  skjemaliste: { skjemanummer: string; skjemanavn: string }[];
}) => {
  const { tabeller } = props;
  const alleSkjema = { skjemanummer: "Alle skjemaer", skjemanavn: "" };
  const alleEmneord = "Alle";

  const [valgtEmneord, settValgtEmneord] = useState(alleEmneord);
  const [valgtSkjema, settValgtSkjema] = useState(alleSkjema);

  const settSkjema = (selected: any) => {
    settValgtEmneord(alleEmneord);
    settValgtSkjema(selected["value"]);
  };

  const settEmneord = (selected: any) => {
    settValgtEmneord(selected.currentTarget.value);
    settValgtSkjema(alleSkjema);
  };

  return (
    <>
      <div className="skjemautlisting__paneler">
        <NAVSelect
          className="skjemautlisting__select--padding"
          label="Velg skjemaer for:"
          bredde={"xxl"}
          value={valgtEmneord}
          onChange={settEmneord}
        >
          <option key="alle" value="Alle">
            Alle områder
          </option>
          {tabeller.map(tabell => (
            <option key={tabell.emneord} value={tabell.emneord}>
              {tabell.emneord}
            </option>
          ))}
        </NAVSelect>
        <div style={{ width: "50%" }}>
          <Normaltekst className="skjemautlisting__selectlabel--padding">
            Søk etter skjema:
          </Normaltekst>
          <Select
            onChange={settSkjema}
            value={{
              value: valgtSkjema,
              label: `${valgtSkjema.skjemanummer} ${valgtSkjema.skjemanavn}`
            }}
            options={props.skjemaliste.map(skjema => ({
              value: skjema,
              label: `${skjema.skjemanummer} ${skjema.skjemanavn}`
            }))}
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
  valgtEmneord: string,
  valgtSkjema: { skjemanummer: string; skjemanavn: string },
  tabeller: Tabell[]
) => {
  return valgtEmneord === "Alle"
    ? valgtSkjema.skjemanummer === "Alle skjemaer"
      ? tabeller
      : tabeller
          .map(tabell => {
            return {
              ...tabell,
              data: tabell.data.filter(
                data => data.skjemanavn === valgtSkjema.skjemanavn
              )
            };
          })
          .filter(tabell => tabell.data.length > 0)
    : tabeller.filter(tabell => tabell.emneord === valgtEmneord);
};
