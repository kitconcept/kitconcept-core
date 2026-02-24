import express from 'express';
import { postAPIResourceWithAuth } from './postAPIResourceWithAuth';

const HEADERS = [
  'content-type',
  'content-disposition',
  'cache-control',
  'content-length',
];

async function exportMiddlewareFn(req, res, next) {
  try {
    req.url = '/@export';

    const resource = await postAPIResourceWithAuth(req);

    HEADERS.forEach((header) => {
      if (resource.headers[header]) {
        res.set(header, resource.headers[header]);
      }
    });

    res.send(resource.body);
  } catch (err) {
    next(err);
  }
}

export function exportMiddleware() {
  const middleware = express.Router();

  middleware.post('/@export', exportMiddlewareFn);

  middleware.id = 'exportContent';

  return middleware;
}

const exportMiddlewares = [exportMiddleware()];

export default exportMiddlewares;
