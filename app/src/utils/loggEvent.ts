const { frontendlogger } = window as any;

const loggEvent = (
  tittel: string,
  fields?: { [key: string]: any },
  tags?: { [key: string]: any }
) => frontendlogger && frontendlogger.event(tittel, fields || {}, tags || {});

export default loggEvent;
