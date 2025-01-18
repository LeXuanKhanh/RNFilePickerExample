import {TFilePickerFile} from '.';

export const convertRemoteUrlToTFilePickerFile = (
  url: string,
  size: number = 0,
) => {
  const name = url.split('/').pop() ?? '';
  const extension = name.split('.').pop() ?? '';
  const file: TFilePickerFile = {
    path: url,
    name,
    extension,
    size,
    isRemoteUrl: true,
  };
  return file;
};
