import React, { Component } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../auth/Login';
import Register from '../auth/Register';

const Stack = createNativeStackNavigator();

export default class Auth extends Component {
    render() {
        return (
            <Stack.Navigator 
                initialRouteName="Login"
                    screenOptions={{
                    headerShown: false
                }}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
            </Stack.Navigator>
        )
    }
}