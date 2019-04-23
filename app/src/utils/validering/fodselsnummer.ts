const k1 = [3, 7, 6, 1, 8, 9, 4, 5, 2];
const k2 = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
const decimalRadix = 10;

const erGyldigK1 = (fodselsnummer: string): boolean => {
  const tempK1 = fodselsnummer
    .substring(0, 9)
    .split("")
    .map((value, index) => parseInt(value, decimalRadix) * k1[index])
    .reduce((acc, val) => (acc += +val), 0);
  const K1 = tempK1 % 11 === 0 ? 0 : 11 - (tempK1 % 11);
  return K1 === parseInt(fodselsnummer.substring(9, 10), decimalRadix);
};

const erGyldigK2 = (fodselsnummer: string): boolean => {
  const tempK2 = fodselsnummer
    .substring(0, 10)
    .split("")
    .map((value, index) => parseInt(value, decimalRadix) * k2[index])
    .reduce((acc, val) => (acc += +val), 0);
  const K2 = tempK2 % 11 === 0 ? 0 : 11 - (tempK2 % 11);
  return K2 === parseInt(fodselsnummer.substring(10), decimalRadix);
};

export const erGyldigeKontrollsifre = (fodselsnummer: string) =>
  erGyldigK1(fodselsnummer) && erGyldigK2(fodselsnummer);

export const erGyldigFodselsnummer = (fodselsnummer: string) =>
  fodselsnummer.length !== 11 ? false : erGyldigeKontrollsifre(fodselsnummer);
