import {Alert, Platform} from 'react-native';

const server =
  Platform.OS === 'ios' ? 'http://localhost:3333' : 'http://10.0.2.2:3333';

function showError(err) {
  if (err.response && err.response.data) {
    Alert.alert(`An error occurred: ${err.response.data}`);
  } else {
    Alert.alert(`An error occurred: ${err}`);
  }
}

function showSuccess(msg) {
  Alert.alert(`Success! ${msg}`);
}

export {server, showError, showSuccess};
