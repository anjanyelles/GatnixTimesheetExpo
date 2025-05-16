import "react-native-gesture-handler";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Employee from "./Approvalmanagers/Employee";

const tableData = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
  { id: "3", name: "Alice Brown", email: "alice@example.com" },
  { id: "4", name: "Bob White", email: "bob@example.com" },
];

const renderTableRow = ({ item, index }) => (
  <View style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
    <Text style={styles.cell}>{item.name}</Text>
    <Text style={styles.cell}>{item.email}</Text>
  </View>
);

const OverviewScreen = ({ searchQuery }) => {
  const filteredData = tableData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.screen}>
      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Name</Text>
          <Text style={styles.headerCell}>Email</Text>
        </View>

        {/* Table Data */}
        <FlatList
          data={filteredData}
          renderItem={renderTableRow}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

const IntegrationScreen = () => (
  <View style={styles.screen}>
    <Text>Integration Content</Text>
  </View>
);
const BillingScreen = () => (
  <View style={styles.screen}>
    <Text>Billing Content</Text>
  </View>
);
const TransactionsScreen = () => (
  <View style={styles.screen}>
    <Text>Transactions Content</Text>
  </View>
);

export default function App() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "AllEmployees", title: "All Employees" },
    { key: "ActiveEmployees", title: "Active Employees" },
    { key: "InactiveEmployees", title: " Inactive Employees" },

  ]);
  const [searchQuery, setSearchQuery] = useState("");

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "AllEmployees":
        return <OverviewScreen searchQuery={searchQuery} />;
      case "ActiveEmployees":
        return <Employee />;
      case "InactiveEmployees":
        return <BillingScreen />;
    
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Filter */}
  

      {/* Tab Navigation */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "#4F46E5" ,color:'black' }}
            style={styles.tabBar}
            renderLabel={({ route, focused }) => (
              <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
                {route.title}
              </Text>
            )}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  screen: { flex: 1, justifyContent: "center", alignItems: "center" },

  tabBar: {
    backgroundColor: "black",
    shadowColor: "#000",
    color:'black',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabLabel: { color: "black", fontWeight: "600", fontSize: 16 },
  tabLabelActive: { color: "black" },

  searchContainer: {
    padding: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#F3F4F6",
  },

  tableContainer: { flex: 1, padding: 10, width: "100%" },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    padding: 12,
    borderRadius: 8,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    color: "#374151",
  },

  row: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  rowEven: { backgroundColor: "#F9FAFB" },
  rowOdd: { backgroundColor: "#FFFFFF" },

  cell: { flex: 1, fontSize: 15, textAlign: "center", color: "#1F2937" },
});
