import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
  StatusBar, TextInput } from 'react-native';
import { LocalTaskRepository } from '../../domain/repository/dataLayer/LocalTaskRepository';
import { GetTasksUseCase } from '../../domain/UseCases/homeUseCase/GetTaskUseCase';
import { GetCalendarEventsUseCase } from '../../domain/UseCases/homeUseCase/GetCalendarEventsUseCase'
 



// Custom Hook for Business Logic
const useFarmingData = () => {
  const [tasks, setTasks] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const repository = new LocalTaskRepository();
        const getTasksUseCase = new GetTasksUseCase(repository);
        const getCalendarUseCase = new GetCalendarEventsUseCase(repository);
        
        const [tasksData, eventsData] = await Promise.all([
          getTasksUseCase.execute(),
          getCalendarUseCase.execute()
        ]);
        
        setTasks(tasksData);
        setCalendarEvents(eventsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  return { tasks, calendarEvents, loading };
};

// Calendar Component
const Calendar = ({ events }) => {
  const currentDate = new Date();
  const currentMonth = 6; // July (0-indexed)
  const currentYear = 2025;
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  const getEventForDate = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.find(event => event.date === dateStr);
  };
  
  const renderCalendarDay = (day, isCurrentMonth = true) => {
    const event = isCurrentMonth ? getEventForDate(day) : null;
    const isToday = day === 8; // Highlighting day 8 as shown in the image
    
    let dayStyle = [styles.calendarDay];
    let textStyle = [styles.calendarDayText];
    
    if (!isCurrentMonth) {
      dayStyle.push(styles.calendarDayInactive);
      textStyle.push(styles.calendarDayTextInactive);
    } else if (event?.isCompleted) {
      dayStyle.push(styles.calendarDayCompleted);
      textStyle.push(styles.calendarDayTextCompleted);
    } else if (event) {
      dayStyle.push(styles.calendarDayEvent);
      textStyle.push(styles.calendarDayTextEvent);
    } else if (isToday) {
      dayStyle.push(styles.calendarDayToday);
      textStyle.push(styles.calendarDayTextToday);
    }
    
    return (
      <TouchableOpacity key={`${day}-${isCurrentMonth}`} style={dayStyle}>
        <Text style={textStyle}>{day}</Text>
      </TouchableOpacity>
    );
  };
  
  const renderCalendar = () => {
    const days = [];
    
    // Previous month's trailing days
    const prevMonth = new Date(currentYear, currentMonth, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push(renderCalendarDay(prevMonthDays - i, false));
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(renderCalendarDay(day));
    }
    
    // Next month's leading days
    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push(renderCalendarDay(day, false));
    }
    
    return days;
  };
  
  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarHeader}>
        <Text style={styles.monthText}>July 2025</Text>
      </View>
      
      <View style={styles.weekDaysContainer}>
        {weekDays.map((day, index) => (
          <Text key={index} style={styles.weekDayText}>{day}</Text>
        ))}
      </View>
      
      <View style={styles.calendarGrid}>
        {renderCalendar()}
      </View>
    </View>
  );
};

// Task Item Component
const TaskItem = ({ task }) => {
  const getTaskIcon = (type) => {
    switch (type) {
      case 'soil_test': return '🧪';
      case 'agronomist': return '👨‍🌾';
      case 'visit': return '🚜';
      default: return '📋';
    }
  };
  
  const getTaskProgress = (type) => {
    switch (type) {
      case 'soil_test': return '1/4 Tests';
      case 'agronomist': return '0/4 Appointments';
      case 'visit': return '0/2 Visit';
      default: return '';
    }
  };
  
  return (
    <View style={styles.taskItem}>
      <Text style={styles.taskIcon}>{getTaskIcon(task.type)}</Text>
      <View style={styles.taskContent}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.taskProgress}>{getTaskProgress(task.type)}</Text>
      </View>
    </View>
  );
};

// Legend Component
const Legend = () => (
  <View style={styles.legendContainer}>
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, styles.legendDotCompleted]} />
      <Text style={styles.legendText}>Conduct Soil Test</Text>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, styles.legendDotPending]} />
      <Text style={styles.legendText}>Book Agronomist</Text>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, styles.legendDotVisit]} />
      <Text style={styles.legendText}>Visit Nearby Farmer</Text>
    </View>
  </View>
);

// Main Screen Component
const MyCropScreen = () => {
  const { tasks, calendarEvents, loading } = useFarmingData();
  // const [activeTab, setActiveTab] = useState(false)


  
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Crop</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Farm"
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
        
        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>Good morning,</Text>
          <Text style={styles.nameText}>Annie</Text>
        </View>
        
        {/* Calendar */}
        <Calendar events={calendarEvents} />
        
        {/* Legend */}
        <Legend />
        
        {/* Harvest Notification */}
        <View style={styles.harvestNotification}>
          <Text style={styles.harvestText}>
            Your crop is likely to be due for harvest on or around September 29
          </Text>
        </View>
        
        {/* Due Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.actionsTitle}>Due Actions</Text>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </View>
      </ScrollView>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    padding: 5,
  },
  backArrow: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  notificationButton: {
    padding: 5,
  },
  notificationIcon: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButton: {
    marginLeft: 10,
    padding: 10,
  },
  filterIcon: {
    fontSize: 20,
  },
  greetingContainer: {
    marginBottom: 25,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: '300',
    color: '#333',
  },
  nameText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#4CAF50',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarHeader: {
    marginBottom: 15,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    width: 40,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 20,
  },
  calendarDayText: {
    fontSize: 16,
    color: '#333',
  },
  calendarDayInactive: {
    opacity: 0.3,
  },
  calendarDayTextInactive: {
    color: '#ccc',
  },
  calendarDayCompleted: {
    backgroundColor: '#4CAF50',
  },
  calendarDayTextCompleted: {
    color: '#fff',
    fontWeight: '600',
  },
  calendarDayEvent: {
    backgroundColor: '#e8f5e8',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
  },
  calendarDayTextEvent: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  calendarDayToday: {
    backgroundColor: '#4CAF50',
  },
  calendarDayTextToday: {
    color: '#fff',
    fontWeight: '600',
  },
  legendContainer: {
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  legendDotCompleted: {
    backgroundColor: '#4CAF50',
  },
  legendDotPending: {
    backgroundColor: '#e0e0e0',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
  },
  legendDotVisit: {
    backgroundColor: '#e0e0e0',
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
  harvestNotification: {
    backgroundColor: '#fff3e0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  harvestText: {
    fontSize: 14,
    color: '#e65100',
  },
  actionsContainer: {
    marginBottom: 100,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  taskProgress: {
    fontSize: 14,
    color: '#666',
  },
  // bottomNav: {
  //   flexDirection: 'row',
  //   backgroundColor: '#4CAF50',
  //   paddingVertical: 10,
  //   paddingHorizontal: 20,
  //   position: 'absolute',
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  // },
  // navItem: {
  //   flex: 1,
  //   alignItems: 'center',
  //   paddingVertical: 5,
  // },
  // navItemCenter: {
  //   flex: 1,
  // },
  // navIcon: {
  //   fontSize: 20,
  //   marginBottom: 2,
  // },
  // navText: {
  //   fontSize: 12,
  //   color: '#fff',
  //   fontWeight: '500',
  // },
  // centerNavIcon: {
  //   backgroundColor: '#2E7D32',
  //   borderRadius: 25,
  //   width: 50,
  //   height: 50,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginBottom: 5,
  // },
  // centerNavText: {
  //   fontSize: 24,
  // },
});

export default MyCropScreen;