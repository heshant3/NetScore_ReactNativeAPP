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
          <View style={styles.Box}>
            <Text style={styles.BoxHeadText}>Game Details</Text>
            <Text style={styles.BoxDateText}>2024/10/16</Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text>Team 1</Text>
                <Text>100</Text>
              </View>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text>Team 2</Text>
                <Text>100</Text>
              </View>
            </View>
          </View>
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
    width: "280@vs",
    height: 200,
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
    fontFamily: "Inter_500Medium",
    color: "#595959",
  },
});
