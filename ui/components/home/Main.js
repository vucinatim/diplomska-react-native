import React, { Component } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { View, Text } from 'react-native'
import { color } from 'react-native-reanimated';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, fetchRestaurants } from '../../../redux/actions/index'

import RestaurantsScreen from './Restaurants'
import ProfileOrLoginScreen from './ProfileOrLogin'

const Tab = createBottomTabNavigator();

const EmptyScreen = () => {
    return (null)
}

export class Main extends Component {
    componentDidMount() {
        this.props.fetchUser()
        this.props.fetchRestaurants()
    }
    render() {
        return (
            <Tab.Navigator initialRouteName="Home">
                <Tab.Screen
                    name="Restaurants"
                    component={RestaurantsScreen}
                    navigation={this.props.navigation}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name='restaurant-menu' color={color} size={26} />
                        )
                    }} />
                <Tab.Screen name="QR Scanner" component={EmptyScreen}
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Scanner")
                        }
                    })}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name='qr-code' color={color} size={26} />
                        )
                    }} />
                <Tab.Screen name="Profile" component={ProfileOrLoginScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name='person' color={color} size={26} />
                        )
                    }} />
            </Tab.Navigator>
        )
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUser, fetchRestaurants }, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Main)
