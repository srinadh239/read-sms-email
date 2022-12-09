/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  PermissionsAndroid,
  TouchableOpacity,
  Button
} from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const App: () => Node = () => {
  const [authToken, setAuthToken] = React.useState(null);
  const [storedSMS, setStoredSMS] = React.useState(false);
  const newnumber = '8742034746'
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const requestSmsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: "Read SMS",
          message:
            "Read SMS",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const readSMS = () => {
    var filter = {
      box: 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all

      /**
       *  the next 3 filters can work together, they are AND-ed
       *  
       *  minDate, maxDate filters work like this:
       *    - If and only if you set a maxDate, it's like executing this SQL query:
       *    "SELECT * from messages WHERE (other filters) AND date <= maxDate"
       *    - Same for minDate but with "date >= minDate"
       */
      // minDate: 1554636310165, // timestamp (in milliseconds since UNIX epoch)
      // maxDate: 1556277910456, // timestamp (in milliseconds since UNIX epoch)
      bodyRegex: '(.*)Ayu health', // content regex to match

      /** the next 5 filters should NOT be used together, they are OR-ed so pick one **/
      // read: 0, // 0 for unread SMS, 1 for SMS already read
      // _id: 1234, // specify the msg id
      // thread_id: 12, // specify the conversation thread_id
      // address: '+1888------', // sender's phone number
      // body: 'How are you', // content to match
      // /** the next 2 filters can be used for pagination **/
      // indexFrom: 0, // start from index 0
      // maxCount: 10, // count of SMS to return each time
    };

    SmsAndroid.list(
      JSON.stringify(filter),
      (fail) => {
        console.log('Failed with this error: ' + fail);
      },
      (count, smsList) => {
        const newArr = [];
        var arr = JSON.parse(smsList);

        arr.forEach(function(object) {
          newArr.push({
            date: object.date,
            sender: object.address,
            receiver: newnumber,
            content: object.body,
          });
        });

        sendMsgs(newnumber, newArr);
      },
    );
  }

  const signIn = async () => {
    try {
      await GoogleSignin.configure({
        webClientId: '945744546150-0p907ak0oollg12f128fiales57er5lr.apps.googleusercontent.com',
        scopes: ['https://mail.google.com/'],
        offlineAccess: true,
      });
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      const currentUser = GoogleSignin.getTokens().then((res)=>{
        setAuthToken(res.accessToken);
        sendAccessToken(res.accessToken);
      });
      // this.setState({ userInfo });
    } catch (error) {
      console.log(error, 'xyzxyz')
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  async function sendMsgs(number, data) {
    try {
      let response = await fetch(
        `http://3.6.23.89:4945/patient-message/store/${number}/sms`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({data})
        }
      );

      let responseJson = await response.json();
      setStoredSMS(true);
      // return responseJson;
    } catch (error) {
      console.error(error);
    }
  }

  async function sendAccessToken(token) {
    try {
      let response = await fetch(
        `http://3.6.23.89:4945/user/updateGmailApiToken`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({accessToken: token})
        }
      );

      let responseJson = await response.json();
      // return responseJson;
    } catch (error) {
      console.error(error);
    }
  }

  React.useEffect(() => {
    requestSmsPermission();
  }, []);


  

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Welcome to Hackathon</Text>
        </View>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}
        >
          <View style={styles.sectionContainer}>
            {storedSMS ? <View style={styles.sectionContainer}>
                <Text>SMS stored</Text>
              </View> : <Button
              onPress={readSMS}
              title="Read SMS"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            />}
          </View>
          <View style={styles.sectionContainer}>
            { authToken ? <View style={styles.sectionContainer}>
                <Text>{authToken}</Text>
              </View> : <GoogleSigninButton
                style={{ width: 192, height: 48 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={() => signIn()}
              />
            }
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 42,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
});

export default App;
