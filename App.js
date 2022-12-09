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
  TouchableOpacity
} from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
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
      minDate: 1554636310165, // timestamp (in milliseconds since UNIX epoch)
      maxDate: 1556277910456, // timestamp (in milliseconds since UNIX epoch)
      bodyRegex: '(.*)How are you(.*)', // content regex to match

      /** the next 5 filters should NOT be used together, they are OR-ed so pick one **/
      read: 0, // 0 for unread SMS, 1 for SMS already read
      _id: 1234, // specify the msg id
      thread_id: 12, // specify the conversation thread_id
      address: '+1888------', // sender's phone number
      body: 'How are you', // content to match
      /** the next 2 filters can be used for pagination **/
      indexFrom: 0, // start from index 0
      maxCount: 10, // count of SMS to return each time
    };

    SmsAndroid.list(
      JSON.stringify(filter),
      (fail) => {
        console.log('Failed with this error: ' + fail);
      },
      (count, smsList) => {
        console.log('Count: ', count);
        console.log('List: ', smsList);
        var arr = JSON.parse(smsList);

        arr.forEach(function(object) {
          console.log('Object: ' + object);
          console.log('-->' + object.date);
          console.log('-->' + object.body);
        });
      },
    );
  }

  

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}
        >
          <TouchableOpacity onPress={requestSmsPermission}>
            <Section title="Step One">
              Edit <Text style={styles.highlight}>App.js</Text> to change this
              screen and then come back to see your edits.
            </Section>
          </TouchableOpacity>
          <TouchableOpacity onPress={readSMS}>
            <Section title="See Your Changes">
              <ReloadInstructions />
            </Section>
          </TouchableOpacity>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
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
  highlight: {
    fontWeight: '700',
  },
});

export default App;
