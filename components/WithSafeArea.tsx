import React, { ComponentType } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type WithSafeAreaProps = {
  // Add any additional props here if necessary
};

const WithSafeArea = <P extends object>(Component: ComponentType<P>) => {
  return (props: P & WithSafeAreaProps) => (
    <SafeAreaView style={styles.safeArea}>
      <Component {...props} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

export default WithSafeArea;
