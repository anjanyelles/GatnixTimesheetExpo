import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

const EditSkill = ({ route, navigation }) => {
  const { skill } = route.params;

  const [skillName, setSkillName] = useState(skill.name);
  const [rating, setRating] = useState(skill.rating.toString());
  const [version, setVersion] = useState(skill.version.toString());

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Skill Name*</Text>
      <TextInput
        style={styles.input}
        value={skillName}
        onChangeText={setSkillName}
      />

      <Text style={styles.label}>Rating*</Text>
      <TextInput
        style={styles.input}
        value={rating}
        keyboardType="numeric"
        onChangeText={setRating}
      />

      <Text style={styles.label}>Version*</Text>
      <TextInput
        style={styles.input}
        value={version}
        keyboardType="numeric"
        onChangeText={setVersion}
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Save ✅"
          onPress={() => {
            /* Handle save logic */
          }}
        />
        <Button title="Cancel ❌" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default EditSkill;
