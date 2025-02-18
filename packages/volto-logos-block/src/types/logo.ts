export type logoData = {
  data: {
    blocks: logoBlock;
    blocks_layout: {
      items: string[];
    };
  };
  logo_size: string;
  logo_width: string;
};
type logoBlock = {
  alt: string;
  href: link[];
  logo: Logo[];
  openLinkInNewTab: boolean;
};
type link = {
  '@id': string;
  Description: string;
  Title: string;
};
type Logo = {
  '@id': string;
  '@type': string;
  Description: string;
  Title: string;
  image_field: string;
};
