import React, { ReactNode } from "react";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import configureStore from "redux-mock-store";
import "@testing-library/jest-dom/extend-expect";

import IntlProviderWrapper from "../../../sprak/IntlProviderWrapper";
import { createDummySoknadsobjekt } from "../../../test-utils/dummy-soknadsobjekt";
import { Soknadsinnganger } from "./Soknadsinnganger";

const LOCALE = "nb";
const TYPE_BUTTON = "knapp";
const TYPE_LINK = "lenke";
const TEXT_TIL_DIGITAL_INNSENDING = "Send digitalt";
const TEXT_TIL_PAPIR_INNSENDING = "Send på papir";
const TEXT_TIL_FYLL_UT = "Fyll ut";
const URL_TIL_SOKNADSDIALOG = "url-til-soknadsdialog";
const URL_TIL_FYLLUT = "url-til-fyllut";
const URL_TIL_DOKUMENT_INNSENDING = "/skjema-nummer/dokumentinnsending";
const URL_TIL_PAPIRINNSENDING = "/skjema-nummer/brev";

const middlewares: any[] = [];

interface TestWrapperProps {
  children: ReactNode;
}

function TestWrapper({ children }: TestWrapperProps) {
  const mockStore = configureStore(middlewares);
  const initialState = {};
  const reduxStore = mockStore(initialState);
  return (
    <MemoryRouter initialEntries={["flesk"]}>
      <Provider store={reduxStore}>
        <IntlProviderWrapper>{children}</IntlProviderWrapper>
      </Provider>
    </MemoryRouter>
  );
}

function expectToFindLink(text: string, url: string, type: string) {
  const link = screen.getByRole("link", { name: text });
  expect(link).toBeDefined();
  expect(link).toHaveAttribute("href", url);
  expect(link.classList).toContain(type);
}

describe("Soknadsinnganger", () => {
  it("WITHOUT soknadsdialogURL, dokumentinnsending AND fyllUtURL should ONLY render knapp to papirinnsending (pdf)", () => {
    const dummySoknadsobjekt = createDummySoknadsobjekt("", false, "");
    render(
      <TestWrapper>
        <Soknadsinnganger soknadsobjekt={dummySoknadsobjekt} locale={LOCALE}/>
      </TestWrapper>
    );
    expectToFindLink(TEXT_TIL_PAPIR_INNSENDING, URL_TIL_PAPIRINNSENDING, TYPE_BUTTON);
  });

  it("WITHOUT soknadsdialogURL OR dokumentinnsending, but WITH fyllUtURL should ONLY render button to fyllut", () => {
    const dummySoknadsobjekt = createDummySoknadsobjekt("", false, URL_TIL_FYLLUT);
    render(
      <TestWrapper>
        <Soknadsinnganger soknadsobjekt={dummySoknadsobjekt} locale={LOCALE} />
      </TestWrapper>
    );
    expectToFindLink(TEXT_TIL_FYLL_UT, URL_TIL_FYLLUT, TYPE_BUTTON);
  });

  it("WITHOUT soknadsdialogURL OR fyllut, but WITH dokumentinnsending should render button to dokumentinnsending AND link to papirinnsending (pdf)", () => {
    const dummySoknadsobjekt = createDummySoknadsobjekt("", true, "");
    render(
      <TestWrapper>
        <Soknadsinnganger soknadsobjekt={dummySoknadsobjekt} locale={LOCALE} />
      </TestWrapper>
    );
    expectToFindLink(TEXT_TIL_DIGITAL_INNSENDING, URL_TIL_DOKUMENT_INNSENDING, TYPE_BUTTON);
    expectToFindLink(TEXT_TIL_PAPIR_INNSENDING, URL_TIL_PAPIRINNSENDING, TYPE_LINK);
  });

  it("WITHOUT soknadsdialogURL, but WITH dokumentinnsending AND fyllUtURL should ONLY render button to fyllut", () => {
    const dummySoknadsobjekt = createDummySoknadsobjekt("", true, URL_TIL_FYLLUT);
    render(
      <TestWrapper>
        <Soknadsinnganger soknadsobjekt={dummySoknadsobjekt} locale={LOCALE} />
      </TestWrapper>
    );
    expectToFindLink(TEXT_TIL_FYLL_UT, URL_TIL_FYLLUT, TYPE_BUTTON);
  });

  it("WITH soknadsdialogURL, but WITHOUT dokumentinnsending AND fyllUtURL should render button to soknadsdialog AND link to papirinnsending (pdf)", () => {
    const dummySoknadsobjekt = createDummySoknadsobjekt(URL_TIL_SOKNADSDIALOG, false, "");
    render(
      <TestWrapper>
        <Soknadsinnganger soknadsobjekt={dummySoknadsobjekt} locale={LOCALE} />
      </TestWrapper>
    );
    expectToFindLink(TEXT_TIL_DIGITAL_INNSENDING, URL_TIL_SOKNADSDIALOG, TYPE_BUTTON);
    expectToFindLink(TEXT_TIL_PAPIR_INNSENDING, URL_TIL_PAPIRINNSENDING, TYPE_LINK);
  });
  it("WITH soknadsdialogURL AND fyllUtURL, but WITHOUT dokumentinnsending should render button to soknadsdialog AND link to fyllut", () => {
    const dummySoknadsobjekt = createDummySoknadsobjekt(URL_TIL_SOKNADSDIALOG, false, URL_TIL_FYLLUT);
    render(
      <TestWrapper>
        <Soknadsinnganger soknadsobjekt={dummySoknadsobjekt} locale={LOCALE} />
      </TestWrapper>
    );
    expectToFindLink(TEXT_TIL_DIGITAL_INNSENDING, URL_TIL_SOKNADSDIALOG, TYPE_BUTTON);
    expectToFindLink(TEXT_TIL_PAPIR_INNSENDING, URL_TIL_FYLLUT, TYPE_LINK);
  });
  it("WITH soknadsdialogURL AND dokumentinnsending, but WITHOUT fyllUtURL should render button to soknadsdialog AND link to papirinnsending (pdf)", () => {
    const dummySoknadsobjekt = createDummySoknadsobjekt(URL_TIL_SOKNADSDIALOG, true, "");
    render(
      <TestWrapper>
        <Soknadsinnganger soknadsobjekt={dummySoknadsobjekt} locale={LOCALE} />
      </TestWrapper>
    );
    expectToFindLink(TEXT_TIL_DIGITAL_INNSENDING, URL_TIL_SOKNADSDIALOG, TYPE_BUTTON);
    expectToFindLink(TEXT_TIL_PAPIR_INNSENDING, URL_TIL_PAPIRINNSENDING, TYPE_LINK);
  });
  it("WITH soknadsdialogURL AND dokumentinnsending AND fyllUtURL should render button to soknadsdialog AND link to fyllut", () => {
    const dummySoknadsobjekt = createDummySoknadsobjekt(URL_TIL_SOKNADSDIALOG, true, URL_TIL_FYLLUT);
    render(
      <TestWrapper>
        <Soknadsinnganger soknadsobjekt={dummySoknadsobjekt} locale={LOCALE} />
      </TestWrapper>
    );
    expectToFindLink(TEXT_TIL_DIGITAL_INNSENDING, URL_TIL_SOKNADSDIALOG, TYPE_BUTTON);
    expectToFindLink(TEXT_TIL_PAPIR_INNSENDING, URL_TIL_FYLLUT, TYPE_LINK);
  });
});
