import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList,Image, TouchableOpacity } from 'react-native';
import { getProjectDetailsById } from './aftherlogin';



const SubmitedSheetsDetails = ({ route }) => {
  const { selectedRowData, projectId } = route.params;

// console.log('Selected Row Data:', selectedRowData);
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalWeeks, setTotalWeeks] = useState(1);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [projectImages, setProjectImages] = useState(['ng bhjdbh','jhvnkskj','jhvjhvj','jhvjhvj']);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);



  // useFocusEffect(
  //   useCallback(() => {
  //     fetchInitialData();
  //   }, [projectId])
  // );

  useEffect(() => {
    fetchInitialData()

  },[projectId,selectedRowData])


  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const projectDetails = await getProjectDetailsById(projectId);
      setProjectData(projectDetails);
      setCurrentPageData(selectedRowData)
      const diffDays=projectDetails.endDate-projectDetails.startDate
      const totalDays = Math.ceil(diffDays*1000 / (1000 * 60 * 60 * 24));
      const totalPages = Math.ceil(totalDays / 7)+1;
      setTotalWeeks(totalPages);
      setCurrentPageData(prev =>( {
        ...prev,
        startDate: formatDate(selectedRowData.startDate),
        endDate: formatDate(selectedRowData.endDate),
      }))
      console.log('Project Data', projectDetails);
      console.log('Time sheet selected data', selectedRowData);
      console.log('Total Pages', totalPages);
    } catch (err) {
      console.error('Error fetching data', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
const value = new Date(date*1000);
const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return value.toLocaleDateString('en-GB', options);
  }




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
        <Button title="Previous" onPress={handlePrevious} disabled={currentPage === 1} />
        <Text style={styles.pageIndicator}>
        {currentPageData.startDate}{` - ` }{currentPageData.endDate}
        </Text>
        <Button title="Next" onPress={handleNext} disabled={currentPage === totalWeeks} />
      </View>


      <View style={styles.imageCarousel}>
      <TouchableOpacity onPress={handlePreviousImage} disabled={currentImageIndex === 0}>
  <Text style={[styles.arrow, currentImageIndex === 0 && styles.disabledArrow]}>{'‹'}</Text>
</TouchableOpacity>


        <Image
          source={{ uri: projectImages[currentImageIndex] }}
          style={styles.projectImage}
          resizeMode="contain"
        />

<TouchableOpacity onPress={handleNextImage} disabled={currentImageIndex === projectImages.length - 1}>
  <Text style={[styles.arrow, currentImageIndex === projectImages.length - 1 && styles.disabledArrow]}>{'›'}</Text>
</TouchableOpacity>

      </View>



      <Text style={styles.title}>Submitted Sheets Details</Text>
      <Text style={styles.description}>Project ID: {projectId}</Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  paginationControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  pageIndicator: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    alignSelf: 'center',
    marginBottom: 10,
  },
  list: {
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 6,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemText: {
    fontWeight: 'bold',
  },
  imageCarousel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 10,
  },

  projectImage: {
    width: 250,
    height: 200,
    borderRadius: 10,
  },
  arrow: {
    fontSize: 30, 
    paddingHorizontal: 5,
    color: '#000',
    fontWeight: 'bold',
  },

  disabledArrow: {
    color: '#aaa',
  },


});

export default SubmitedSheetsDetails;
