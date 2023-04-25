import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppTelas from './src/AppTelas';


export default function App() {
  return (
    <>
      <StatusBar style="light-content" />
      <AppTelas></AppTelas>
      
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
