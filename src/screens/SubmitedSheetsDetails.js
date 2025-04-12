import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { getProjectDetailsById } from "./aftherlogin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native-paper";

const SubmitedSheetsDetails = ({ route }) => {
  const { selectedRowData, projectId } = route.params;

  // console.log('Selected Row Data:', selectedRowData);
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalWeeks, setTotalWeeks] = useState(1);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [projectImages, setProjectImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);

  // useFocusEffect(
  //   useCallback(() => {
  //     fetchInitialData();
  //   }, [projectId])
  // );

  useEffect(() => {
    fetchInitialData();
    if (selectedRowData.attachments) {
      console.log("Selected Row Data:", selectedRowData.attachments);
      fetchProjectImages();
    }
  }, [projectId, selectedRowData]);

  const fetchProjectImages = async () => {
    const orgId = await AsyncStorage.getItem("orgId");
    const id = await AsyncStorage.getItem("id");
    setImageLoading(true);
    console.log("Org ID:", orgId);
    console.log("User ID:", id);

    // const attachments= [
    //             "7a9a7e5d-4186-4af0-a6c8-a20b4a74b2e7Salesforce Logo (1).jpeg",
    //             "7a9a7e5d-4186-4af0-a6c8-a20b4a74b2e7Salesforce Logo (1).jpeg",
    //             "7a9a7e5d-4186-4af0-a6c8-a20b4a74b2e7Salesforce Logo (1).jpeg",
    //             "7a9a7e5d-4186-4af0-a6c8-a20b4a74b2e7Salesforce Logo (1).jpeg",
    //             "7a9a7e5d-4186-4af0-a6c8-a20b4a74b2e7Salesforce Logo (1).jpeg"
    //         ]
    try {
      const urls = selectedRowData.attachments.map((fileName) => {
        const encodedFileName = encodeURIComponent(fileName);
        return `https://www.gatnix.com/api/v1/org/${orgId}/user/${id}/user-profile/download/${encodedFileName}`;
      });

      setProjectImages(urls);
    } catch (err) {
      console.error("Error loading images:", err);
    } finally {
      setImageLoading(false);
    }
  };

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const projectDetails = await getProjectDetailsById(projectId);
      setProjectData(projectDetails);
      setCurrentPageData(selectedRowData);
      const diffDays = projectDetails.endDate - projectDetails.startDate;
      const totalDays = Math.ceil((diffDays * 1000) / (1000 * 60 * 60 * 24));
      const totalPages = Math.ceil(totalDays / 7) + 1;
      setTotalWeeks(totalPages);
      setCurrentPageData((prev) => ({
        ...prev,
        startDate: formatDate(selectedRowData.startDate),
        endDate: formatDate(selectedRowData.endDate),
      }));
      // console.log('Project Data', projectDetails);
      // console.log('Time sheet selected data', selectedRowData);
      // console.log('Total Pages', totalPages);
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const value = new Date(date * 1000);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return value.toLocaleDateString("en-GB", options);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalWeeks));
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      Math.min(prevIndex + 1, projectImages.length - 1)
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.paginationControls}>
        <Button
          title="Previous"
          onPress={handlePrevious}
          disabled={currentPage === 1}
        />
        <Text style={styles.pageIndicator}>
          {currentPageData.startDate}
          {` - `}
          {currentPageData.endDate}
        </Text>
        <Button
          title="Next"
          onPress={handleNext}
          disabled={currentPage === totalWeeks}
        />
      </View>

      {/* <Text>project urls are {projectImages[currentImageIndex] }</Text> */}

      <View style={styles.imageCarousel}>
        <TouchableOpacity
          onPress={handlePreviousImage}
          disabled={currentImageIndex === 0}
        >
          <Text
            style={[
              styles.arrow,
              currentImageIndex === 0 && styles.disabledArrow,
            ]}
          >
            {"‹"}
          </Text>
        </TouchableOpacity>

        <View style={styles.imageWrapper}>
          {imageLoading && (
            <ActivityIndicator
              size="small"
              color="#000"
              style={styles.loader}
            />
          )}
          {projectImages.length > 0 ? (
            <Image
              source={{ uri: projectImages[currentImageIndex] }}
              style={styles.projectImage}
              resizeMode="contain"
            />
          ) : (
            <Text style={{ textAlign: "center", color: "gray" }}>
              No Attachments Available
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleNextImage}
          disabled={currentImageIndex === projectImages.length - 1}
          style={{ width: "auto", height: "auto" }}
        >
          <Text
            style={[
              styles.arrow,
              currentImageIndex === projectImages.length - 1 &&
                styles.disabledArrow,
            ]}
          >
            {"›"}
          </Text>
        </TouchableOpacity>
      </View>


      <View style={styles.projectDetails}>



      </View>



      <Text style={styles.title}>Submitted Sheets Details</Text>
      <Text style={styles.description}>Project ID: {projectId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 20,
  },
  paginationControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  pageIndicator: {
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    alignSelf: "center",
    marginBottom: 10,
  },
  list: {
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 6,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemText: {
    fontWeight: "bold",
  },
  imageCarousel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  projectImage: {
    width: 250,
    height: 180,
    borderRadius: 10,
    // backgroundColor:'red'
  },
  arrow: {
    fontSize: 70,
    paddingHorizontal: 5,
    color: "#000",
    fontWeight: "bold",
  },

  disabledArrow: {
    color: "#aaa",
  },

  projectDetails:{
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: "#fff",

  }
});

export default SubmitedSheetsDetails;
