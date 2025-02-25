import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { AuthStackNavigationProp, LoginRoute } from '../util/routes';

export default function IntroScreen() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const navigation = useNavigation<AuthStackNavigationProp>();
  const screens = [
    {
      image: require('../assets/intro-screen-caro-1.png'), // First screen image
      title: 'Scan and Convert',
      description:
        'Effortlessly scan traditional menus and convert them into digital formats in just a few taps.',
      buttonText: 'Next',
    },
    {
      image: require('../assets/intro-screen-caro-2.png'), // Second screen image
      title: 'Generate QR Codes',
      description:
        'Create and customize QR codes for easy customer access to your menus online.',
      buttonText: 'Next',
    },
    {
      image: require('../assets/intro-screen-caro-3.png'), // Third screen image
      title: 'Customize with Templates',
      description:
        'Choose from a variety of templates to create stunning digital menus that reflect your brand.',
      buttonText: 'Get Started',
    },
  ];

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      // Handle the final screen logic here, like navigation to the main app
      // alert('Onboarding Completed');
      navigation.navigate(LoginRoute);
    }
  };

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <View style={styles.skipContainer}>
        <Text
          onPress={() => {
            navigation.navigate(LoginRoute);
          }}
          style={styles.skipText}
        >
          Skip
        </Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Screen Image */}
        <Image source={screens[currentScreen].image} style={styles.image} />

        {/* Main Heading */}
        <Text style={styles.heading}>{screens[currentScreen].title}</Text>

        {/* Subheading */}
        <Text style={styles.subheading}>
          {screens[currentScreen].description}
        </Text>
      </View>

      {/* Pagination Indicator */}
      <View style={styles.pagination}>
        {screens.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentScreen === index ? styles.activeDot : {},
            ]}
          />
        ))}
      </View>

      {/* Next Button */}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {screens[currentScreen].buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  skipContainer: {
    alignItems: 'flex-end',
    marginTop: 40,
  },
  skipText: {
    fontSize: 17,
    color: '#475467',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  content: {
    alignItems: 'center',
  },
  image: {
    width: '100%',
    marginBottom: 20,
    resizeMode: 'contain', // Adjust to fit the image properly
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  bold: {
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#FF6F61',
  },
  button: {
    backgroundColor: '#FC6011',
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 30,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
