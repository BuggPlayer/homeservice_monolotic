import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import { store, persistor } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/constants';
import LoadingScreen from './src/components/LoadingScreen';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PaperProvider>
            <StatusBar
              barStyle="dark-content"
              backgroundColor={COLORS.WHITE}
            />
            <AppNavigator />
            <Toast />
          </PaperProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
};

export default App;