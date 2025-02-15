import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import calculateResponsiveFontSize from "../../utils/font";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useResetPasswordFinalizedMutation } from "../../redux/api";
import Toast from "react-native-toast-message";
import { rs } from "react-native-full-responsive";
import CustomButton from "../../component/CustomButton";
import { Stack, useTheme } from "native-base";

const CreateNewPassword = () => {
  const [showPassword, setShowPassword] = useState({
    p1: false,
    p2: false,
  });
  const [formValues, setFormValues] = useState({
    password: "",
    pass: "",
    errors: {
      password: "",
      pass: "",
    },
  });
  const state = useSelector((state) => state.auth);
  // console.log(state, "state")
  const [resetPasswordFinalized, { isLoading, isError, error }] =
    useResetPasswordFinalizedMutation();

  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  useEffect(() => {
    if (passwordRef?.current) {
      passwordRef?.current?.focus();
    }
  }, []);

  const handleChange = (field, value) => {
    setFormValues({
      ...formValues,
      [field]: value,
      errors: {
        ...formValues.errors,
        [field]: "", // Clear the error message for this field
      },
    });
  };
  const navigation = useNavigation();
  const handleSubmit = async () => {
    const { password, pass } = formValues;
    const errors = {};

    if (password === "") {
      errors.password = "Password is required";
    }

    if (pass === "") {
      errors.pass = "Confirm Password is required";
    } else if (password !== pass) {
      errors.pass = "Confirm Password and Password must match";
    }

    // Update the state with the errors object
    setFormValues({
      ...formValues,
      errors,
    });

    // Check if there are no errors before proceeding with form submission
    if (Object.keys(errors).length === 0) {
      const d = {
        new_password: formValues.password,
        confirm_password: formValues.pass,
        email: state?.email,
        otp: state.password,
      };
      try {
        const data = await resetPasswordFinalized(d).unwrap();
        // Handle the response data accordingly (e.g., redirect to the home stack)
        // console.log(data)
        if (data?.message) {
          Toast.show({
            type: "success",
            text1: "",
            text2: data?.message,
          });
          navigation.navigate("Login");
        }
      } catch (error) {
        // Handle any registration error
        console.log(error);
        if (error) {
          Toast.show({
            type: "error",
            text1: "",
            text2: error?.error ?? "",
          });
        }
      }
    }
  };

  const togglePasswordVisibility = (key) => {
    setShowPassword((prevShowPassword) => ({
      ...prevShowPassword,
      [key]: !prevShowPassword[key],
    }));
  };
  const { colors } = useTheme();

  // Access the color from the theme
  const bgColor = colors.brand.bg;

  return (
    <View style={styles.container}>
    <Stack my="5" justifyContent="flex-end" alignItems="flex-end">
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Image source={require("../../images/XCircle.png")} />
      </TouchableWithoutFeedback>
    </Stack>

    <Stack mt="5" mb="10">
      <Text
        style={[
          {
            fontSize: rs(16),
            color: "#000",
            fontWeight: "500",
            marginBottom: 1,
          },
        ]}
      >
        Create new password
      </Text>
    </Stack>
    <Stack mb="5">
      <Text style={styles.inputText}>Create Password</Text>

      <View style={styles.passwordContainer}>
        <TextInput
          ref={passwordRef}
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPassword?.p1}
          value={formValues.password}
          onChangeText={(value) => handleChange("password", value)}
          autoCapitalize="none"
          onFocus={() => {
            if (passwordRef.current) {
              passwordRef.current.focus();
            }
          }}
        />

        <TouchableOpacity
          style={styles.eyeIconContainer}
          onPress={() => togglePasswordVisibility("p1")}
        >
          <Image
            source={
              showPassword?.p1
                ? require("../../images/eye.png")
                : require("../../images/eye.png")
            }
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>
      {formValues?.errors?.password && (
        <Text style={styles.error}>{formValues?.errors?.password}</Text>
      )}
    </Stack>

    <Stack mb="5">
      <Text style={styles.inputText}>Confirm Password</Text>

      <View style={styles.passwordContainer}>
        <TextInput
          ref={confirmPasswordRef}
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={!showPassword?.p2}
          value={formValues.pass}
          onChangeText={(value) => handleChange("pass", value)}
          autoCapitalize="none"
          onFocus={() => {
            if (confirmPasswordRef.current) {
              confirmPasswordRef.current.focus();
            }
          }}
        />

        <TouchableOpacity
          style={styles.eyeIconContainer}
          onPress={() => togglePasswordVisibility("p2")}
        >
          <Image
            source={
              showPassword?.p2
                ? require("../../images/eye.png")
                : require("../../images/eye.png")
            }
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>
      {formValues?.errors?.pass && (
        <Text style={styles.error}>{formValues?.errors?.pass}</Text>
      )}
    </Stack>
    <Stack flex="1" justifyContent="center" alignItems="center" w="100%">
      <CustomButton
        bg={bgColor}
        color="#fff"
        w="100"
        borderColor={bgColor}
        handlePress={handleSubmit}
        isLoading={isLoading}
        text="Request OTP"
      />
    </Stack>
  </View>
  );
};

const styles = StyleSheet.create({
  inputText: {
    fontSize: rs(18),
    fontWeight: "400",
    color: "#000",
    paddingLeft: rs(4),
    paddingBottom: rs(5),
  },
  textContent: {
    fontWeight: "500",
    // lineHeight:18,
    color: "#444444",
    marginBottom: rs(40),
  },

  textSignup: {
    fontWeight: "500",
    // lineHeight:18,
    color: "#444444",
  },
  head: {
    fontWeight: "600",
    lineHeight: rs(20),
  },

  container: {
    paddingHorizontal: rs(25),
    paddingTop: StatusBar.currentHeight,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: rs(20),
  },
  input: {
    height: rs(55),
    backgroundColor: "transparent",
    borderRadius: rs(5),
    paddingHorizontal: rs(10),
    borderWidth: rs(1),
    borderColor: "#000",
    width: "100%",
    color: "#000",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIconContainer: {
    position: "absolute",
    right: rs(10),
  },
  eyeIcon: {
    width: rs(24),
    height: rs(24),
  },
  loginButton: {
    backgroundColor: "#000",
    borderRadius: rs(5),
    paddingVertical: rs(12),
    alignItems: "center",
    marginTop: rs(20),
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: rs(10),
  },
  forgot: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginTop: rs(1),
    marginBottom: rs(10),
  },
  forgotText: {
    color: "#920000",
    fontWeight: "500",
    lineHeight: rs(20),
    fontSize: rs(10),
  },
  signupText: {
    fontWeight: "500",
  },
});

export default CreateNewPassword;
