import React from 'react';
import { Message } from 'semantic-ui-react';
import { defineMessages, useIntl } from 'react-intl';
import cx from 'classnames';
import isEmpty from 'lodash/isEmpty';

import type { BlockViewProps } from '@plone/types';
import { flattenToAppURL } from '@plone/volto/helpers';
import { Container } from '@plone/components';
import imageBlockSVG from '@plone/volto/components/manage/Blocks/Image/block-image.svg';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import type { logoData } from '@kitconcept/volto-logos-block/components/Edit';

const messages = defineMessages({
  PleaseChooseLogo: {
    id: 'Please choose a logo as source for this element',
    defaultMessage: 'Please choose a logo as source for this element',
  },
});

interface logosViewProps extends BlockViewProps {
  '@type': string;
  data: logoData;
  isEditMode: boolean;
}

const View = (props: logosViewProps) => {
  const intl = useIntl();
  const { isEditMode } = props;

  const logos = props?.data?.data;
  const logosSize = props?.data?.logo_size;

  const footer_logos_container_width = props?.data?.logo_width;

  return (
    <div id="footer">
      <Container className={cx({ [footer_logos_container_width]: 1 })}>
        <ul
          className={cx('footer-logos', {
            [logosSize]: logosSize,
          })}
        >
          {!isEmpty(logos?.blocks)
            ? logos.blocks_layout.items.map((itemId) => {
                const logo = logos.blocks[itemId];
                const logoInfo: {
                  hrefTitle: string;
                  href: string;
                  logoHref: string;
                  src: string;
                  srcAlt: string;
                  openLinkInNewTab: boolean;
                } = {
                  hrefTitle: '',
                  href: '',
                  logoHref: '',
                  src: '',
                  srcAlt: '',
                  openLinkInNewTab: false,
                };

                if (logo?.href?.length > 0) {
                  logoInfo.hrefTitle = logo.href[0]['title'];
                  logoInfo.href = flattenToAppURL(logo.href[0]['@id']);
                  logoInfo.openLinkInNewTab = logo.openLinkInNewTab;
                }
                if (logo?.logo && logo.logo[0]?.image_scales) {
                  logoInfo.logoHref = logo.logo[0]['@id'];
                  logoInfo.srcAlt = logo['alt'];
                  logoInfo.src = `${flattenToAppURL(logoInfo.logoHref)}/${
                    logo.logo[0].image_scales[logo.logo[0].image_field][0]
                      .download
                  }`;
                } else if (logo?.logo && logo.logo[0]) {
                  logoInfo.logoHref = logo.logo[0]['@id'];
                  logoInfo.srcAlt = logo['alt'];
                  logoInfo.src = `${flattenToAppURL(
                    logoInfo.logoHref,
                  )}/@@images/image`;
                }

                if (!logoInfo.src) return null;

                return (
                  <li className="item" key={itemId}>
                    {/* @ts-ignore */}
                    {logoInfo.href ? (
                      <UniversalLink
                        href={logoInfo.href}
                        openLinkInNewTab={logoInfo.openLinkInNewTab}
                        title={logoInfo.hrefTitle || logoInfo.srcAlt}
                      >
                        <img src={logoInfo.src} alt={logoInfo.srcAlt} />
                      </UniversalLink>
                    ) : (
                      <img src={logoInfo.src} alt={logoInfo.srcAlt} />
                    )}
                  </li>
                );
              })
            : isEmpty(logos?.blocks) &&
              isEditMode && (
                <Message>
                  <div className="grid-teaser-item default">
                    <img src={imageBlockSVG} alt="" />
                    <p>{intl.formatMessage(messages.PleaseChooseLogo)}</p>
                  </div>
                </Message>
              )}
        </ul>
      </Container>
    </div>
  );
};

export default View;
