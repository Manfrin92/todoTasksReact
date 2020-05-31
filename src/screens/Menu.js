import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {DrawerItems} from 'react-navigation-drawer';
import {Gravatar} from 'react-native-gravatar';
import commonStyles from '../commonStyles';

import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

export default props => {
  const optionsGravatar = {
    email: props.navigation.getParam('email'),
    secure: true,
  };

  const logout = () => {
    delete axios.defaults.headers.common.Authorization;
    AsyncStorage.removeItem('userData');
    props.navigation.navigate('AuthOrApp');
  };

  return (
    <ScrollView>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <Gravatar style={styles.avatar} options={optionsGravatar} />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{props.navigation.getParam('name')}</Text>
          <Text style={styles.email}>{props.navigation.getParam('email')}</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <View style={styles.logoutIcon}>
            <Icon name="sign-out" size={30} color="#800" />
          </View>
        </TouchableOpacity>
      </View>
      <DrawerItems {...props} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderColor: '#DDD',
  },
  title: {
    color: '#000',
    fontFamily: commonStyles.fontFamily,
    fontSize: 30,
    padding: 10,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 3,
    margin: 10,
    marginBottom: 15,
  },
  userInfo: {
    marginLeft: 10,
  },
  name: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 20,
    marginBottom: 5,
    color: commonStyles.color.mainTexto,
  },
  email: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 15,
    marginBottom: 10,
    color: commonStyles.color.subText,
  },
  logoutIcon: {
    marginLeft: 10,
    marginBottom: 10,
  },
});
