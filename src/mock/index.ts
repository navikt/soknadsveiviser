import fetchMock from "fetch-mock";
import navKontor from "./api/kontor";
import forside from "./api/forside";
import { getDefault } from "../config";

const delay = (min: number, max: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, Math.random() * (max - min) + min);
  });
};

// Mock settings
fetchMock.config.fallbackToNetwork = true;

// Mock spesifikke sider
const mockKategorier = false;
const mockSoknadsobjekter = false;
const mockPdfFoersteside = false;
const mockPdfMerger = false;

export const setUpMock = () => {
  fetchMock.get("/soknader/config", getDefault() as any);

  fetchMock.get(
    "path:/soknader/api/enheter",
    delay(2000, 3000).then(() => navKontor)
  );

  mockKategorier &&
    fetchMock.get(
      `http://localhost:3000/soknader/api/sanity/allekategorier`,
      delay(500, 1000).then(() => 500)
    );

  mockSoknadsobjekter &&
    fetchMock.get(
      `begin:http://localhost:3000/soknader/api/sanity/soknadsobjekter-og-soknadslenker`,
      delay(500, 1000).then(() => 500)
    );

  mockPdfFoersteside &&
    fetchMock.post(
      "/soknader/api/forsteside",
      delay(500, 1000).then(() => forside)
    );

  mockPdfMerger &&
    fetchMock.post(
      `http://localhost:3000/soknader/api/sanity/merge-pdf`,
      delay(500, 1000).then(() => 500)
    );
};

export default setUpMock;
