declare module "@sanity/client" {
  function sanityClient(props: SanityClientProps): any;

  interface SanityClientProps {
    projectId: string;
    dataset: string;
    token: string;
    useCdn: boolean;
  }

  export default sanityClient;
}
