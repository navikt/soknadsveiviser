export const hentUrl = (url: string) => url.slice(-1) === "/" ? url.slice(0, -1) : url;
