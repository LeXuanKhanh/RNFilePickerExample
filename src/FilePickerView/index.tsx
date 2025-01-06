import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, TouchableOpacity, Platform, ViewStyle} from 'react-native';
import {pickSingle} from 'react-native-document-picker';
import ImageCropPicker, {Image} from 'react-native-image-crop-picker';
import {Alert} from 'react-native';
import {
  check,
  Permission,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import {styles} from './styles';

type TFilePickerView = {
  path: string | null;
  name: string | null;
  extension: string | null;
  size?: number | null;
  isRemoteUrl?: boolean;
};

const FilePickerView = ({
  initialFile,
  pickerType = 'file',
  style,
  sizeLimit,
  emptyFileTitle = 'No file chosen',
  canPreview = false,
  fileFormat,
  onSelectedFile,
  onRemovedFile,
  onExceedsSizeLimit,
  onWrongFileFormat,
  onPermissionDenied,
}: {
  initialFile?: TFilePickerView;
  pickerType?: 'file' | 'image';
  style?: ViewStyle;
  sizeLimit?: number; // in MB
  emptyFileTitle?: string;
  canPreview?: boolean;
  fileFormat?: [string];
  onSelectedFile?: (file: TFilePickerView) => void;
  onRemovedFile?: () => void;
  onExceedsSizeLimit?: () => void;
  onWrongFileFormat?: () => void;
  onPermissionDenied?: (permission?: Permission) => void;
}) => {
  const [file, setFile] = useState<TFilePickerView | undefined>(undefined);

  const sizeLimitInBytes = useMemo(
    () => (sizeLimit ? sizeLimit * 1024 * 1024 : undefined),
    [sizeLimit],
  );

  const checkPermission = async (permission: Permission): Promise<boolean> => {
    try {
      const result = await check(permission);

      if (result === RESULTS.DENIED) {
        const requestResult = await request(permission);
        return (
          requestResult === RESULTS.GRANTED || requestResult === RESULTS.LIMITED
        );
      }

      return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
    } catch (error) {
      return false;
    }
  };

  const getFileFromInitialFile = async () => {
    if (!initialFile) {
      return;
    }

    setFile(initialFile);
  };

  const onPressMainView = async () => {
    if (!file) {
      if (pickerType === 'image') {
        return openImagePickerDialog();
      } else {
        return openFilePicker();
      }
    }

    if (canPreview) {
      return openFilePreview(file.path);
    }

    if (pickerType === 'image') {
      return openImagePickerDialog();
    } else {
      return openFilePicker();
    }
  };

  const openFilePreview = async (path: string | null) => {
    if (!path) {
      return;
    }

    console.log('Open file:', path);
  };

  const getFileNameAndExtension = (path: string) => {
    const name = path.split('/').pop() ?? '';
    const ext = name.split('.').pop() ?? '';

    return {name, extension: ext};
  };

  const openFilePicker = async () => {
    const f = await pickSingle({
      copyTo: 'cachesDirectory',
    });

    if (sizeLimitInBytes && f.size && f.size > sizeLimitInBytes) {
      onExceedsSizeLimit && onExceedsSizeLimit();
      return;
    }

    const nameAndExt = getFileNameAndExtension(f.fileCopyUri ?? '');
    if (
      fileFormat &&
      fileFormat.length > 0 &&
      !fileFormat.includes(nameAndExt.extension)
    ) {
      onWrongFileFormat && onWrongFileFormat();
      return;
    }
    console.log('File:', f);

    const fileType: TFilePickerView = {
      name: nameAndExt.name,
      path: f.fileCopyUri,
      extension: nameAndExt.extension,
      size: f.size,
    };
    setFile(fileType);
    onSelectedFile && onSelectedFile(fileType);
  };

  const openImagePickerDialog = async () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        {
          text: 'Photo Library',
          onPress: () => openImagePicker('library'),
        },
        {
          text: 'Camera',
          onPress: () => openImagePicker('camera'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  const openImagePicker = async (type: 'library' | 'camera' = 'library') => {
    try {
      const permissionGranted = await checkPermission(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      );
      if (!permissionGranted) {
        onPermissionDenied &&
          onPermissionDenied(
            Platform.OS === 'ios'
              ? PERMISSIONS.IOS.PHOTO_LIBRARY
              : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
          );
        return;
      }

      let img: Image;
      if (type === 'library') {
        img = await ImageCropPicker.openPicker({
          cropping: false,
          mediaType: 'photo',
        });
      } else {
        img = await ImageCropPicker.openCamera({
          cropping: false,
          mediaType: 'photo',
        });
      }

      if (sizeLimitInBytes && img.size && img.size > sizeLimitInBytes) {
        onExceedsSizeLimit && onExceedsSizeLimit();
        return;
      }

      const nameAndExt = getFileNameAndExtension(img.path);
      console.log('Image file:', img);

      const fileType: TFilePickerView = {
        path: img.path,
        name: nameAndExt.name,
        extension: nameAndExt.extension,
        size: img.size,
      };

      setFile(fileType);
      onSelectedFile && onSelectedFile(fileType);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const removeFile = () => {
    setFile(undefined);
    onRemovedFile && onRemovedFile();
  };

  useEffect(() => {
    getFileFromInitialFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.button} onPress={onPressMainView}>
        {file ? (
          <View style={styles.haveFileContainer}>
            <View style={styles.fileInfo}>
              <Text>{file.extension}</Text>
              <View style={styles.nameTextContainer}>
                <Text style={styles.nameText} numberOfLines={2}>
                  {file.name}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <Text>{emptyFileTitle}</Text>
        )}
      </TouchableOpacity>
      {file && (
        <TouchableOpacity style={styles.removeFileButton} onPress={removeFile}>
          <Text>X</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FilePickerView;
