/**
 * @format
 */

import {AppRegistry} from 'react-native';
//import TaskList from './src/screens/TaskList';
import {name as appName} from './app.json';
import Navigator from './src/Navigator';

AppRegistry.registerComponent(appName, () => Navigator);
