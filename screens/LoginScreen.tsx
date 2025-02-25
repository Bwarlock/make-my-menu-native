import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  Checkbox,
  Chip,
  HelperText,
  Icon,
  MD3Colors,
  Text,
  TextInput,
} from 'react-native-paper';
import { useAuthHook } from '../api/hooks';
import { validateEmail } from '../util/functions';
import { AuthStackNavigationProp, OtpRoute } from '../util/routes';
import { SendOtpData } from '../util/interfaces';

const initialValues = { email: '', rememeberMe: false };
const initialErrors = { email: '' };

export default function LoginScreen() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(initialErrors);
  const { sendLoginOtp } = useAuthHook();

  const navigation = useNavigation<AuthStackNavigationProp>();

  const validate = () => {
    let valid = true;
    if (!values.email) {
      valid = false;
      setErrors((err) => {
        return { ...err, email: 'Email is required' };
      });
    } else if (!validateEmail(values.email)) {
      valid = false;
      setErrors((err) => {
        return { ...err, email: 'Invalid email' };
      });
    }

    return valid;
  };
  const handleLogin = () => {
    if (validate()) {
      sendLoginOtp(values);
      navigation.navigate(OtpRoute, values);
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
          padding: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            marginTop: 16,
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Image
            source={require('../assets/Logo.png')}
            style={{
              width: 50,
              height: 50,
            }}
          />
        </View>
        <Text
          variant="headlineSmall"
          style={{
            textAlign: 'center',
            marginTop: 24,
            marginBottom: 8,
          }}
        >
          Sign In To Your Account
        </Text>
        <Text
          variant="titleMedium"
          style={{
            textAlign: 'center',
            marginBottom: 32,
          }}
        >
          Welcome! Please enter your details.
        </Text>
        {!!errors.email && (
          <Chip
            icon={() => <Icon source="information" size={24} color="red" />}
            textStyle={{
              color: 'red',
            }}
            style={{
              padding: 8,
              backgroundColor: MD3Colors.error90,
            }}
          >
            <HelperText type="error">{errors.email}</HelperText>
          </Chip>
        )}
        <Text style={{ marginTop: 16, marginBottom: 8 }}>Email ID</Text>

        <TextInput
          style={{
            marginBottom: 20,
          }}
          left={<TextInput.Icon icon="email" />}
          placeholder="Enter Email Address"
          mode="outlined"
          value={values.email}
          error={!!errors.email}
          onChangeText={(text) => {
            setValues((val) => {
              return {
                ...val,
                email: text,
              };
            });
          }}
          onFocus={() => {
            setErrors(initialErrors);
          }}
          autoCapitalize="none"
        />

        {/* <View
          style={{
            marginTop: 16,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Checkbox
            status={values.rememeberMe ? 'checked' : 'unchecked'}
            onPress={() => {
              setValues((val) => {
                return {
                  ...val,
                  rememeberMe: !val.rememeberMe,
                };
              });
            }}
            color="#DC520C"
          />
          <Text style={{}}>Remember Me</Text>
        </View> */}

        {/* <Button
          buttonColor="#DC520C"
          style={{
            backgroundColor: '#FC6011',
            paddingVertical: 15,
            borderRadius: 12,
            marginTop: 30,
            alignItems: 'center',
          }}
          icon="login-variant"
          // mode="contained"
          onPress={handleLogin}
        >
          Login
        </Button> */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Icon size={18} color="white" source={'login-variant'}></Icon>
          <Text style={styles.buttonText}> Login</Text>
        </TouchableOpacity>
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text>Dont Have an account ?</Text>

            <Button mode="text" textColor="#DC520C" onPress={() => { }}>
              Sign Up
            </Button>
          </View>
        </View> */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FC6011',
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 'auto',
  },
  icon: {
    color: 'white',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
