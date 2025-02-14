import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import BottomToolbar from '../components/BottomToolbar';
import { ScrollView } from 'react-native-gesture-handler';
import { handelgetDashboardCardApi } from './aftherlogin';

const Dashboard = ({ navigation }) => {
  const screenWidth = Dimensions.get('window').width; // Get the screen width

  const [dashbordcards, setDashboardCard] = useState();


    useEffect(()=>{
const handelgetDashboardCard =async()=>{
   response = await handelgetDashboardCardApi()
  //  console.log("Response11", response)
  setDashboardCard(response)
}
handelgetDashboardCard()
    },[])
  return (
    <View style={{ flex: 1 }}>
      {/* Main Dashboard Content */}
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Dashboard</Text>

        <View style={styles.cardContainer}>
      {/* Row 1 */}
      <View style={styles.row}>
        <View style={styles.card}>
          <TouchableOpacity onPress={() => navigation.navigate("Employee")}>
            <View style={styles.iconRow}>
              <MaterialIcons name="assignment" size={20} color="orange" />
              <Text style={styles.cardValue}>{dashbordcards?.numberOfEmployees ?? "0"}</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.cardTitle}>Employees</Text>
        </View>

        <View style={styles.card}>
          <TouchableOpacity onPress={() => navigation.navigate("ApprovedSheets")}>
            <View style={styles.iconRow}>
              <FontAwesome5 name="clock" size={20} color="orange" />
              <Text style={styles.cardValue}>{dashbordcards?.approvedTimesheets ?? "0"}</Text>
            </View>
            <Text style={styles.cardTitle}>Approved</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Row 2 */}
      <View style={styles.row}>
        <View style={styles.card}>
          <TouchableOpacity onPress={() => navigation.navigate("Project")}>
            <View style={styles.iconRow}>
              <MaterialIcons name="check-circle" size={20} color="orange" />
              <Text style={styles.cardValue}>{dashbordcards?.numberOfProjects ?? "0"}</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.cardTitle}>Projects</Text>
        </View>

        <View style={styles.card}>
          <TouchableOpacity onPress={() => navigation.navigate("TimeSheets")}>
            <View style={styles.iconRow}>
              <FontAwesome5 name="times-circle" size={20} color="orange" />
              <Text style={styles.cardValue}>{dashbordcards?.totalTimesheets ?? "0"}</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.cardTitle}>TimeSheets</Text>
        </View>
      </View>
    </View>

        {/* Graphs Section */}
        <Text style={styles.graphTitle}>Performance Overview</Text>

        <View style={styles.graphContainer}>
          <LineChart
            data={{
              labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
              datasets: [{ data: [20, 45, 28, 80] }],
            }}
            width={screenWidth - 40} // Set width based on screen width minus padding
            height={220}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: '#ff6f20',
              backgroundGradientFrom: '#ff6f20',
              backgroundGradientTo: '#ff9f40',
              padding: 10,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            style={styles.graph}
          />
        </View>

        <View style={styles.graphContainer}>
          <BarChart
            data={{
              labels: ['Approved', 'Rejected', 'Pending'],
              datasets: [{ data: [10, 2, 4] }],
            }}
            width={screenWidth - 40} // Set width based on screen width minus padding
            height={220}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: '#22b573',
              backgroundGradientFrom: '#22b573',
              backgroundGradientTo: '#4CAF50',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            style={styles.graph}
          />
        </View>

      </ScrollView>

      <BottomToolbar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  cardContainer: {
    width: '100%',
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
    marginTop: 5,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 10,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  graphContainer: {
    marginBottom: 20,
    paddingHorizontal: 10, // Padding to ensure there's some space around the graph
  },
  graph: {
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default Dashboard;
