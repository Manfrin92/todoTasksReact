import React, {Component} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  DatePickerAndroid,
} from 'react-native';

import commonStyles from '../commonStyles';

import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const initialState = {desc: '', date: new Date(), showDatePicker: false};

export default class AddTaks extends Component {
  state = {
    ...initialState,
  };

  getDatePicker = () => {
    let datePicker = (
      <DateTimePicker
        value={this.state.date}
        onChange={(_, date) => this.setState({date, showDatePicker: false})}
        mode="date"
      />
    );
    const dateString = moment(this.state.date).format(
      'ddd, D [de] MMMM [de] YYYY',
    );

    if (Platform.OS === 'android') {
      datePicker = (
        <View>
          <TouchableOpacity
            onPress={() => this.setState({showDatePicker: true})}>
            <Text style={styles.date}>{dateString}</Text>
          </TouchableOpacity>
          {this.setState.showDatePicker && datePicker}
        </View>
      );
    }
    return datePicker;
  };

  save = () => {
    const newTask = {
      desc: this.state.desc,
      date: this.state.date,
    };

    this.props.onSave && this.props.onSave(newTask);

    this.setState({...initialState});
  };

  handleDateAndroidChanged = () => {
    DatePickerAndroid.open({
      date: this.state.date,
    }).then(e => {
      if (e.action !== DatePickerAndroid.dismissedAction) {
        const momentDate = moment(this.state.date);
        momentDate.date(e.day);
        momentDate.month(e.month);
        momentDate.year(e.year);
        this.setState({date: momentDate.toDate()});
      }
    });
  };

  render() {
    /*  */

    let datePicker = null;
    if (Platform.OS === 'android') {
      datePicker = (
        <TouchableOpacity onPress={this.handleDateAndroidChanged}>
          <Text style={styles.date}>
            {moment(this.state.date).format('ddd, D [de] MMMM [de] YYYY')}
          </Text>
        </TouchableOpacity>
      );
    }

    /**/
    return (
      <Modal
        transparent={true}
        visible={this.props.isVisible}
        onRequestClose={this.props.onCancel}
        animationType="slide">
        <TouchableWithoutFeedback onPress={this.props.onCancel}>
          <View style={styles.background} />
        </TouchableWithoutFeedback>
        <View style={styles.container}>
          <Text style={styles.header}>Nova Tarefa</Text>
          <TextInput
            style={styles.input}
            onChangeText={desc => this.setState({desc})}
            value={this.state.desc}
          />
          {datePicker}
          <View style={styles.buttons}>
            <TouchableOpacity onPress={this.props.onCancel}>
              <Text style={styles.button}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.save}>
              <Text style={styles.button}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableWithoutFeedback onPress={this.props.onCancel}>
          <View style={styles.background} />
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    flex: 2,
    backgroundColor: '#FFF',
  },
  header: {
    fontFamily: commonStyles.fontFamily,
    backgroundColor: commonStyles.color.today,
    color: commonStyles.color.secondary,
    textAlign: 'center',
    padding: 15,
    fontSize: 17,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  input: {
    fontFamily: commonStyles.fontFamily,
    height: '40%',
    margin: 15,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 6,
  },
  button: {
    margin: 20,
    marginRight: 30,
    color: commonStyles.color.today,
  },
  date: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 20,
    marginLeft: 15,
  },
});
