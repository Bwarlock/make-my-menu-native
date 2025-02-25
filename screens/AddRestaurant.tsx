import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { HelperText, SegmentedButtons, TextInput } from 'react-native-paper';
import { useRestaurantHook } from '../api/hooks';
import { useNavigation } from '@react-navigation/native';

const initialValues = { subDomain: '', restaurantName: '', address: '' };
const initialErrors = { subDomain: '', restaurantName: '', address: '' };

let timeoutId: NodeJS.Timeout;

export function debounce(func: Function, delay: number) {
  return function (...args: any[]) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
export default function AddRestaurant() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(initialErrors);
  const [domain, setDomain] = useState();
  const { onBoardRestaurant } = useRestaurantHook();

  const navigation = useNavigation();
  const [domainSuggestions, setDomainSuggestions] = useState([]);
  const generateDomainSuggestions = (restaurantName: string) => {
    const splitRestaurantName = restaurantName.split(' ');
    const trimmedRestaurantName = restaurantName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-');
    const domainSuggestions = [
      trimmedRestaurantName,
      trimmedRestaurantName.replace(/\s+/g, ''),
      trimmedRestaurantName.slice(0, 2),
      // Get first element of each word in splitCompanyName
      splitRestaurantName
        .map((word) => word[0])
        .join('')
        .toLowerCase(),
    ];
    // Remove duplicates
    const uniqueDomainSuggestions = [...new Set(domainSuggestions)] as any;
    console.log(uniqueDomainSuggestions);
    setDomainSuggestions(uniqueDomainSuggestions);
  };

  const handleTextChange = useCallback(
    debounce((newText: string) => {
      // Your debounced logic here
      generateDomainSuggestions(newText);
    }, 300),
    [],
  );
  const onChangeText = (newText: string) => {
    setValues((val) => {
      return {
        ...val,
        restaurantName: newText,
      };
    });

    handleTextChange(newText);
  };

  const validate = () => {
    let valid = true;
    if (!values.subDomain) {
      valid = false;
      setErrors((err) => {
        return { ...err, subDomain: 'subDomain is required' };
      });
    }
    if (!values.restaurantName) {
      valid = false;
      setErrors((err) => {
        return { ...err, restaurantName: 'restaurantName is required' };
      });
    }
    if (!values.address) {
      valid = false;
      setErrors((err) => {
        return { ...err, address: 'address is required' };
      });
    }

    return valid;
  };
  const handleSubmit = () => {
    if (validate()) {
      onBoardRestaurant(values);
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
      }}
      behavior="padding"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 20,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/Logo.png')} // Assuming logo.png is placed in the assets folder
            style={styles.logo}
          />
        </View>

        {/* Title and Subtitle */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Restaurant’s Identity</Text>
          <Text style={styles.subtitle}>
            Establish your unique Online Presence
          </Text>
        </View>

        {/* Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Restaurant Name</Text>
          <TextInput
            mode="outlined"
            style={styles.input}
            placeholder="Your Input"
            value={values.restaurantName}
            error={!!errors.restaurantName}
            onChangeText={onChangeText}
            onFocus={() => {
              setErrors(initialErrors);
            }}
          />
          {!!errors.restaurantName && (
            <HelperText type="error">{errors.restaurantName}</HelperText>
          )}
        </View>

        {/* Subdomain Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Website Name</Text>
          <TextInput
            mode="outlined"
            style={styles.input}
            placeholder="Example: restaurant.makemymenu.online"
            value={values.subDomain}
            error={!!errors.subDomain}
            onChangeText={(text) => {
              setValues((val) => {
                return {
                  ...val,
                  subDomain: text,
                };
              });
            }}
            onFocus={() => {
              setErrors(initialErrors);
            }}
          />
          {!!errors.subDomain && (
            <HelperText type="error">{errors.subDomain}</HelperText>
          )}
        </View>

        {/* Segmented Buttons */}

        <View style={styles.segmentedButtonsContainer}>
          {/* align text to right */}
          <Text style={styles.rightAlignedText}>.makemymenu.online</Text>
        </View>
        {domainSuggestions.length ? (
          <View style={styles.segmentedButtonsContainer}>
            <SegmentedButtons
              value={''}
              onValueChange={(text) => {
                setValues((val) => {
                  return {
                    ...val,
                    subDomain: text,
                  };
                });
              }}
              buttons={domainSuggestions.map((val) => {
                return {
                  value: val,
                  label: val,
                };
              })}
              style={styles.segmentedButtons}
            />
          </View>
        ) : (
          <></>
        )}

        {/* Address Input */}
        <View style={{ ...styles.inputContainer, marginBottom: 20 }}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            mode="outlined"
            style={styles.input}
            placeholder="Your street address"
            value={values.address}
            error={!!errors.address}
            onChangeText={(text) => {
              setValues((val) => {
                return {
                  ...val,
                  address: text,
                };
              });
            }}
            onFocus={() => {
              setErrors(initialErrors);
            }}
          />
          {!!errors.address && (
            <HelperText type="error">{errors.address}</HelperText>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            Let’s Digitalize your menu →
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  backButton: {
    marginTop: 10,
    padding: 10,
    width: 40,
  },
  backButtonText: {
    fontSize: 30,
    color: '#333',
    transform: 'scale(1.5)',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  inputContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 0,
    fontSize: 16,
  },
  segmentedButtonsContainer: {
    marginTop: 20,
  },
  segmentedButtons: {
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
  },
  submitButton: {
    backgroundColor: '#FC6011',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 'auto',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  rightAlignedText: {
    textAlign: 'right', // Aligns the text to the right within the Text component
  },
});
