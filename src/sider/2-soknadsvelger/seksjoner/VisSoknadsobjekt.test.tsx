import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { Soknadsinnganger } from "./VisSoknadsobjekt";

const URL_TIL_SOKNADSDIALOG = "url-til-soknadsdialog";
const URL_TIL_FYLLUT = "url-til-fyllut";
const URL_TIL_DOKUMENT_INNSENDING = "";
const URL_TIL_PAPIRINNSENDING = "";

const createDummySoknadsobjekt = (soknadsdialogURL: string, dokumentInnsending: boolean, fyllUtURL: string) => ({
  _id: "",
  navn: {
    no: "",
  },
  gosysid: "",
  tema: "",
  urlparam: "",
  vedleggtilsoknad: [],
  innsendingsmate: "",
  brukertyper: [],
  hovedskjema: [],
  digitalinnsending: {
    dokumentinnsending: dokumentInnsending,
    inngangtilsoknadsdialog: {
      soknadsdialogURL: {
        no: fyllUtURL,
      },
    },
    fyllut: {
      lenker: {
        no: soknadsdialogURL,
      },
    },
  },
});

describe("Soknadsinnganger", () => {
  it("WITHOUT soknadsdialogURL, dokumentinnsending AND fyllUtURL should ONLY render knapp to papirinnsending (pdf)", () => {
    const dummySoknadsobjekt = createDummySoknadsobjekt(null, false, null);
    render(<Soknadsinnganger soknadsobjekt={dummySoknadsobjekt} locale="no" />);
    const buttonToPapirInnsending = screen.getByText("Send på papir");
    expect(buttonToPapirInnsending).toBeDefined();
  });

  it("WITHOUT soknadsdialogURL OR dokumentinnsending, but WITH fyllUtURL should ONLY render button to fyllut", () => {
    const dummySoknadsobjekt = createDummySoknadsobjekt(null, false, URL_TIL_FYLLUT);
    render(<Soknadsinnganger soknadsobjekt={dummySoknadsobjekt} locale="no" />);
    const buttonToFyllUt = screen.getByText("Søk");
    expect(buttonToFyllUt).toBeDefined();
  });

  it("WITHOUT soknadsdialogURL OR fyllut, but WITH dokumentinnsending should render button to dokumentinnsending AND link to papirinnsending (pdf)", () => {
    const dummySoknadsobjekt = createDummySoknadsobjekt(null, true, null);
    render(<Soknadsinnganger soknadsobjekt={dummySoknadsobjekt} locale="no" />);
    const buttonToDokumentInnsending = screen.getByText("Søk digitalt");
    expect(buttonToDokumentInnsending).toBeDefined();
    const linkToPapirInnsending = screen.getByText("Send på papir");
    expect(linkToPapirInnsending).toBeDefined();
  });

  it("WITHOUT soknadsdialogURL, but WITH dokumentinnsending AND fyllUtURL should ONLY render button to fyllut", () => {
    const dummySoknadsobjekt = createDummySoknadsobjekt(null, true, URL_TIL_FYLLUT);
    render(<Soknadsinnganger soknadsobjekt={dummySoknadsobjekt} locale="no" />);
    const buttonToFyllUt = screen.getByText("Søk");
    expect(buttonToFyllUt).toBeDefined();
  });

  it("WITH soknadsdialogURL, but WITHOUT dokumentinnsending AND fyllUtURL should render button to soknadsdialog AND link to papirinnsending (pdf)", () => {
    const dummySoknadsobjekt = createDummySoknadsobjekt(URL_TIL_SOKNADSDIALOG, false, null);
    render(<Soknadsinnganger soknadsobjekt={dummySoknadsobjekt} locale="no" />);
    const buttonToDokumentInnsending = screen.getByText("Søk digitalt");
    expect(buttonToDokumentInnsending).toBeDefined();
    expect(buttonToDokumentInnsending.classList).toContain("knapp");
    expect(buttonToDokumentInnsending).toHaveAttribute("href", URL_TIL_SOKNADSDIALOG);

    const linkToPapirInnsending = screen.getByText("Send på papir");
    expect(linkToPapirInnsending).toBeDefined();
    expect(linkToPapirInnsending.classList).toContain("lenke");
    expect(linkToPapirInnsending).toHaveAttribute("href", URL_TIL_PAPIRINNSENDING);
  });
  it("WITH soknadsdialogURL AND fyllUtURL, but WITHOUT dokumentinnsending should render button to soknadsdialog AND link to fyllut", () => {
    const dummySoknadsobjekt = createDummySoknadsobjekt(URL_TIL_SOKNADSDIALOG, false, URL_TIL_FYLLUT);
    render(<Soknadsinnganger soknadsobjekt={dummySoknadsobjekt} locale="no" />);

    const buttonToDokumentInnsending = screen.getByText("Søk digitalt");
    expect(buttonToDokumentInnsending).toBeDefined();
    expect(buttonToDokumentInnsending.classList).toContain("knapp");
    expect(buttonToDokumentInnsending).toHaveAttribute("href", URL_TIL_SOKNADSDIALOG);

    const linkToPapirInnsending = screen.getByText("Send på papir");
    expect(linkToPapirInnsending).toBeDefined();
    expect(linkToPapirInnsending.classList).toContain("lenke");
    expect(linkToPapirInnsending).toHaveAttribute("href", URL_TIL_FYLLUT);
  });
  it("WITH soknadsdialogURL AND dokumentinnsending, but WITHOUT fyllUtURL should render button to soknadsdialog AND link to papirinnsending (pdf)", () => {
    const dummySoknadsobjekt = createDummySoknadsobjekt(URL_TIL_SOKNADSDIALOG, true, null);
    render(<Soknadsinnganger soknadsobjekt={dummySoknadsobjekt} locale="no" />);

    const buttonToDokumentInnsending = screen.getByText("Søk digitalt");
    expect(buttonToDokumentInnsending).toBeDefined();
    expect(buttonToDokumentInnsending.classList).toContain("knapp");
    expect(buttonToDokumentInnsending).toHaveAttribute("href", URL_TIL_SOKNADSDIALOG);

    const linkToPapirInnsending = screen.getByText("Send på papir");
    expect(linkToPapirInnsending).toBeDefined();
    expect(linkToPapirInnsending.classList).toContain("lenke");
    expect(linkToPapirInnsending).toHaveAttribute("href", URL_TIL_DOKUMENT_INNSENDING);
  });
  it("WITH soknadsdialogURL AND dokumentinnsending AND fyllUtURL should render button to soknadsdialog AND link to fyllut", () => {
    const dummySoknadsobjekt = createDummySoknadsobjekt(URL_TIL_SOKNADSDIALOG, true, URL_TIL_FYLLUT);
    render(<Soknadsinnganger soknadsobjekt={dummySoknadsobjekt} locale="no" />);

    const buttonToDokumentInnsending = screen.getByText("Søk digitalt");
    expect(buttonToDokumentInnsending).toBeDefined();
    expect(buttonToDokumentInnsending.classList).toContain("knapp");
    expect(buttonToDokumentInnsending).toHaveAttribute("href", URL_TIL_SOKNADSDIALOG);

    const linkToPapirInnsending = screen.getByText("Send på papir");
    expect(linkToPapirInnsending).toBeDefined();
    expect(linkToPapirInnsending.classList).toContain("lenke");
    expect(linkToPapirInnsending).toHaveAttribute("href", URL_TIL_FYLLUT);
  });
});
