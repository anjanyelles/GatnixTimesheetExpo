import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from "react-native";
import { getProjectDetailsById, getUserProfiledata } from "./aftherlogin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, Icon } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { ScrollView } from "react-native-gesture-handler";
import { sheetsNextData, sheetsPreviousData } from "./sheetsData";
import { Feather } from "@expo/vector-icons";
import TimesheetDetailsModal from "./TimesheetDetailsModal";
import axios from "axios";

const ApprovedSheetsDetails = ({ route }) => {
  const { selectedRowData, projectId } = route.params
  const [count, setCount] = useState(0)

  const colorThemes = [
    { backgroundColor: "#cce5ff", color: "#004085" },
    { backgroundColor: "#c3c8cd", color: "#000" },
    { backgroundColor: "#fff3cd", color: "#856404" },
    { backgroundColor: "#d4edda", color: "#155724" },
  ];

  const rejectedTheme = { backgroundColor: "#f8d7da", color: "#721c24" };

  const navigation = useNavigation();
  // console.log('Selected Row Data:', selectedRowData);
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [projectImages, setProjectImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);
  const [disableNxtButton, setDisableNxtButton] = useState(false);
  const [comments, setComments] = useState([]);
  const [projectIsClosed, setProjectIsClosed] = useState(false);

  const [showapprovedalert, setShowApprovalAlert] = useState(false);

  const [timesheetModalVisible, setTimesheetModalVisible] = useState(false);


  // useFocusEffect(
  //   useCallback(() => {
  //     setCurrentPageData((prev) => ({
  //       ...selectedRowData,
  //       startDate: formatDate(selectedRowData.startDate),
  //       endDate: formatDate(selectedRowData.endDate),
  //       showStartDateToUser: formatDatetoShowUser(selectedRowData.startDate),
  //       showEndDateToUser: formatDatetoShowUser(selectedRowData.endDate),
  //     }));

  //     if (Array.isArray(selectedRowData?.comments)) {
  //       setComments(selectedRowData.comments);
  //     } else {
  //       setComments([]);
  //     }
  //     fetchInitialData(projectId);
  //   }, [projectId, selectedRowData])
  // );




  useEffect(() => {
    // Reset state variables when new data is passed
    setCurrentPageData((prev) => ({
      ...selectedRowData,
      startDate: formatDate(selectedRowData.startDate),
      endDate: formatDate(selectedRowData.endDate),
      showStartDateToUser: formatDatetoShowUser(selectedRowData.startDate),
      showEndDateToUser: formatDatetoShowUser(selectedRowData.endDate),
    }));

    if (Array.isArray(selectedRowData?.comments)) {
      setComments(selectedRowData.comments);
    } else {
      setComments([]);
    }
    console.log("Selected Row Data:", selectedRowData);
    fetchInitialData(projectId);
  }, [projectId, selectedRowData]);

  const getCommentStyle = (commentText) => {
    if (commentText.toLowerCase().includes("reject")) {
      return rejectedTheme;
    }
    const randomIndex = Math.floor(Math.random() * colorThemes.length);
    return colorThemes[randomIndex];
  };

  const commentsFormatDate = (dateValue) => {
    if (
      typeof dateValue === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(dateValue)
    ) {
      return dateValue;
    }

    const timestamp = parseInt(dateValue, 10);
    if (!isNaN(timestamp)) {
      const date = new Date(timestamp * 1000);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0];
      }
    }

    return dateValue;
  };

  const fetchInitialData = async (projectId) => {
    setLoading(true);
    try {
      const projectDetails = await getProjectDetailsById(projectId);
      console.log("project data ", projectDetails);
      setProjectData(projectDetails);
      setProjectIsClosed(projectDetails?.status === "closed");
      fetchProjectImages(selectedRowData);
      console.log("project data ", projectDetails);
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectImages = async (data) => {
    const orgId = await AsyncStorage.getItem("orgId");

    const token = await AsyncStorage.getItem("token")
    const id = await AsyncStorage.getItem("id");

    setImageLoading(true);

    const x = [
      "315f8081-098f-49e5-bab1-056cba95e0cbtable-data (3).xlsx",
      "315f8081-098f-49e5-bab1-056cba95e0cbtable-data (2).xlsx",
      "315f8081-098f-49e5-bab1-056cba95e0cbtable-data (1).xlsx",
      "315f8081-098f-49e5-bab1-056cba95e0cbtable-data (4).xlsx",
      "315f8081-098f-49e5-bab1-056cba95e0cbtable-data (5).xlsx",
      "315f8081-098f-49e5-bab1-056cba95e0cbtable-data (6).xlsx",
    ];

    try {
      const files = (data.attachments || []).map((fileName, index) => {
        const encodedFileName = encodeURIComponent(fileName);
        const attachmentUrl = `https://www.gatnix.com/api/v1/org/${orgId}/user/${id}/user-profile/download/${encodedFileName}`;
        const extension = fileName.split(".").pop().toLowerCase();

        let type = "other";

        if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension))
          type = "image";
        else if (["mp4", "webm", "mov"].includes(extension)) type = "video";
        else if (["xls", "xlsx", "csv"].includes(extension)) type = "excel";

        return {
          id: index,
          type,
          attachmentUrl,
        };
      });

      setProjectImages(files);
    } catch (err) {
      console.error("Error loading attachments:", err);
    } finally {
      setImageLoading(false);
    }
  };

  const formatDatetoShowUser = (date) => {
    const formatted = new Date(date * 1000).toLocaleDateString("en-GB");
    return formatted.replace(/\//g, "-");
  };

  const formatDate = (date) => {
    const value = new Date(date * 1000);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return value.toLocaleDateString("en-GB", options);
  };

  const handlePrevious = async () => {
    setLoading(true);

    try {
      const response = await sheetsPreviousData(
        currentPageData.orgId,
        currentPageData.projectId,
        currentPageData.id
      );

      if (response?.status === 200) {
        const data = await response.data;

        if (data) {
          setCurrentPageData(data);
          setCurrentPage((prev) => Math.max(prev - 1, 1));
          setCurrentPageData((prev) => ({
            ...prev,
            startDate: formatDate(data.startDate),
            endDate: formatDate(data.endDate),
            showStartDateToUser: formatDatetoShowUser(data.startDate),
            showEndDateToUser: formatDatetoShowUser(data.endDate),
          }));
          setDisableNxtButton(false);
          if (Array.isArray(currentPageData?.comments)) {
            setComments(currentPageData.comments);
          } else {
            setComments([]);
          }

          await fetchInitialData(data.projectId);

          await fetchProjectImages(data);
        } else {
          Alert.alert("No Data", "Received empty data");
        }
      } else {
        Alert.alert("Error", `Server responded with status ${response.status}`);
      }
    } catch (err) {
      if (err?.response?.status === 404) {
        setDisableNxtButton(true);
      } else {
        Alert.alert("Error", "Unable to load next data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    setLoading(true);

    try {
      const response = await sheetsNextData(
        currentPageData.orgId,
        currentPageData.projectId,
        currentPageData.id
      );

      if (response?.status === 200) {
        const data = await response.data;

        if (data) {
          console.log("Next Data:", data);
          setCurrentPageData(data);
          setCurrentPage((prev) => prev + 1);

          setCurrentPageData((prev) => ({
            ...prev,
            startDate: formatDate(data.startDate),
            endDate: formatDate(data.endDate),
            showStartDateToUser: formatDatetoShowUser(data.startDate),
            showEndDateToUser: formatDatetoShowUser(data.endDate),
          }));
          if (Array.isArray(currentPageData?.comments)) {
            setComments(currentPageData.comments);
          } else {
            setComments([]);
          }

          await fetchInitialData(data.projectId);

          await fetchProjectImages(data);
        } else {
          Alert.alert("No Data", "Received empty data.");
        }
      } else {
        Alert.alert("Error", `Server responded with status ${response.status}`);
      }
    } catch (err) {
      if (err?.response?.status === 404) {
        setDisableNxtButton(true);
      } else {
        Alert.alert("Error", "Unable to load next data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      Math.min(prevIndex + 1, projectImages.length - 1)
    );
  };

  const handleDownload = async (file) => {
    const url = file.attachmentUrl;
    const fileName = url.split("/").pop();
    console.log("Downloading:", fileName, url);

    try {
      // Download the file to a temporary location
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
      const downloadRes = await FileSystem.downloadAsync(url, fileUri);
      if (downloadRes.status !== 200) throw new Error("Download failed");

      // Check if sharing is available
      if (!(await Sharing.isAvailableAsync())) {
        throw new Error("Sharing is not available on this device");
      }

      // Share the file for download
      await Sharing.shareAsync(fileUri, {
        mimeType: file.type === "image" ? "image/*" : file.type === "video" ? "video/*" : "application/octet-stream",
        dialogTitle: `Download ${fileName}`,
        UTI: file.type === "excel" ? "com.microsoft.excel.xls" : undefined,
      });

      // Show success alert
      Alert.alert("Success", `File "${fileName}" downloaded successfully!`);
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert("Error", `Failed to download "${fileName}". Please try again.`);
    }
  };

  const handleApproveandReject = async (data) => {
    console.log("=======handleApproveandReject called with data=======");

   // const token = await AsyncStorage.getItem("token");
    const orgId = await AsyncStorage.getItem("orgId");
    //const id = await AsyncStorage.getItem("id");


    console.log("Current Page Data:", currentPageData);

    if (currentPageData.sheets.length > 0) {
      try {
        setLoading(true);
        console.log("=======Starting approval process=======");

        const updatedtimesheet = { ...currentPageData };
        updatedtimesheet.status = "approved";
        updatedtimesheet.updatedById = updatedtimesheet.employeeId.toString();
        updatedtimesheet.updatedDate = Math.floor(Date.now() / 1000);

        console.log("Before formatting comments:", updatedtimesheet.comments);
        updatedtimesheet.comments = updatedtimesheet.comments.map((comment) => {
          if (!isNaN(comment.date)) {
            const unixTimestamp = parseInt(comment.date, 10);
            comment.date = new Date(unixTimestamp * 1000).toISOString().split('T')[0];
          }
          return comment;
        });

        console.log("After formatting comments:", updatedtimesheet.comments);

        console.log("========Before PUT API call to update timesheet========");
        console.log("Request Body:", updatedtimesheet);



        const timesheetUpdateResponse = await axios.put(
          `https://www.gatnix.com/api/v1/timesheet/${orgId}/date_to_date/projectId/${projectId}/employeeId/${updatedtimesheet.employeeId}/${updatedtimesheet.id}`,
          updatedtimesheet
        );

        const timesheetUpdateData = await timesheetUpdateResponse.data;
        console.log("Timesheet Update Status:", timesheetUpdateData);

        console.log("======================================")
        console.log("employee id is:", updatedtimesheet.employeeId)
        console.log("========================================")

        const employeeResponse = await axios.get(
          `https://www.gatnix.com/api/v1/${orgId}/users/${updatedtimesheet.employeeId}/userRole/employee`
        );

        const employeeData = await employeeResponse.data;
        console.log("Employee Data:", employeeData);

        const approvalManagersResponse = await axios.get(
        `https://www.gatnix.com/api/v1/${orgId}/users/${updatedtimesheet.employeeId}/userRole/approvalManagers`
      );


        const approvalManagersData = await approvalManagersResponse.data;
        console.log("Approval Managers Data:", approvalManagersData);

        const userData = await getUserProfiledata();
        console.log("Logged-in Admin/User Data:", userData);

        const approverName = `${userData.user.firstName} ${userData.user.lastName}`.trim();
        console.log("Approver Name:", approverName);

        const comment = {
          systemGenerated: true,
          comment: `Approved: Your timesheet has been approved by ${approverName}`,
          userId: userData.user.id.toString(),
          employeeId: currentPageData.employeeId,
          commentedBy: approverName,
          orgId: orgId.toString(),
          timeSheetDateToDateId: currentPageData.id,
          date: Math.floor(Date.now() / 1000)
        };

        console.log("Prepared Comment Payload:", comment);

        const commentResponse = await axios.post(
          `https://www.gatnix.com/api/v1/timesheet/${orgId}/comments/${updatedtimesheet.employeeId}`,
          comment
        );


        const commentData = await commentResponse.data;
        console.log("Comment API Response is:", commentData);

        const notification = {
          orgId: orgId,
          notificationSourceId: updatedtimesheet.id,
          notificationType: "timesheet",
          userAssociationIds: [employeeData.associationId, approvalManagersData.associationId],
          viewedUserAssociationIds: [0],
          notificationDescription: `The timesheet ID ${updatedtimesheet.sheetId} status is changed to Approved.`,
          superAdminViewed: false,
          approvalManagerViewed: false,
          employeeViewed: false,
          createdAt: Math.floor(Date.now() / 1000)
        };

        console.log("Prepared Notification Payload:", notification);

        const notificationResponse = await axios.post(
          `https://www.gatnix.com/api/v1/timesheet/${orgId}/notifications`,
          notification
        );


        const notificationData = await notificationResponse.data;
        console.log("Notification API Response is ", notificationData);


        if (
          timesheetUpdateData != null &&
          employeeData != null &&
          approvalManagersData != null &&
          commentData !=null &&
          notificationData !=null
        ) {
          Alert.alert("Success", "Timesheet approved successfully!");
        } else {
          console.warn("One or more API responses not OK.");
        }

      } catch (error) {
        console.error("Error approving timesheet:", error);
        Alert.alert("Error", "Failed to approve timesheet. Please try again.");
      } finally {
        setLoading(false);
      }

    } else {
      console.log("No timesheet data to approve");
      setShowApprovalAlert(true);
      setTimeout(() => {
        setShowApprovalAlert(false);
      }, 2000);
    }
  };


  return (
    <ScrollView style={styles.container}>

      {projectIsClosed && count < 1 && (
        <View style={styles.closedAlert}>
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => {
              setProjectIsClosed(false);
              setCount((prev) => prev + 1);
            }}
          >
            <Feather name="x" size={18} color="#ff5757" />
          </TouchableOpacity>
          <Text style={styles.closedAlertText}>This project is closed</Text>
        </View>
      )}

      {loading && (
        <View style={styles.fullScreenLoader}>
          <ActivityIndicator size="large" color="orange" />
        </View>
      )}

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SubmittedSheets");
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          Project - {projectData.projectCode}
        </Text>
      </View>




      <View style={styles.paginationControls}>
        <Button
          title="Previous"
          onPress={handlePrevious}
          disabled={currentPage === 1}
        />
        <Text style={styles.pageIndicator}>
          {currentPageData.startDate} - {currentPageData.endDate}
        </Text>
        <Button title="Next" onPress={handleNext} disabled={disableNxtButton} />
      </View>


      <View style={styles.employeeDetails}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          <Text style={styles.textItem}>{currentPageData.employeeName}</Text>
          <Text style={styles.textItem}>{currentPageData.clientName}</Text>
          <Text style={styles.textItem}>{currentPageData.endClientName}</Text>


            </ScrollView>
            </View>



      <View style={styles.projectDetails}>
        <Text style={styles.infoText}>
          <Text style={styles.label}>TimeSheet Id :</Text>{" "}
          {currentPageData.sheetId}
        </Text>

        <Text style={styles.infoText}>
          <Text style={styles.label}>Period :</Text>{" "}
          {currentPageData.showStartDateToUser} /{" "}
          {currentPageData.showEndDateToUser}
        </Text>

        <Text style={styles.infoText}>
  <Text style={styles.label}>Billable Hours :</Text>{" "}
  {currentPageData.billableHours} Hours{" "}
  <Text
    style={styles.link}
    onPress={() => setTimesheetModalVisible(true)}
  >
    View
  </Text>
</Text>

        <Text style={styles.infoText}>
          <Text style={styles.label}>Non Billable Hours :</Text>{" "}
          {currentPageData.nonBillableHours} Hours
        </Text>

        <Text style={styles.infoText}>
          <Text style={styles.label}>Status :</Text>{" "}
          <Text style={{ fontWeight: "bold" }}>{currentPageData.status}</Text>
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.approveButton,
              (projectIsClosed ||
                currentPageData?.status?.toLowerCase() === "approved" ||
                currentPageData?.status?.toLowerCase() === "rejected"||
                currentPageData?.status?.toLowerCase() === "inprogress") &&
                styles.disabledButton,
            ]}
            disabled={
              projectIsClosed ||
              currentPageData?.status?.toLowerCase() === "approved" ||
              currentPageData?.status?.toLowerCase() === "rejected"||
               currentPageData?.status?.toLowerCase() === "inprogress"
            }
          onPress={()=>handleApproveandReject('approve')}
          >
            <Text style={styles.buttonText} >Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.rejectButton,
              (projectIsClosed ||
                currentPageData?.status?.toLowerCase() === "approved" ||
                currentPageData?.status?.toLowerCase() === "rejected" ||
                currentPageData?.status?.toLowerCase() === "inprogress") &&
                styles.disabledButton,
            ]}
            disabled={
              projectIsClosed ||
              currentPageData?.status?.toLowerCase() === "approved" ||
              currentPageData?.status?.toLowerCase() === "rejected" ||
               currentPageData?.status?.toLowerCase() === "inprogress"
            }

            onPress={()=>handleApproveandReject('reject')}
          >
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>



        </View>

        {
          showapprovedalert && (
            <View style={styles.closedAlert}>
              <Text style={styles.closedAlertText}>
                The employee has not submitted the timesheet,so approval is not allowed.
              </Text>
            </View>
          )
        }

        <Text style={styles.commentLabel}>Comments:</Text>

        <View style={styles.commentBox}>
          <TextInput
            style={styles.commentInput}
            numberOfLines={10}
            placeholder="Write your Comment"
            multiline={true}
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.sendButton}>
            <Text style={{ color: "#fff" }}>Send</Text>
            {/* <Ionicons name="send" size={20} color="#fff" /> */}
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={[
          styles.commentsContainer,
            {
              minHeight: comments.length > 0 ? 100 : 0,
              maxHeight: 400,
            },

        ]}
      >
        <ScrollView>
          {Array.isArray(currentPageData?.comments) &&
          currentPageData.comments.length > 0 ? (
            currentPageData.comments.map((item, index) => {
              const style = getCommentStyle(item.comment);
              return (
                <View
                  key={item.id || index}
                  style={[styles.commentBoxforComments, style]}
                >
                  <Text style={[styles.commentText, { color: style.color }]}>
                    {item.comment}
                  </Text>
                  <View style={styles.metaRow}>
                    <Ionicons name="person" size={14} color={style.color} />
                    <Text style={[styles.metaText, { color: style.color }]}>
                      {" "}
                      {item.commentedBy}{" "}
                    </Text>
                    <Text style={[styles.metaText, { color: style.color }]}>
                      {commentsFormatDate(item.date)}
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No comments available.
            </Text>
          )}
        </ScrollView>
      </View>

      <View style={styles.imageCarouselContainer}>
        {/* Download Button */}
        {!imageLoading && projectImages.length > 0 && (
          <TouchableOpacity
            onPress={() => handleDownload(projectImages[currentImageIndex])}
            style={styles.downloadButton}
          >
            <Feather name="download" size={20} color="#007AFF" />
            <Text style={styles.downloadButtonText}>Download</Text>
          </TouchableOpacity>
        )}

        {/* Carousel Wrapper */}
        <View style={styles.carouselWrapper}>
          {/* ⬅️ Left Arrow */}
          <TouchableOpacity
            onPress={handlePreviousImage}
            disabled={currentImageIndex === 0}
            style={styles.leftArrow}
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

          {/* Preview Content */}
          <View style={styles.fileCard}>
            {imageLoading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : projectImages.length > 0 ? (
              (() => {
                const currentFile = projectImages[currentImageIndex];
                const fileName = currentFile.attachmentUrl.split("/").pop();

                switch (currentFile.type) {
                  case "image":
                    return (
                      <Image
                        source={{ uri: currentFile.attachmentUrl }}
                        style={styles.projectImage}
                        resizeMode="contain"
                      />
                    );
                  case "video":
                    return (
                      <Video
                        source={{ uri: currentFile.attachmentUrl }}
                        style={styles.projectImage}
                        controls
                        resizeMode="contain"
                        paused={false}
                      />
                    );
                  case "excel":
                    return (
                      <View style={styles.excelCard}>
                        <Text style={styles.excelIcon}>📄</Text>
                        <Text style={styles.excelMessage}>
                          Unable to preview: Excel
                        </Text>
                        <TouchableOpacity>
                          <Text style={styles.downloadLink}>
                            table_data.xlsx
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  default:
                    return (
                      <Text style={styles.unsupportedText}>
                        Unsupported file: {fileName}
                      </Text>
                    );
                }
              })()
            ) : (
              <Text style={{ textAlign: "center", color: "gray" }}>
                No Attachments Available
              </Text>
            )}
          </View>

          {/* ➡️ Right Arrow */}
          <TouchableOpacity
            onPress={handleNextImage}
            disabled={currentImageIndex === projectImages.length - 1}
            style={styles.rightArrow}
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
      </View>

      <View style={{ marginTop: 40 }}></View>

      <TimesheetDetailsModal
  visible={timesheetModalVisible}
  onClose={() => setTimesheetModalVisible(false)}
  timesheetData={currentPageData}
/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  closedAlert: {
    backgroundColor: '#f8d7da',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:15,
  },
  closedAlertText: {
    color: '#721c24',
    fontSize: 14,
    fontWeight: 'bold',
  },
  employeeDetails:{
    backgroundColor:'#e0e0e0',
    borderRadius: 10,
    marginHorizontal:20,
    marginBottom: 10,
    padding: 10,
    elevation: 5,

  },
  scrollContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textItem: {
    minWidth: 100,
    textAlign: 'center',
    color: '#555',
    fontWeight: '600',
  },
  closedAlert: {
    padding: 10,
    marginHorizontal: 4,
    backgroundColor: "rgba(251, 176, 173, 0.7)",
    borderRadius: 8,
    position: "relative",
    marginBottom: 10,
  },

  closeIcon: {
    position: "absolute",
    top: 6,
    right: 6,
    zIndex: 1,
    padding: 4,
  },

  closedAlertText: {
    color: "#ff5757",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  imageCarouselContainer: {
    padding: 10,
    elevation: 5,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  carouselWrapper: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
    marginHorizontal: 10,
  },

  leftArrow: {
    position: "absolute",
    left: -10,
    top: "40%",
    zIndex: 2,
  },

  rightArrow: {
    position: "absolute",
    right: -10,
    top: "40%",
    zIndex: 2,
  },

  arrow: {
    fontSize: 30,
    color: "#007AFF",
    fontWeight: "bold",
  },

  disabledArrow: {
    color: "#ccc",
  },

  fileCard: {
    height: 230,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  excelCard: {
    justifyContent: "center",
    alignItems: "center",
  },
  excelIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  excelMessage: {
    color: "black",
    fontWeight: "600",
    marginBottom: 5,
  },
  downloadLink: {
    color: "#5a0fc8",
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  unsupportedText: {
    color: "red",
    fontWeight: "bold",
  },
  downloadButton: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAF4FF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    zIndex: 10,
  },
  downloadButtonText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginBottom: 10,
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#EAF4FF",
  },
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

  projectImage: {
    width: 200,
    height: 180,
    borderRadius: 10,
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

  projectDetails: {
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 20,
    backgroundColor: "#fff",
    elevation: 5,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  label: {
    color: "#444",
    fontWeight: "bold",
  },
  link: {
    color: "#007bff",
    textDecorationLine: "underline",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
    marginBottom: 10,
  },
  approveButton: {
    backgroundColor: "orange",
    borderRadius: 8,
    color: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  rejectButton: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  rejectText: {
    color: "#333",
    fontWeight: "bold",
  },
  commentLabel: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "bold",
  },
  commentBox: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "orange",
    borderRadius: 10,
    paddingHorizontal: 5,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  commentInput: {
    flex: 1,
    paddingVertical: 8,
    height: 120,
    fontSize: 14,
    textAlignVertical: "top",
  },
  sendButton: {
    backgroundColor: "black",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  fullScreenLoader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  commentsContainer: {

    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 20,
    backgroundColor: "#fff",
    elevation: 5,
  },
  commentBoxforComments: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    elevation: 2,
  },
});

export default ApprovedSheetsDetails;
