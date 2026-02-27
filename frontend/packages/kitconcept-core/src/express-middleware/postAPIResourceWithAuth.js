import superagent from 'superagent';
import config from '@plone/volto/registry';
import { addHeadersFactory } from '@plone/volto/helpers/Proxy/Proxy';
import { stripSubpathPrefix } from '@plone/volto/helpers/Url/Url';

export const postAPIResourceWithAuth = (req) =>
  new Promise((resolve, reject) => {
    const { settings } = config;
    const apiSuffix = settings.legacyTraverse ? '' : '/++api++';

    let apiPath = '';

    if (settings.internalApiPath && __SERVER__) {
      apiPath = settings.internalApiPath;
    } else if (__DEVELOPMENT__ && settings.devProxyToApiPath) {
      apiPath = settings.devProxyToApiPath;
    } else {
      apiPath = settings.apiPath;
    }

    const contentPath = stripSubpathPrefix(req.path);

    const request = superagent
      .post(`${apiPath}${apiSuffix}${contentPath}`)
      .responseType('blob');

    const authToken = req.universalCookies.get('auth_token');

    if (authToken) {
      request.set('Authorization', `Bearer ${authToken}`);
    }

    request.use(addHeadersFactory(req));
    request.then(resolve).catch(reject);
  });
