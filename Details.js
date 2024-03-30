import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import React, { useState, useEffect } from "react";
import { ref, onValue, update, push } from "firebase/database";
import { db } from "./config";

export default function Details() {
  const [HistoryData, setHistoryData] = useState([]);

  useEffect(() => {
    const HistoryRef = ref(db, "History");
    onValue(HistoryRef, (snapshot) => {
      const firebaseData = snapshot.val();
      if (firebaseData) {
        const HistoryArray = Object.values(firebaseData);
        setHistoryData(HistoryArray.reverse()); // Reverse the order of the array
      }
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fdf5ea" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fdf5ea" />
      <View style={styles.Head}>
        <Text style={styles.HeadText}>Previous Games Details</Text>
      </View>
      <View style={{ flex: 1, alignItems: "center" }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {HistoryData.sort((a, b) => new Date(b.Date) - new Date(a.Date)) // Sort by date in descending order
            .map((game, index) => (
              <View style={styles.Box} key={index}>
                <Text style={styles.BoxHeadText}>Game Details</Text>
                <Text style={styles.BoxDateText}>{game.Date}</Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    paddingTop: 10,
                  }}
                >
                  <View style={{ flex: 1, alignItems: "center" }}>
                    <Text style={styles.TeamText}>Team 1</Text>
                    <Text style={styles.TeamTotalText}>{game.Total}</Text>
                    <Text style={styles.TeamFoulsTextName}>Fouls</Text>
                    <Text style={styles.TeamFoulsText}>{game.Fouls}</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: "center" }}>
                    <Text style={styles.TeamText}>Team 2</Text>
                    <Text style={styles.TeamTotalText}>0</Text>
                    <Text style={styles.TeamFoulsTextName}>Fouls</Text>
                    <Text style={styles.TeamFoulsText}>0</Text>
                  </View>
                </View>
              </View>
            ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

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
  scroll: {
    paddingVertical: 20,
  },

  Box: {
    marginTop: 10,
    marginBottom: 10,
    width: "280@vs",
    height: "200@mvs0.4",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 10,
  },

  BoxHeadText: {
    fontSize: "16@mvs",
    fontFamily: "Inter_600SemiBold",
    color: "#595959",
  },

  BoxDateText: {
    fontSize: "16@mvs",
    fontFamily: "Inter_400Regular",
    color: "#595959",
  },

  TeamText: {
    alignItems: "center",
    fontSize: "16@mvs",
    fontFamily: "Inter_500Medium",
    color: "#595959",
  },

  TeamTotalText: {
    alignItems: "center",
    fontSize: "27@mvs",
    fontFamily: "Inter_600SemiBold",
    color: "#000",
  },

  TeamFoulsTextName: {
    marginTop: 10,
    alignItems: "center",
    fontSize: "15@mvs",
    fontFamily: "Inter_400Regular",
    color: "#595959",
  },

  TeamFoulsText: {
    alignItems: "center",
    fontSize: "20@mvs",
    fontFamily: "Inter_600SemiBold",
    color: "#000",
  },
});
