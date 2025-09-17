import Helmet from '@plone/volto/helpers/Helmet/Helmet';
import { useSelector } from 'react-redux';
import type { GetSiteResponse } from '@plone/types';

type FormState = {
  site: { data: GetSiteResponse };
};

const TTWCustomCSS = () => {
  const site = useSelector<FormState, GetSiteResponse>(
    (state) => state.site.data,
  );
  const customCSS = site['kitconcept.custom_css'];

  return (
    <>
      {customCSS ? (
        <>
          <Helmet>
            <style>{customCSS}</style>
          </Helmet>
        </>
      ) : null}
    </>
  );
};

export default TTWCustomCSS;
