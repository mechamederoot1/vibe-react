import React from 'react';
import { StatusBar } from 'react-native';
import 'react-native-gesture-handler';

import { AuthProvider } from './contexts/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import { colors } from './styles/theme';

const App: React.FC = () => {
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.surface}
        translucent={false}
      />
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </>
  );
};

export default App;
