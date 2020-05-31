import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import React from 'react';

import Auth from './screens/Auth';
import TaskList from './screens/TaskList';

import Menu from './screens/Menu';
import commonStyles from './commonStyles';
import AuthOrApp from './screens/AuthOrApp';

const menuConfig = {
  initialRouteName: 'Today',
  contentComponent: Menu,
  contentOptions: {
    labelStyle: {
      fontFamily: commonStyles.fontFamily,
      fontWeight: 'normal',
      fontSize: 20,
    },
    activeLabelStyle: {
      fontWeight: 'bold',
      color: '#080',
    },
  },
};

const menuRoutes = {
  Today: {
    name: 'Today',
    screen: props => <TaskList title="Today" daysAhead={0} {...props} />,
    navigationOptions: {
      title: 'Today',
    },
  },
  Tomorrow: {
    name: 'Tomorrow',
    screen: props => <TaskList title="Tomorrow" daysAhead={1} {...props} />,
    navigationOptions: {
      title: 'Tomorrow',
    },
  },
  Week: {
    name: 'Week',
    screen: props => <TaskList title="Week" daysAhead={7} {...props} />,
    navigationOptions: {
      title: 'Week',
    },
  },
  Month: {
    name: 'Month',
    screen: props => <TaskList title="Month" daysAhead={30} {...props} />,
    navigationOptions: {
      title: 'Month',
    },
  },
};

const menuNavigator = createDrawerNavigator(menuRoutes, menuConfig);

const mainRoutes = {
  AuthOrApp: {
    name: 'AuthOrApp',
    screen: AuthOrApp,
  },
  Auth: {
    name: 'Auth',
    screen: Auth,
  },
  Home: {
    name: 'Home',
    screen: menuNavigator,
  },
};

const mainNavigator = createSwitchNavigator(mainRoutes, {
  initialRouteName: 'AuthOrApp',
});

export default createAppContainer(mainNavigator);
