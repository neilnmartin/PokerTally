import { AppRegistry, Platform } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { enableScreens } from 'react-native-screens';

enableScreens();

AppRegistry.registerComponent(appName, () => App);

// Only render to the DOM in web environments
if (Platform.OS === 'web') {
    const rootTag = document.getElementById('root');
    if (rootTag) {
        AppRegistry.runApplication(appName, {
            initialProps: {},
            rootTag,
        });
    }
}
