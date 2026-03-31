import { POST_IMPORT } from '../../constants/ActionTypes';

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
