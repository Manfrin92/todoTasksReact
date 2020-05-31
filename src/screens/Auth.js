import React, {Component} from 'react';
import {
  ImageBackground,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';

import backgroundImage from '../../assets/imgs/login.jpg';
import commonStyles from '../commonStyles';
import AuthInput from '../components/AuthInput';
import axios from 'axios';

import AsyncStorage from '@react-native-community/async-storage';

import {server, showError, showSuccess} from '../common';

const initialState = {
  email: '',
  password: '',
  name: '',
  confirmPassword: '',
  stageNew: false,
};

export default class Auth extends Component {
  state = {
    ...initialState,
  };

  signinOrSignup = () => {
    if (this.state.stageNew) {
      this.signup();
    } else {
      this.signin();
    }
  };

  signup = async () => {
    try {
      await axios.post(`${server}/signup`, {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        // confirmPassword: this.state.confirmPassword,
      });

      showSuccess('User registered.');
      this.setState({...initialState});
    } catch (err) {
      showError(err);
    }
  };

  signin = async () => {
    try {
      const res = await axios.post(`${server}/signin`, {
        email: this.state.email,
        password: this.state.password,
      });

      axios.defaults.headers.common.Authorization = `bearer ${res.data.token}`;
      this.props.navigation.navigate('Home', res.data);
      AsyncStorage.setItem('userData', JSON.stringify(res.data));
    } catch (err) {
      showError(err);
    }
  };

  render() {
    const validations = [];

    validations.push(this.state.email && this.state.email.includes('@'));
    validations.push(this.state.password && this.state.password.length >= 6);

    if (this.state.stageNew) {
      validations.push(this.state.name && this.state.name.trim().length >= 3);
      validations.push(this.state.confirmPassword === this.state.password);
    }

    const validForm = validations.reduce((t, a) => t && a);

    return (
      <ImageBackground source={backgroundImage} style={styles.background}>
        <Text style={styles.title}>Tasks</Text>
        <Text style={styles.subtitle}>
          {this.state.stageNew ? 'Create your account' : 'Inform your account'}
        </Text>
        <View style={styles.formContainer}>
          {this.state.stageNew && (
            <AuthInput
              icon="user"
              style={styles.input}
              placeholder="Name"
              value={this.state.name}
              onChangeText={name => this.setState({name})}
            />
          )}

          <AuthInput
            icon="at"
            style={styles.input}
            placeholder="E-mail"
            value={this.state.email}
            onChangeText={email => this.setState({email})}
          />

          <AuthInput
            icon="lock"
            style={styles.input}
            placeholder="Password"
            value={this.state.password}
            onChangeText={password => this.setState({password})}
            secureTextEntry={true}
          />

          {this.state.stageNew && (
            <AuthInput
              icon="lock"
              style={styles.input}
              placeholder="Confirm password"
              value={this.state.confirmPassword}
              onChangeText={confirmPassword => this.setState({confirmPassword})}
              secureTextEntry={true}
            />
          )}
          <TouchableOpacity onPress={this.signinOrSignup} disable={!validForm}>
            <View
              style={[
                styles.button,
                validForm ? {} : {backgroundColor: '#AAA'},
              ]}>
              <Text style={styles.buttonText}>
                {this.state.stageNew ? 'Register' : 'Enter'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{padding: 10}}
          onPress={() => this.setState({stageNew: !this.state.stageNew})}>
          <Text style={styles.buttonText}>
            {this.state.stageNew ? 'Already registered' : 'New account'}
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.color.secondary,
    fontSize: 70,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: commonStyles.fontFamily,
    color: '#FFF',
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 10,
  },
  formContainer: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    width: '90%',
  },
  input: {
    marginTop: 10,
    backgroundColor: 'white',

    fontWeight: 'bold',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#080',
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
    borderRadius: 15,
  },
  buttonText: {
    fontFamily: commonStyles.fontFamily,
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
