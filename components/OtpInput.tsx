import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { TextInput as PaperTextInput } from 'react-native-paper';

interface OtpInputProps {
  length: number;
  onChange: (otp: string[]) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ length, onChange }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputs = useRef<(TextInput | null)[]>(Array(length).fill(null));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleChange = (text: string, index: number) => {
    console.log(text, index);
    // Handle paste event
    if (text.length >= length) {
      const pasteText = text.substring(0, length);
      const newOtpArray = Array(length).fill('');
      for (let i = 0; i < pasteText.length; i++) {
        newOtpArray[i] = pasteText[i];
      }
      setOtp(newOtpArray);
      onChange(newOtpArray);

      // Handle focus shift and paste detection
      inputs.current[length - 1]?.focus();
    } else {
      const newOtp = [...otp];
      if (text?.length) {
        newOtp[index] = text[text.length - 1];
        // Handle focus shift and paste detection
        if (index < length - 1) {
          inputs.current[index + 1]?.focus();
        }
      } else {
        newOtp[index] = text;
      }
      setOtp(newOtp);
      onChange(newOtp);
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(null);
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((digit, index) => (
        <PaperTextInput
          onFocus={() => handleFocus(index)}
          onBlur={handleBlur}
          key={index}
          mode="outlined"
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="numeric"
          // maxLength={1}
          style={styles.input}
          ref={(ref: TextInput | null) => (inputs.current[index] = ref)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    alignItems: 'center',
    width: '100%',
    padding: 10,
    marginVertical: 20,
  },
  input: {
    textAlign: 'center',
    fontSize: 18,
  },
});

export default OtpInput;
