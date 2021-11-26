import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Table from '../main/Table';
import Play from '../main/Play';

const Stack = createNativeStackNavigator();

export default class Main extends Component {
    render() {
        return (
            <Stack.Navigator 
                initialRouteName="Table"
                    screenOptions={{
                    headerShown: false
                }}>
                <Stack.Screen name="Table" component={Table} />
                <Stack.Screen name="Play" component={Play} />
            </Stack.Navigator>
        )
    }
}