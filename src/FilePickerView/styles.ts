import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    padding: 16,
  },
  haveFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  fileInfo: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    color: '#000000',
    fontSize: 16,
    flex: 1,
  },
  nameTextContainer: {
    flex: 1,
  },
  nameText: {
    color: '#000000',
    fontSize: 16,
  },
  removeFileButton: {
    backgroundColor: '#FF0000',
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
});
