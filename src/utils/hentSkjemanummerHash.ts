export const hentSkjemanummerHash = (locationHash: string) => {
  if (locationHash) {
    let valgtSkjemanummer = locationHash.split("#")[1].split("%20");
    return valgtSkjemanummer.length > 1 ? `${valgtSkjemanummer[0]} ${valgtSkjemanummer[1]}` : valgtSkjemanummer[0];
  }
  return "";
};
