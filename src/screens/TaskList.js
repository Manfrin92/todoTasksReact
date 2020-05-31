import React, {Component} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  FlatList,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';

import TodayImage from '../../assets/imgs/today.jpg';
import TomorrowImage from '../../assets/imgs/tomorrow.jpg';
import WeekImage from '../../assets/imgs/week.jpg';
import MonthImage from '../../assets/imgs/month.jpg';

import commonStyles from '../commonStyles';
import Task from '../components/Task';

import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import {server, showSuccess, showError} from '../common';

import moment from 'moment';
import 'moment/locale/pt-br';

import AsyncStorage from '@react-native-community/async-storage';

import AddTask from './AddTask';

const initialState = {
  showTaskDone: true,
  showAddTask: false,
  visibleTasks: [],
  tasks: [],
};

export default class TaskList extends Component {
  state = {...initialState};

  componentDidMount = async () => {
    const stateString = await AsyncStorage.getItem('tasksState');
    const savedStoragedState = JSON.parse(stateString) || initialState;
    this.setState(
      {
        showTaskDone: savedStoragedState.showTaskDone,
      },
      this.filterTasks,
    );

    this.loadTasks();
  };

  loadTasks = async () => {
    try {
      const maxDate = moment()
        .add({days: this.props.daysAhead})
        .format('YYYY-MM-DD 23:59:59');
      const res = await axios.get(`${server}/tasks?date=${maxDate}`);
      this.setState({tasks: res.data}, this.filterTasks);
    } catch (err) {
      showError(err);
    }
  };

  toggleFilter = () => {
    this.setState({showTaskDone: !this.state.showTaskDone}, this.filterTasks);
  };

  filterTasks = () => {
    let visibleTasks = [];

    if (this.state.showTaskDone) {
      visibleTasks = [...this.state.tasks];
    } else {
      visibleTasks = this.state.tasks.filter(task => !task.doneAt);
    }

    this.setState({visibleTasks});
    AsyncStorage.setItem(
      'tasksState',
      JSON.stringify({
        showTaskDone: this.state.showTaskDone,
      }),
    );
  };

  onToggleTask = async taskId => {
    try {
      await axios.put(`${server}/tasks/${taskId}/toggle`);
      this.loadTasks();
    } catch (err) {
      showError(err);
    }
  };

  addTask = async newTask => {
    if (!newTask.desc || !newTask.desc.trim()) {
      Alert.alert('Tarefa em branco');
      return;
    }

    try {
      await axios.post(`${server}/tasks`, {
        desc: newTask.desc,
        estimatedAt: newTask.date,
      });

      this.setState({showAddTask: false}, this.loadTasks);
    } catch (err) {
      showError(err);
    }
  };

  deleteTask = async taskId => {
    try {
      await axios.delete(`${server}/tasks/${taskId}`);
      this.loadTasks();
    } catch (err) {
      showError(err);
    }
  };

  getImage = () => {
    switch (this.props.daysAhead) {
      case 0:
        return TodayImage;
      case 1:
        return TomorrowImage;
      case 7:
        return WeekImage;
      case 30:
        return MonthImage;
    }
  };

  getColor = () => {
    switch (this.props.daysAhead) {
      case 0:
        return commonStyles.color.today;
      case 1:
        return commonStyles.color.tomorrow;
      case 7:
        return commonStyles.color.week;
      case 30:
        return commonStyles.color.month;
    }
  };

  render() {
    const today = moment()
      .locale('pt-br')
      .format('ddd, D [de] MMMM');
    return (
      <View style={styles.container}>
        <AddTask
          isVisible={this.state.showAddTask}
          onCancel={() => this.setState({showAddTask: false})}
          onSave={this.addTask}
        />
        <ImageBackground source={this.getImage()} style={styles.background}>
          <View style={styles.iconBar}>
            <TouchableOpacity
              onPress={() => this.props.navigation.openDrawer()}>
              <Icon
                name="bars"
                size={20}
                color={commonStyles.color.secondary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.toggleFilter}>
              <Icon
                name={this.state.showTaskDone ? 'eye' : 'eye-slash'}
                size={20}
                color={commonStyles.color.secondary}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.titleBar}>
            <Text style={styles.title}>{this.props.title}</Text>
            <Text style={styles.subtitle}>{today}</Text>
          </View>
        </ImageBackground>
        <View style={styles.taskList}>
          <FlatList
            data={this.state.visibleTasks}
            renderItem={({item}) => (
              <Task
                {...item}
                onToggleTask={this.onToggleTask}
                onDelete={this.deleteTask}
              />
            )}
            keyExtractor={item => `${item.id}`}
          />
        </View>
        <TouchableOpacity
          style={[styles.addButton, {backgroundColor: this.getColor()}]}
          onPress={() => this.setState({showAddTask: true})}
          activeOpacity={0.8}>
          <Icon name="plus" size={20} color={commonStyles.color.secondary} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 3,
  },
  taskList: {
    flex: 7,
  },
  titleBar: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 50,
    color: commonStyles.color.secondary,
    marginBottom: 20,
    marginLeft: 20,
  },
  subtitle: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 20,
    color: commonStyles.color.secondary,
    marginBottom: 30,
    marginLeft: 20,
  },
  iconBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'ios' ? 42 : 10,
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
