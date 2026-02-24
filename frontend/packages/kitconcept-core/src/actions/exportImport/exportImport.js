import { POST_IMPORT, POST_EXPORT } from '../../constants/ActionTypes';

export const exportContent = () => {
  return {
    type: POST_EXPORT,
    request: {
      op: 'post',
      path: '/@export',
    },
  };
};

export const importContent = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return {
    type: POST_IMPORT,
    request: {
      op: 'post',
      path: '/@import',
      data: formData,
    },
  };
};
