import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {baseurl} from '../utils/urls';
import {PieChart, BarChart} from 'react-native-gifted-charts';
import moment from 'moment';
import Icons from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import DateRangePickers from 'react-native-daterange-picker';
import {ScrollView} from 'react-native-gesture-handler';
import {StackedBarChart} from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Dashboard = () => {
  const navigation = useNavigation();
  const currentDates = moment();
  const [project, setproject] = useState([]);
  const [employeeid, setemployeeid] = useState(0);
  const [response1, setresponse] = useState();
  const [graphdata1, setgraphdata] = useState();
  const [startofweek, setstartofweek] = useState();
  const [endofweek, setendofweek] = useState();
  const [loading, setLoading] = useState(true);
  const [submit, setsubmit] = useState(true);
  const [submitData, setsubmitData] = useState(false);
  const [value, setValue] = useState(moment());
  const [bargraphdata, setbargraphdata] = useState();
  const [pieData1, setpieData] = useState();
  const [startDate, setStartDate] = useState(
    currentDates.clone().startOf('isoWeek').toDate(),
  );
  const [endDate, setEndDate] = useState(
    currentDates.clone().endOf('isoWeek').toDate(),
  );
  const [weekdata, setweekdata] = useState(false);
  const [displayedDates, setDisplayedDate] = useState(currentDates);
  const setDates = (dates, displayedDates) => {
    if (dates.startDate) {
      // console.log(dates.startDate.format('YYYY-MM-DD'));
      setValue(dates.startDate.format('YYYY-MM-DD'));
      setweekdata(true);
    } else if (dates.endDate) {
      //console.log(dates.endDate.format('YYYY-MM-DD'));
      setValue(dates.endDate.format('YYYY-MM-DD')); // Update the value as needed when no start date is selected
    }
    if (dates.displayedDate) {
      setweekdata(true);
      if (
        parseInt(dates.displayedDate.format('MM')) <
        parseInt(displayedDates.format('MM'))
      ) {
        const previousMonth = moment(displayedDates).subtract(1, 'month');
        setDisplayedDate(previousMonth);
        setValue(previousMonth);
      } else if (
        parseFloat(dates.displayedDate.format('MM')) >
        parseFloat(displayedDates.format('MM'))
      ) {
        const nextMonth = moment(displayedDates).add(1, 'month');
        setDisplayedDate(nextMonth);
        setValue(nextMonth);
      }
    }
  };
  function getweekdays(val) {
    const moment = require('moment');
    const selectedDate = moment(val);

    // Set Monday as the start of the week
    moment.updateLocale('en', {
      week: {
        dow: 1, // Monday is the start of the week
      },
    });

    // Get the start of the current week (Monday)
    const startOfWeek = selectedDate.clone().startOf('isoWeek').toDate();

    // Get the end of the current week (Sunday)
    const endOfWeek = selectedDate.clone().endOf('isoWeek').toDate();

    // Push the start and end dates of the week into an array
    const week = [];
    week.push(startOfWeek);
    week.push(endOfWeek);
    // console.log('Start of the week:', startOfWeek);
    // console.log('End of the week:', endOfWeek);
    return week;
  }

  const staticData = [
    {
      project_id: 5771,
      project_name: 'Internal Attended Training',
      project_color_code: 'rgb(217, 26, 118)',
      client_id: 17,
      client_name: 'Pronteff',
      task_description:
        'Working On Ourly Mobile App (Holidays List with Static Data)',
      task_total_time: '03:36:00',
    },
    {
      project_id: 5771,
      project_name: 'Internal Attended Training',
      project_color_code: 'rgb(217, 26, 118)',
      client_id: 17,
      client_name: 'Pronteff',
      task_description: 'Working On Ourly Mobile App Date Range Picker Api',
      task_total_time: '03:37:00',
    },
    {
      project_id: 5771,
      project_name: 'Internal Attended Training',
      project_color_code: 'rgb(217, 26, 118)',
      client_id: 17,
      client_name: 'Pronteff',
      task_description: 'Working On Ourly Mobile App Date Range Picker Api',
      task_total_time: '03:30:00',
    },
    {
      project_id: 5771,
      project_name: 'Internal Attended Training',
      project_color_code: 'rgb(217, 26, 118)',
      client_id: 17,
      client_name: 'Pronteff',
      task_description: 'Working On Ourly Mobile App Date Range Picker Api',
      task_total_time: '01:30:00',
    },
    {
      project_id: 5771,
      project_name: 'Internal Attended Training',
      project_color_code: 'rgb(217, 26, 118)',
      client_id: 17,
      client_name: 'Pronteff',
      task_description:
        'Working On Ourly Mobile App Dynamic Timesheet API Integration',
      task_total_time: '03:35:00',
    },
    {
      project_id: 5771,
      project_name: 'Internal Attended Training',
      project_color_code: 'rgb(217, 26, 118)',
      client_id: 17,
      client_name: 'Pronteff',
      task_description:
        'Working On Ourly Mobile App Dynamic Timesheet API Integration',
      task_total_time: '03:30:00',
    },
    {
      project_id: 5771,
      project_name: 'Internal Attended Training',
      project_color_code: 'rgb(217, 26, 118)',
      client_id: 17,
      client_name: 'Pronteff',
      task_description:
        'Working On Ourly Mobile App Dynamic Timesheet API Integration',
      task_total_time: '01:45:00',
    },
    {
      project_id: 5771,
      project_name: 'Internal Attended Training',
      project_color_code: 'rgb(217, 26, 118)',
      client_id: 17,
      client_name: 'Pronteff',
      task_description:
        'Working On Ourly Mobile App Forgot Password Api Integration',
      task_total_time: '03:30:00',
    },
    {
      project_id: 5771,
      project_name: 'Internal Attended Training',
      project_color_code: 'rgb(217, 26, 118)',
      client_id: 17,
      client_name: 'Pronteff',
      task_description:
        'Working On Ourly Mobile App Forgot Password Api Integration',
      task_total_time: '01:20:00',
    },
    {
      project_id: 5771,
      project_name: 'Internal Attended Training',
      project_color_code: 'rgb(217, 26, 118)',
      client_id: 17,
      client_name: 'Pronteff',
      task_description: 'Working On Ourly Mobile App Log In Api ',
      task_total_time: '03:35:00',
    },
  ];
  const graphdata = {
    status: 200,
    time: '2023-6-1 10:34:18',
    response: [
      {
        total_time: '15:50:00',
        top_project: {
          project_id: 7936,
          project_name: 'Desker',
          project_color_code: 'rgb(160, 7, 232)',
          project_code: 'DESCON01EXT',
          client_id: 12,
          client_name: 'Grene',
          tag_id: 2,
          tag_name: 'External',
          total_time: '11:40:00',
          total_milliseconds: 42000000,
        },
      },
      [
        {
          project_name: 'Desker',
          value: [
            {
              project_name: 'Desker',
              project_color_code: 'rgb(160, 7, 232)',
              project_code: 'DESCON01EXT',
              client_id: 12,
              client_name: 'Grene',
              tag_id: 2,
              tag_name: 'External',
              total_time: '03:10:00',
              task_created_datetime: '2023-05-29',
            },
            {
              project_name: 'Desker',
              project_color_code: 'rgb(160, 7, 232)',
              project_code: 'DESCON01EXT',
              client_id: 12,
              client_name: 'Grene',
              tag_id: 2,
              tag_name: 'External',
              total_time: '08:30:00',
              task_created_datetime: '2023-05-31',
            },
          ],
        },
        {
          project_name: 'Ourly',
          value: [
            {
              project_name: 'Ourly',
              project_color_code: 'rgb(211, 241, 25)',
              project_code: 'OURPRJ01INT',
              client_id: 17,
              client_name: 'Pronteff',
              tag_id: 1,
              tag_name: 'Internal',
              total_time: '03:10:00',
              task_created_datetime: '2023-05-30',
            },
            {
              project_name: 'Ourly',
              project_color_code: 'rgb(211, 241, 25)',
              project_code: 'OURPRJ01INT',
              client_id: 17,
              client_name: 'Pronteff',
              tag_id: 1,
              tag_name: 'Internal',
              total_time: '01:00:00',
              task_created_datetime: '2023-05-29',
            },
          ],
        },
        {
          project_name: 'Ourly',
          value: [
            {
              project_name: 'Ourly',
              project_color_code: 'red',
              project_code: 'DESCON01EXT',
              client_id: 12,
              client_name: 'Grene',
              tag_id: 2,
              tag_name: 'External',
              total_time: '03:10:00',
              task_created_datetime: '2023-05-29',
            },
            {
              project_name: 'Ourly',
              project_color_code: 'red',
              project_code: 'DESCON01EXT',
              client_id: 12,
              client_name: 'Grene',
              tag_id: 2,
              tag_name: 'External',
              total_time: '08:30:00',
              task_created_datetime: '2023-05-31',
            },
          ],
        },
      ],
      [
        {
          task_created_datetime: '2023-05-29',
          total_time: '04:10:00',
        },
        {
          task_created_datetime: '2023-05-30',
          total_time: '03:10:00',
        },
        {
          task_created_datetime: '2023-05-31',
          total_time: '08:30:00',
        },
      ],
      [
        {
          project_id: 7936,
          project_name: 'Desker',
          project_color_code: 'rgb(160, 7, 232)',
          project_code: 'DESCON01EXT',
          client_id: 12,
          client_name: 'Grene',
          tag_id: 2,
          tag_name: 'External',
          total_time: '11:40:00',
        },
        {
          project_id: 1372,
          project_name: 'Ourly',
          project_color_code: 'rgb(211, 241, 25)',
          project_code: 'OURPRJ01INT',
          client_id: 17,
          client_name: 'Pronteff',
          tag_id: 1,
          tag_name: 'Internal',
          total_time: '04:10:00',
        },
      ],
    ],
  };
  const week = 0;
  useEffect(() => {
    retrieveData();
  }, [startDate, endDate]);
  const retrieveData = async () => {
    let loginResponse;

    try {
      const storedResponse = await AsyncStorage.getItem('loginResponse');
      if (storedResponse !== null) {
        loginResponse = JSON.parse(storedResponse);
        setemployeeid(loginResponse[0].employee_id);
        // Use the retrieved data in your screen
      }
    } catch (error) {
      console.log(error);
    }
    let weeks = getweekdays();
    function axiosdata() {
      console.log('axios data working fine . . . . ');
      axios
        .post(
          `${baseurl}/api/analyze/get/dashboad/all/tasks/weekly/filter/by/descrip`,
          {
            start_date: moment(startDate).format('YYYY-MM-DD'),
            end_date: moment(endDate).format('YYYY-MM-DD'),
            employee_id: loginResponse[0].employee_id,
            role_id: 6435,
          },
        )
        .then(response => {
          console.log('axios data working fine');
          setresponse(response?.data?.response);
        })
        .catch(error => console.log(error));
    }

    function graphdataa(start, end, emp) {
      axios
        .post(`${baseurl}/api/analyze/get/dashboad/overview`, {
          start_date: moment(startDate).format('YYYY-MM-DD'),
          end_date: moment(endDate).format('YYYY-MM-DD'),
          employee_id: loginResponse[0].employee_id,
          role_id: 6435,
        })
        .then(response => {
          // let data = [...response.data];
          setgraphdata(response?.data);
          console.log(
            '=====>',
            response?.data.response[1][0].value.map(val => val),
          );
          let arr = response?.data?.response[1].map(val1 =>
            val1.value.map(val => val),
          );
          arr = arr.flat();
          console.log('}}}}}}}', arr);
          const stackData = [];
          if (arr.length > 0) {
            arr?.forEach(item => {
              const existingStack = stackData?.find(
                stack => stack?.label === item?.task_created_datetime,
              );

              if (existingStack) {
                existingStack?.stacks?.push({
                  value: parseFloat(item?.total_time),
                  color: item?.project_color_code,
                });
              } else {
                stackData?.push({
                  stacks: [
                    {
                      value: parseFloat(item?.total_time),
                      color: item?.project_color_code,
                    },
                  ],
                  label: item?.task_created_datetime,
                });
              }
            });
          }
          setbargraphdata(stackData);

          let pieData = arr?.map(obj => ({
            value: parseFloat(obj?.total_time?.split(':')[0]),
            color: obj?.project_color_code,
          }));
          console.log('MMMMMMMMMMMMMMmm', pieData);
          setpieData(pieData);
        })
        .catch(error => console.log('data has been set error: ' + error));
    }
    axiosdata();
    graphdataa();
    weeks = [];
    console.log('???????????????????/', pieData1);
  };

  return (
    <>
      <View style={styles.drawerHeader}>
        <TouchableOpacity
          style={{flex: 2}}
          onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={25} style={{paddingLeft: 10}} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerRight}></Text>
      </View>
      <View style={styles.screen}>
        <DateRangePickers
          onChange={val => {
            setDates(val, displayedDates);
          }}
          endDate={endDate}
          startDate={startDate}
          displayedDate={displayedDates}
          range>
          <Text
            style={{
              color: 'black',
              borderWidth: 2,
              fontSize: 21,
              height: 40,
              width: 250,
              borderRadius: 5,
              paddingTop: 5,
              paddingLeft: 20,
              marginTop: 10,
            }}>
            {moment(startDate).format('YYYY-MM-DD')}_
            {moment(endDate).format('YYYY-MM-DD')}
          </Text>
        </DateRangePickers>
        <TouchableOpacity
          style={{marginTop: 15}}
          onPress={() => {
            const previousWeek = moment(value).subtract(7, 'days');
            setValue(previousWeek);
            const weekDates = getweekdays(previousWeek);
            setStartDate(weekDates[0]);
            setEndDate(weekDates[1]);
          }}>
          <Icons
            name="left"
            size={25}
            color="black"
            style={{paddingLeft: 10}}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{marginTop: 15}}
          onPress={() => {
            const postWeek = moment(value).add(7, 'days');
            setValue(postWeek);
            const weekDates = getweekdays(postWeek);
            setStartDate(weekDates[0]);
            setEndDate(weekDates[1]);

            // let currentDate = moment(value).add(6, 'days');
            // let weekStart = currentDate.endOf('week');
            // console.log('sjdfhgdkhbzzzzzzzzzzzzzzzzzzzzzzzzzz', weekStart);
            // setValue(moment(value).add(7, 'days'));

            // let days = [];
            // days.push(moment(weekStart).add(1, 'days').format('YYYY-MM-DD'));
            // days.push(moment(weekStart).add(7, 'days').format('YYYY-MM-DD'));
          }}>
          <Icons
            name="right"
            size={25}
            color="black"
            style={{paddingLeft: 10}}
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View
          style={{backgroundColor: 'lightgray', marginTop: 10, padding: 10}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <View style={{flex: 3}}>
              <Text style={styles.text}>TotalTime</Text>
              <Text style={{fontSize: 16}}>
                {graphdata1?.response?.[0]?.total_time}
              </Text>
            </View>
            <View style={{flex: 4}}>
              <Text style={styles.text}>Top Project</Text>
              <Text style={{fontSize: 16}}>
                {graphdata1?.response?.[0]?.top_project?.project_name}
              </Text>
            </View>
            <View style={{flex: 3}}>
              <Text style={styles.text}>Top Client</Text>
              <Text style={{fontSize: 16}}>
                {graphdata1?.response?.[0]?.top_project?.client_name}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              margin: 15,
            }}>
            <BarChart width={370} spacing={74} stackData={bargraphdata} />
            {/* <StackedBarChart
              data={data}
              width={370}
              height={220}
              const
              chartConfig={{
                backgroundGradientFrom: '#fff',
                backgroundGradientFromOpacity: 0,
                backgroundGradientTo: 'red',
                backgroundGradientToOpacity: 0.5,
                color: (opacity = 1) => `rgba(50, 255, 146, ${opacity})`,
                strokeWidth: 5, // optional, default 3
                barPercentage: 0.8,
                useShadowColorFromDataset: false, // optional
              }}
            /> */}
          </View>
          <View
            style={{
              alignItems: 'center',
            }}>
            {pieData1 ? (
              <PieChart
                donut
                innerRadius={50}
                data={pieData1}
                radius={80}
                centerLabelComponent={() => {
                  return (
                    <Text style={{fontSize: 30}}>
                      {graphdata1?.response?.[0]?.total_time?.slice(0, 5)}
                    </Text>
                  );
                }}
              />
            ) : (
              []
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              width: '100%',
              borderWidth: 2,
              alignSelf: 'flex-end',
              padding: 5,
              borderRadius: 3,
            }}>
            <View style={{flex: 4}}>
              <Text style={styles.text}>Project</Text>
              <Text style={{fontSize: 16}}>Internal Attended Trainee</Text>
            </View>
            <View style={{flex: 3}}>
              <Text style={styles.text}>Client</Text>
              <Text style={{fontSize: 16}}>Pronteff</Text>
            </View>
            <View style={{flex: 3}}>
              <Text style={styles.text}>Duration</Text>
              <Text style={{fontSize: 16}}>46:00:00</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: 'lightgray',
          }}>
          <Text style={{fontSize: 25}}>Most Tracked Activities</Text>
          <FlatList
            data={response1}
            keyExtractor={(item, index) => item?.task_id}
            renderItem={({item}) => (
              <View
                style={{
                  backgroundColor: '#fff',
                  margin: 5,
                  borderRadius: 5,
                  padding: 5,
                }}>
                <Text style={{color: 'black', fontSize: 16}}>
                  {item?.task_description}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{fontSize: 17}}>{item.project_name}</Text>
                  <Text style={{color: 'black', fontWeight: 'bold'}}>
                    {item?.task_total_time}
                  </Text>
                </View>
              </View>
            )}
            ListFooterComponent={<View style={{height: 20}}></View>}
          />
        </View>
      </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  screen: {
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 1,
  },
  drawerHeader: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openButton: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 6,
    paddingLeft: 60,
  },
  headerRight: {
    flex: 2,
  },
  text: {fontSize: 20, color: 'black'},
});
export default Dashboard;
