export const hentSkjemanummerHash = (locationHash: string) => {
  if (locationHash) {
    return locationHash.split("#")[1];
  }
  return "";
};

export const convertNAVSkjemanummerTilHash = (skjemanummer: string) => skjemanummer.replace(/[^a-zA-Z0-9]/g, "");
