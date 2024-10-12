import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import PeopleScreen from "./screens/PeopleScreen";
import AddPersonScreen from "./screens/AddPersonScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="People" component={PeopleScreen} />
                <Stack.Screen name="AddPerson" component={AddPersonScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}