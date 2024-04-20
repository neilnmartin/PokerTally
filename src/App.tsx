import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PlayerScreen from './screens/PlayerScreen';
import BuyInScreen from './screens/BuyInScreen';
import ChipCount from './screens/ChipCount';
import Summary from './screens/Summary';

import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();



function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="PlayerScreen"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#000',  // White background
                    },
                    headerShadowVisible: false,
                    headerTintColor: '#fff',  // Black text
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        fontSize: 20,
                    },
                    headerBackTitleStyle: {
                        fontSize: 12,
                    },
                }}
            >
                <Stack.Screen
                    name="PlayerScreen"
                    component={PlayerScreen}
                    options={{ title: 'Players' }}
                />
                <Stack.Screen
                    name="BuyInScreen"
                    component={BuyInScreen}
                    options={{ title: 'Buy-Ins' }}
                />
                <Stack.Screen
                    name="ChipCount"
                    component={ChipCount}
                    options={{ title: 'Chip Count' }}
                />
                <Stack.Screen
                    name="Summary"
                    component={Summary}
                    options={{ title: 'Summary' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
