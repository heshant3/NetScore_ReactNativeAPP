import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Entypo, Ionicons, FontAwesome6 } from "@expo/vector-icons";
import { ScaledSheet } from "react-native-size-matters";
import { ref, onValue, update, push } from "firebase/database";
import { db } from "./config";
import * as Haptics from "expo-haptics";

const Home = () => {
  const [Humidity, setHumidity] = useState(null);
  const [Temperature, setTemperature] = useState(null);
  const [Fouls, setFouls] = useState(null);
  const [Total, setTotal] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timerActive2, setTimerActive2] = useState(false);
  const [Timer, setTimer] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const SensorDataRef = ref(db, "SensorData");
    const FoulsRef = ref(db, "Fouls");
    const TotalRef = ref(db, "Total");

    onValue(SensorDataRef, (snapshot) => {
      const data = snapshot.val();
      if (data && typeof data === "object" && "Humidity" in data) {
        setHumidity(data.Humidity);
      }
      if (data && typeof data === "object" && "Temperature" in data) {
        setTemperature(data.Temperature);
      }
      setLoading(false);
    });

    //0715544604

    onValue(FoulsRef, (snapshot) => {
      const data = snapshot.val();
      setFouls(data);
    });

    onValue(TotalRef, (snapshot) => {
      const data = snapshot.val();
      setTotal(data);
    });
  }, []);

  useEffect(() => {
    if (timerActive) {
      setTimer(0); // Reset the timer to 0 when Total changes

      const interval = setInterval(() => {
        setTimer((Timer) => Timer + 1); // Start the timer again from 0
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [Total, timerActive]); // Add Total as a dependency

  useEffect(() => {
    if (timerActive2) {
      const timer = setInterval(() => {
        if (minutes === 0 && seconds === 0) {
          clearInterval(timer);
          setTimerActive(false);
          //   setTimer(0);
          return;
        }

        if (seconds === 0) {
          setSeconds(59);
          setMinutes((prevMinutes) => prevMinutes - 1);
        } else {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [seconds, minutes, timerActive2]);

  // Add leading zeros if necessary
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;

  const handleToggleTimer = () => {
    if (timerActive2) {
      setTimerActive2(false);
      setTimerActive(false);
      setTimer(0);
      setMinutes(0);
      setSeconds(0);
      update(ref(db), { Total: 0 });
      update(ref(db), { Fouls: 0 });
    } else {
      setTimerActive(true);
      setTimerActive2(true);
    }
  };

  // Inside your component function
  const handleOkPress = () => {
    const HistoryRef = ref(db, "History"); // Assuming 'penalties' is your Firebase database reference

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    // Get the current date
    const currentDate = new Date().toISOString().slice(0, 10);

    // Create an object with the desired key-value pairs, including the current date
    const History = {
      Date: currentDate,
      Fouls: Fouls,
      Total: Total,
      // Add any other data you want to send
    };

    // Push data to Firebase with a unique ID
    push(HistoryRef, History)
      .then((newRef) => {
        // console.log("Data added with ID: ", newRef.key);
        // Reset states after data is sent
        // setFouls(0);
        // setTotal(0);

        alert("Data submitted successfully!");
      })
      .catch((error) => {
        console.error("Error adding data: ", error);
      });
  };

  const handleTimer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setModalVisible(!modalVisible);
  };

  const handleSet = () => {
    setModalVisible(!modalVisible);
  };

  //   const handleStartTimer = () => {
  //     setTimerActive(true);
  //   };

  const navigateToHomePage = () => {
    navigation.navigate("Details");
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fdf5ea" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fdf5ea" />
      <View style={styles.Head}>
        <Text style={styles.HeadText}>Net Score</Text>
        <Ionicons
          name="basketball-outline"
          size={25}
          color="#595959"
          onPress={navigateToHomePage}
        />
      </View>
      <View style={{ flex: 1, alignItems: "center" }}>
        <View style={styles.box1}>
          <View style={{ justifyContent: "flex-start" }}>
            <Text style={styles.Text1}>Ground Environment </Text>
          </View>
          <View style={styles.EnveBox}>
            <View style={styles.SensorBox1}>
              <FontAwesome6 name="temperature-half" size={19} color="#515151" />
              {loading ? (
                <ActivityIndicator size="small" color="#515151" />
              ) : (
                <>
                  <Text style={styles.SensorText}>{Temperature}ºC</Text>
                </>
              )}
            </View>
            <View style={styles.SensorBox1}>
              <Entypo name="water" size={19} color="#515151" />
              {loading ? (
                <ActivityIndicator size="small" color="#515151" />
              ) : (
                <>
                  <Text style={styles.SensorText}>{Humidity}%</Text>
                </>
              )}
            </View>
          </View>
        </View>
        <View style={styles.box2}>
          <TouchableOpacity style={styles.clock} onLongPress={handleTimer}>
            <Text style={styles.clockText}>
              {displayMinutes} : {displaySeconds}
            </Text>
          </TouchableOpacity>
          {/* ///    Left  */}
          <View
            style={{
              flex: 0.9,
              flexDirection: "row",
              paddingTop: 20,
            }}
          >
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={styles.PointText1}>TEAM 1</Text>
              <View style={styles.PointBox1}>
                {loading ? (
                  <ActivityIndicator size="medium" color="#fff" />
                ) : (
                  <>
                    <Text style={styles.PointTextNumber1}>{Total}</Text>
                  </>
                )}
              </View>
              <Text style={styles.PointText2}>FOULS</Text>
              <View style={styles.PointBox2}>
                {loading ? (
                  <ActivityIndicator size="medium" color="#fff" />
                ) : (
                  <>
                    <Text style={styles.PointTextNumber2}>{Fouls}</Text>
                  </>
                )}
              </View>
            </View>
            {/* //        Right  */}
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={styles.PointText1}>TEAM 2</Text>
              <View style={[styles.PointBox1, { backgroundColor: "#1D0CB6" }]}>
                <Text style={styles.PointTextNumber1}>0</Text>
              </View>
              <Text style={styles.PointText2}>FOULS</Text>
              <View style={[styles.PointBox2, { backgroundColor: "#1D0CB6" }]}>
                <Text style={styles.PointTextNumber2}>0</Text>
              </View>
            </View>
          </View>

          {/* //        Shot Clock  */}
          <Text style={styles.ShotClockHeadText}>SHOT CLOCK</Text>
          <View style={styles.ShotClock}>
            <Text style={styles.ShotClockText}>{Timer}</Text>
          </View>
        </View>

        {/* //        Button  */}
        <TouchableOpacity
          style={[
            styles.box3,
            timerActive2 === false && minutes < 1 && seconds < 1
              ? styles.disabledButton
              : null,
          ]}
          onPress={handleToggleTimer}
          onLongPress={handleOkPress}
          disabled={timerActive2 === false && minutes < 1 && seconds < 1}
        >
          <Text style={styles.ResetText}>
            {timerActive2 ? "Reset" : "Start"}
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={[
            styles.box3,
            Total < 1 && minutes < 1 && seconds < 1
              ? styles.disabledButton
              : null,
          ]}
          onPress={handleOkPress}
          // disabled={minutes > 0 && seconds > 0}
        >
          <Text style={styles.ResetText}>Update</Text>
        </TouchableOpacity> */}
      </View>

      {/* Set Timer Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onTouchEnd={() => setModalVisible(!modalVisible)}
      >
        <View
          style={styles.centeredView}
          //   onTouchEnd={() => setModalVisible(!modalVisible)}
        >
          <View style={styles.modalView}>
            <View
              style={{
                flexDirection: "colum",
                alignItems: "center",
              }}
            >
              <Text style={styles.ModelText}>Enter Time</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextInput
                  style={styles.TextBox}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    // Check if the input text is a valid number
                    const newMinutes = parseInt(text);
                    if (!isNaN(newMinutes)) {
                      // Update the minutes state with the parsed integer value of the input text
                      setMinutes(newMinutes);
                    } else {
                      // If input text is not a valid number, set minutes to 0 or any default value you prefer
                      setMinutes(0); // Set to 0 as an example, you can set it to any default value you want
                    }
                  }}
                  placeholder="0"
                />

                <Text style={styles.ModelText2}> : </Text>
                <TextInput
                  style={styles.TextBox}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    const newSeconds = parseInt(text);
                    if (!isNaN(newSeconds)) {
                      setSeconds(newSeconds);
                    } else {
                      setSeconds(0);
                    }
                  }}
                  placeholder="0"
                />
              </View>
              <TouchableOpacity style={styles.button} onPress={handleSet}>
                <Text style={styles.buttonText}>Set</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;

const styles = ScaledSheet.create({
  Head: {
    height: "10%",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },

  HeadText: {
    fontSize: "25@mvs",
    fontFamily: "Inter_600SemiBold",
    color: "#595959",
  },

  box1: {
    marginBottom: 15,
    marginTop: 10,
    width: "90%",
    height: "20%",
    borderRadius: 20,
    // justifyContent: "center",
    // alignItems: "center",
    borderColor: "#fff",
    borderWidth: 4,
  },

  EnveBox: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  SensorBox1: {
    width: "25%",
    height: "88%",
    borderRadius: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  SensorText: {
    padding: 10,
    fontSize: "20@mvs",
    fontFamily: "Inter_600SemiBold",
    color: "#595959",
  },

  Text1: {
    padding: 10,
    fontSize: "16@mvs",
    fontFamily: "Inter_600SemiBold",
    color: "#595959",
  },

  box2: {
    marginTop: 10,
    width: "90%",
    height: "60%",
    borderRadius: 20,
    alignItems: "center",
  },

  clock: {
    width: "50%",
    height: "15%",
    backgroundColor: "#FC4E4E",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  clockText: {
    fontSize: "50@mvs",
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },

  PointText1: {
    fontSize: "20@mvs",
    fontFamily: "Inter_600SemiBold",
    color: "#595959",
  },

  PointBox1: {
    marginTop: 10,
    width: "70%",
    height: "33%",
    backgroundColor: "#FFC605",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  PointTextNumber1: {
    fontSize: "50@mvs",
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },

  PointText2: {
    marginTop: 30,
    fontSize: "15@mvs",
    fontFamily: "Inter_600SemiBold",
    color: "#595959",
  },

  PointBox2: {
    marginTop: 10,
    width: "46%",
    height: "26%",
    backgroundColor: "#FFC605",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  PointTextNumber2: {
    fontSize: "40@mvs",
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },

  PointRight: {
    flex: 1,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },

  ShotClockHeadText: {
    marginVertical: 10,
    // marginBottom: 10,
    fontSize: "14@mvs",
    fontFamily: "Inter_600SemiBold",
    color: "#595959",
  },

  ShotClock: {
    width: "30%",
    height: "14%",
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  ShotClockText: {
    fontSize: "34@mvs",
    fontFamily: "Inter_500Medium",
    color: "#FC4E4E",
  },

  box3: {
    marginTop: 10,
    width: "40%",
    height: "6%",
    backgroundColor: "#fff",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },

  disabledButton: {
    display: "none",
  },

  ResetText: {
    fontSize: "20@mvs",
    fontFamily: "Inter_500Medium",
    color: "#595959",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalView: {
    flexDirection: "row",
    height: 200,
    width: "65%",
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "white",
    justifyContent: "center",
    paddingTop: 20,
  },

  ModelText: {
    marginBottom: 20,
    fontSize: "20@mvs",
    fontFamily: "Inter_500Medium",
    color: "#595959",
  },

  TextBox: {
    width: 50,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 22,
    borderRadius: 10,
  },

  ModelText2: {
    fontSize: "30@mvs",
    fontFamily: "Inter_800ExtraBold",
    color: "#595959",
    marginHorizontal: 10,
  },

  button: {
    marginTop: 30,
    width: 100,
    height: 40,
    backgroundColor: "#FC4E4E",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    fontSize: "20@mvs",
    fontFamily: "Inter_500Medium",
    color: "#fff",
  },
});
