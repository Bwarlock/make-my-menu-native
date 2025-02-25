import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Image,
  Pressable,
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
import OtpInput from '../components/OtpInput';
import { AuthStackParamList, OtpRoute } from '../util/routes';
const initialValues = { otp: '' };
const initialErrors = { otp: '' };

export default function OtpScreen() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(initialErrors);
  const { loginUser, sendLoginOtp } = useAuthHook();

  const route = useRoute<RouteProp<AuthStackParamList, typeof OtpRoute>>();
  const params = route.params;

  const validate = () => {
    let valid = true;
    if (!values.otp || values.otp?.length < 4) {
      valid = false;
      setErrors((err) => {
        return { ...err, otp: 'otp is required' };
      });
    }
    setTimeout(() => {
      setErrors(initialErrors);
    }, 2000);
    return valid;
  };
  const handleLogin = () => {
    if (validate()) {
      loginUser({ ...values, ...params });
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
          <Image source={require('../assets/Mail.png')} />
        </View>
        <Text
          variant="headlineSmall"
          style={{
            textAlign: 'center',
            marginTop: 24,
            marginBottom: 8,
          }}
        >
          OTP Verification
        </Text>
        <Text
          variant="titleMedium"
          style={{
            textAlign: 'center',
          }}
        >
          Enter the 4-digit code sent to
        </Text>
        <Text
          variant="titleMedium"
          style={{
            textAlign: 'center',
          }}
        >
          {params?.email ?? 'email'}
        </Text>
        {!!errors.otp && (
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
            <HelperText type="error">{errors.otp}</HelperText>
          </Chip>
        )}

        <OtpInput
          length={4}
          onChange={(otp) => {
            console.log(otp);
            setValues((val) => {
              return {
                ...val,
                otp: otp.join(''),
              };
            });
          }}
        />
        <Button
          buttonColor="#DC520C"
          style={{
            marginTop: 16,
            borderRadius: 12,
          }}
          icon="login-variant"
          mode="contained"
          onPress={handleLogin}
        >
          Verify Email
        </Button>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 16,
          }}
        >
          <Text>Didn't receive email?</Text>

          <Button
            mode="text"
            textColor="#DC520C"
            onPress={() => {
              sendLoginOtp({ ...params });
            }}
          >
            Click To Resend
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
