import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Divider,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
  Restaurant as RestaurantIcon,
  LocalDining as MealTypeIcon,
  FitnessCenter as GoalsIcon,
  FitnessCenter as FitnessCenterIcon 
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, subDays, addDays, isToday } from 'date-fns';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Custom theme colors
const themeColors = {
  primary: '#FF5722', // Deep Orange
  secondary: '#E64A19', // Darker Orange
  accent: '#FF9800', // Orange
  success: '#4CAF50',
  info: '#2196F3',
  warning: '#FFC107',
  error: '#F44336',
  text: '#333333',
  lightBg: '#FFF3E0' // Light Orange background
};

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const MealTracker = ({ userId }) => {
  const [meals, setMeals] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openGoalsDialog, setOpenGoalsDialog] = useState(false);
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [currentMeal, setCurrentMeal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dailyReport, setDailyReport] = useState(null);
  const [userGoals, setUserGoals] = useState({
    daily_calories: 2000,
    daily_carbs: 250,
    daily_protein: 150,
    daily_fat: 65
  });

  const [mealForm, setMealForm] = useState({
    food_id: '',
    custom_name: '',
    servings: 1,
    meal_type: 'breakfast'
  });

  // Fetch meals and goals
  useEffect(() => {
    if (userId) {
      fetchMeals();
      fetchUserGoals();
    }
  }, [userId, selectedDate]);

  // Fetch food items when search query changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 2) {
        fetchFoodItems();
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const response = await axios.get(`${API_BASE}/meals`, {
        params: { date: dateStr, user_id: userId }
      });
      setMeals(response.data);
      fetchDailyReport(dateStr);
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFoodItems = async () => {
    try {
      const response = await axios.get(`${API_BASE}/foods`, {
        params: { search: searchQuery }
      });
      setFoodItems(response.data);
    } catch (error) {
      console.error('Error fetching food items:', error);
    }
  };

  const fetchUserGoals = async () => {
    try {
      const response = await axios.get(`${API_BASE}/goals`, {
        params: { user_id: userId }
      });
      if (response.data) {
        setUserGoals(response.data);
      }
    } catch (error) {
      console.error('Error fetching user goals:', error);
    }
  };

  const fetchDailyReport = async (date) => {
    try {
      const response = await axios.get(`${API_BASE}/reports/daily`, {
        params: { user_id: userId, date }
      });
      setDailyReport(response.data);
    } catch (error) {
      console.error('Error fetching daily report:', error);
    }
  };

  const handleAddMeal = () => {
    // Close other dialogs first
    setOpenGoalsDialog(false);
    setOpenReportDialog(false);
    setCurrentMeal(null);
    setMealForm({
      food_id: '',
      custom_name: '',
      servings: 1,
      meal_type: 'breakfast'
    });
    setSearchQuery('');
    setFoodItems([]);
    setOpenDialog(true);
  };

  const handleEditMeal = (meal) => {
    setCurrentMeal(meal);
    setMealForm({
      food_id: meal.food_id || '',
      custom_name: meal.custom_name || '',
      servings: meal.servings || 1,
      meal_type: meal.meal_type || 'breakfast'
    });
    setOpenDialog(true);
  };

  const handleDeleteMeal = async (id) => {
    try {
      await axios.delete(`${API_BASE}/meals/${id}`);
      fetchMeals();
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  const handleSaveMeal = async () => {
    try {
      const payload = {
        user_id: userId,
        ...mealForm,
        date: format(selectedDate, 'yyyy-MM-dd')
      };

      if (currentMeal) {
        await axios.put(`${API_BASE}/meals/${currentMeal.id}`, payload);
      } else {
        await axios.post(`${API_BASE}/meals`, payload);
      }

      fetchMeals();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving meal:', error);
    }
  };

  const handleSaveGoals = async () => {
    try {
      await axios.post(`${API_BASE}/goals`, {
        user_id: userId,
        ...userGoals
      });
      setOpenGoalsDialog(false);
      fetchDailyReport(format(selectedDate, 'yyyy-MM-dd'));
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handlePrevDay = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const handleFoodSelect = (food) => {
    setMealForm({
      ...mealForm,
      food_id: food.id,
      custom_name: food.name
    });
  };

  const getMealTypeName = (type) => {
    switch (type) {
      case 'breakfast': return 'Breakfast';
      case 'lunch': return 'Lunch';
      case 'dinner': return 'Dinner';
      case 'snack': return 'Snack';
      default: return type;
    }
  };

  const getMealTypeColor = (type) => {
    switch (type) {
      case 'breakfast': return '#FFA000'; // Amber
      case 'lunch': return '#FF7043'; // Deep Orange
      case 'dinner': return '#E64A19'; // Dark Orange
      case 'snack': return '#FF9800'; // Orange
      default: return themeColors.primary;
    }
  };

  // Chart data for nutrition report
  const getMacroChartData = () => {
    if (!dailyReport?.totals) return null;
    
    const { total_carbs, total_protein, total_fat } = dailyReport.totals;
    const total = total_carbs + total_protein + total_fat;
    
    return {
      labels: ['Carbs', 'Protein', 'Fat'],
      datasets: [
        {
          data: [total_carbs, total_protein, total_fat],
          backgroundColor: [themeColors.info, themeColors.error, themeColors.warning],
          hoverBackgroundColor: [themeColors.info, themeColors.error, themeColors.warning]
        }
      ]
    };
  };

  const getCalorieChartData = () => {
    if (!dailyReport?.breakdown) return null;
    
    return {
      labels: dailyReport.breakdown.map(meal => getMealTypeName(meal.meal_type)),
      datasets: [
        {
          label: 'Calories',
          data: dailyReport.breakdown.map(meal => meal.calories),
          backgroundColor: dailyReport.breakdown.map(meal => getMealTypeColor(meal.meal_type))
        }
      ]
    };
  };

  const getProgress = (current, goal) => {
    if (!goal || goal === 0) return 0;
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage < 50) return themeColors.success;
    if (percentage < 80) return themeColors.warning;
    return themeColors.error;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3, backgroundColor: '#fff' }}>
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          p: 2,
          borderRadius: 2,
          backgroundColor: themeColors.lightBg,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <RestaurantIcon sx={{ fontSize: 40, color: themeColors.primary, mr: 2 }} />
            <Typography variant="h4" component="h1" sx={{ 
              fontWeight: 'bold',
              color: themeColors.text,
              background: `linear-gradient(45deg, ${themeColors.primary}, ${themeColors.secondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Meal Tracker
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<BarChartIcon />}
              onClick={() => {
                setOpenDialog(false);
                setOpenGoalsDialog(false);
                setOpenReportDialog(true);
              }}
              sx={{
                backgroundColor: themeColors.primary,
                '&:hover': { backgroundColor: themeColors.secondary }
              }}
            >
              View Report
            </Button>
            <Button
              variant="outlined"
              startIcon={<GoalsIcon />}
              onClick={() => {
                setOpenDialog(false);
                setOpenReportDialog(false);
                setOpenGoalsDialog(true);
              }}
              sx={{
                color: themeColors.primary,
                borderColor: themeColors.primary,
                '&:hover': { 
                  backgroundColor: themeColors.lightBg,
                  borderColor: themeColors.secondary 
                }
              }}
            >
              Nutrition Goals
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              onClick={handleAddMeal}
              sx={{
                backgroundColor: themeColors.accent,
                '&:hover': { backgroundColor: themeColors.primary }
              }}
            >
              Add Meal
            </Button>
          </Box>
        </Box>

        {/* Date Navigation */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          mb: 3, 
          gap: 2,
          p: 2,
          borderRadius: 2,
          backgroundColor: themeColors.lightBg
        }}>
          <Button 
            variant="outlined" 
            onClick={handlePrevDay}
            sx={{
              color: themeColors.primary,
              borderColor: themeColors.primary,
              '&:hover': { 
                backgroundColor: themeColors.lightBg,
                borderColor: themeColors.secondary 
              }
            }}
          >
            Previous
          </Button>
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => (
              <TextField 
                {...params} 
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: themeColors.primary,
                    },
                    '&:hover fieldset': {
                      borderColor: themeColors.secondary,
                    },
                  }
                }}
              />
            )}
          />
          <Button 
            variant="outlined" 
            onClick={handleNextDay} 
            disabled={isToday(selectedDate)}
            sx={{
              color: themeColors.primary,
              borderColor: themeColors.primary,
              '&:hover': { 
                backgroundColor: themeColors.lightBg,
                borderColor: themeColors.secondary 
              },
              '&:disabled': {
                color: '#ccc',
                borderColor: '#ccc'
              }
            }}
          >
            Next
          </Button>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress sx={{ color: themeColors.primary }} />
          </Box>
        )}

        {/* Meals List */}
        {!loading && meals.length === 0 ? (
          <Paper sx={{ 
            p: 3, 
            textAlign: 'center',
            borderRadius: 2,
            backgroundColor: themeColors.lightBg
          }}>
            <Typography variant="h6" sx={{ mb: 2, color: themeColors.text }}>
              No meals logged for this day
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ 
                mt: 2,
                backgroundColor: themeColors.accent,
                '&:hover': { backgroundColor: themeColors.primary }
              }} 
              onClick={handleAddMeal}
            >
              Add Your First Meal
            </Button>
          </Paper>
        ) : (
          <TableContainer 
            component={Paper} 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: themeColors.lightBg }}>
                  <TableCell sx={{ fontWeight: 'bold', color: themeColors.text }}>Meal Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: themeColors.text }}>Food</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', color: themeColors.text }}>Servings</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', color: themeColors.text }}>Calories</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', color: themeColors.text }}>Carbs (g)</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', color: themeColors.text }}>Protein (g)</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', color: themeColors.text }}>Fat (g)</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', color: themeColors.text }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {meals.map((meal) => (
                  <TableRow 
                    key={meal.id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Chip
                        label={getMealTypeName(meal.meal_type)}
                        sx={{
                          backgroundColor: getMealTypeColor(meal.meal_type),
                          color: '#fff',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <RestaurantIcon sx={{ color: themeColors.primary, mr: 1 }} />
                        <Typography>{meal.food_name || meal.custom_name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">{meal.servings}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>{meal.calories || '-'}</TableCell>
                    <TableCell align="right">{meal.carbs || '-'}</TableCell>
                    <TableCell align="right">{meal.protein || '-'}</TableCell>
                    <TableCell align="right">{meal.fat || '-'}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton 
                          onClick={() => handleEditMeal(meal)}
                          sx={{ color: themeColors.primary }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          onClick={() => handleDeleteMeal(meal.id)}
                          sx={{ color: themeColors.error }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Quick Stats */}
        {dailyReport && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Card sx={{ 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ 
                      backgroundColor: themeColors.lightBg, 
                      color: themeColors.primary,
                      mr: 2
                    }}>
                      <RestaurantIcon />
                    </Avatar>
                    <Typography variant="h6" color="textSecondary">
                      Calories
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {dailyReport.totals.total_calories || 0}
                    <Typography component="span" variant="body2" color="textSecondary">
                      /{userGoals.daily_calories || '-'}
                    </Typography>
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={getProgress(dailyReport.totals.total_calories, userGoals.daily_calories)}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getProgressColor(getProgress(
                            dailyReport.totals.total_calories,
                            userGoals.daily_calories
                          ))
                        }
                      }}
                    />
                    <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                      {getProgress(dailyReport.totals.total_calories, userGoals.daily_calories)}% of daily goal
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ 
                      backgroundColor: themeColors.lightBg, 
                      color: themeColors.error,
                      mr: 2
                    }}>
                      <FitnessCenterIcon />
                    </Avatar>
                    <Typography variant="h6" color="textSecondary">
                      Protein
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {dailyReport.totals.total_protein || 0}g
                    <Typography component="span" variant="body2" color="textSecondary">
                      /{userGoals.daily_protein || '-'}g
                    </Typography>
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={getProgress(dailyReport.totals.total_protein, userGoals.daily_protein)}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: themeColors.error
                        }
                      }}
                    />
                    <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                      {getProgress(dailyReport.totals.total_protein, userGoals.daily_protein)}% of daily goal
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ 
                      backgroundColor: themeColors.lightBg, 
                      color: themeColors.info,
                      mr: 2
                    }}>
                      <FitnessCenterIcon />
                    </Avatar>
                    <Typography variant="h6" color="textSecondary">
                      Carbs
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {dailyReport.totals.total_carbs || 0}g
                    <Typography component="span" variant="body2" color="textSecondary">
                      /{userGoals.daily_carbs || '-'}g
                    </Typography>
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={getProgress(dailyReport.totals.total_carbs, userGoals.daily_carbs)}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: themeColors.info
                        }
                      }}
                    />
                    <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                      {getProgress(dailyReport.totals.total_carbs, userGoals.daily_carbs)}% of daily goal
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ 
                      backgroundColor: themeColors.lightBg, 
                      color: themeColors.warning,
                      mr: 2
                    }}>
                      <FitnessCenterIcon />
                    </Avatar>
                    <Typography variant="h6" color="textSecondary">
                      Fat
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {dailyReport.totals.total_fat || 0}g
                    <Typography component="span" variant="body2" color="textSecondary">
                      /{userGoals.daily_fat || '-'}g
                    </Typography>
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={getProgress(dailyReport.totals.total_fat, userGoals.daily_fat)}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: themeColors.warning
                        }
                      }}
                    />
                    <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                      {getProgress(dailyReport.totals.total_fat, userGoals.daily_fat)}% of daily goal
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Add/Edit Meal Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)} 
          fullWidth 
          maxWidth="sm"
          PaperProps={{ sx: { borderRadius: 2 } }}
          disableEnforceFocus={false}
          disableAutoFocus={false}
        >
          <DialogTitle sx={{ 
            backgroundColor: themeColors.lightBg,
            color: themeColors.text,
            borderBottom: `1px solid ${themeColors.primary}`
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MealTypeIcon sx={{ mr: 1, color: themeColors.primary }} />
              {currentMeal ? 'Edit Meal Entry' : 'Add New Meal'}
            </Box>
            <IconButton
              aria-label="close"
              onClick={() => setOpenDialog(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: themeColors.text
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ backgroundColor: '#fff' }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ color: themeColors.text }}>
                Meal Type
              </Typography>
              <Select
                fullWidth
                value={mealForm.meal_type}
                onChange={(e) => setMealForm({ ...mealForm, meal_type: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: themeColors.primary,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: themeColors.secondary,
                  },
                }}
              >
                <MenuItem value="breakfast">Breakfast</MenuItem>
                <MenuItem value="lunch">Lunch</MenuItem>
                <MenuItem value="dinner">Dinner</MenuItem>
                <MenuItem value="snack">Snack</MenuItem>
              </Select>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ color: themeColors.text }}>
                Search Food Database
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search for food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: themeColors.primary }} />
                    </InputAdornment>
                  ),
                  sx: {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: themeColors.primary,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: themeColors.secondary,
                    },
                  }
                }}
              />
            </Box>

            {searchQuery.length > 2 && foodItems.length > 0 && (
              <Box sx={{ mb: 3, maxHeight: 200, overflow: 'auto' }}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: themeColors.text }}>
                  Select from database:
                </Typography>
                <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: themeColors.lightBg }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Food</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Serving</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Calories</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Protein</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {foodItems.map((food) => (
                        <TableRow
                          key={food.id}
                          hover
                          onClick={() => handleFoodSelect(food)}
                          sx={{
                            cursor: 'pointer',
                            backgroundColor:
                              mealForm.food_id === food.id ? themeColors.lightBg : 'inherit'
                          }}
                        >
                          <TableCell>{food.name}</TableCell>
                          <TableCell align="right">{food.serving_size}</TableCell>
                          <TableCell align="right">{food.calories}</TableCell>
                          <TableCell align="right">{food.protein}g</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ color: themeColors.text }}>
                Or enter custom food
              </Typography>
              <TextField
                fullWidth
                label="Food Name"
                value={mealForm.custom_name}
                onChange={(e) =>
                  setMealForm({ ...mealForm, custom_name: e.target.value, food_id: '' })
                }
                sx={{ mb: 2 }}
                InputProps={{
                  sx: {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: themeColors.primary,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: themeColors.secondary,
                    },
                  }
                }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Servings"
                type="number"
                inputProps={{ min: 0.1, step: 0.1 }}
                value={mealForm.servings}
                onChange={(e) =>
                  setMealForm({ ...mealForm, servings: parseFloat(e.target.value) || 1 })
                }
                InputProps={{
                  sx: {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: themeColors.primary,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: themeColors.secondary,
                    },
                  }
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ backgroundColor: themeColors.lightBg }}>
            <Button 
              onClick={() => setOpenDialog(false)}
              sx={{ color: themeColors.text }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSaveMeal}
              sx={{
                backgroundColor: themeColors.primary,
                '&:hover': { backgroundColor: themeColors.secondary }
              }}
            >
              {currentMeal ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Nutrition Goals Dialog */}
        <Dialog 
          open={openGoalsDialog} 
          onClose={() => setOpenGoalsDialog(false)} 
          fullWidth 
          maxWidth="sm"
          PaperProps={{ sx: { borderRadius: 2 } }}
          disableEnforceFocus={false}
          disableAutoFocus={false}
        >
          <DialogTitle sx={{ 
            backgroundColor: themeColors.lightBg,
            color: themeColors.text,
            borderBottom: `1px solid ${themeColors.primary}`
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <GoalsIcon sx={{ mr: 1, color: themeColors.primary }} />
              Nutrition Goals
            </Box>
            <IconButton
              aria-label="close"
              onClick={() => setOpenGoalsDialog(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: themeColors.text
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ backgroundColor: '#fff' }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ color: themeColors.text }}>
                Daily Caloric Target
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={userGoals.daily_calories || ''}
                onChange={(e) =>
                  setUserGoals({ ...userGoals, daily_calories: parseInt(e.target.value) || 0 })
                }
                InputProps={{
                  sx: {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: themeColors.primary,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: themeColors.secondary,
                    },
                  }
                }}
              />
            </Box>

            <Typography variant="h6" gutterBottom sx={{ color: themeColors.text }}>
              Macronutrients
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Protein (g)"
                  type="number"
                  value={userGoals.daily_protein || ''}
                  onChange={(e) =>
                    setUserGoals({ ...userGoals, daily_protein: parseInt(e.target.value) || 0 })
                  }
                  InputProps={{
                    sx: {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: themeColors.primary,
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: themeColors.secondary,
                      },
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Carbohydrates (g)"
                  type="number"
                  value={userGoals.daily_carbs || ''}
                  onChange={(e) =>
                    setUserGoals({ ...userGoals, daily_carbs: parseInt(e.target.value) || 0 })
                  }
                  InputProps={{
                    sx: {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: themeColors.primary,
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: themeColors.secondary,
                      },
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fat (g)"
                  type="number"
                  value={userGoals.daily_fat || ''}
                  onChange={(e) =>
                    setUserGoals({ ...userGoals, daily_fat: parseInt(e.target.value) || 0 })
                  }
                  InputProps={{
                    sx: {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: themeColors.primary,
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: themeColors.secondary,
                      },
                    }
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ backgroundColor: themeColors.lightBg }}>
            <Button 
              onClick={() => setOpenGoalsDialog(false)}
              sx={{ color: themeColors.text }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSaveGoals}
              sx={{
                backgroundColor: themeColors.primary,
                '&:hover': { backgroundColor: themeColors.secondary }
              }}
            >
              Save Goals
            </Button>
          </DialogActions>
        </Dialog>

        {/* Nutrition Report Dialog */}
        <Dialog
          open={openReportDialog}
          onClose={() => setOpenReportDialog(false)}
          fullWidth
          maxWidth="md"
          PaperProps={{ sx: { borderRadius: 2 } }}
          disableEnforceFocus={false}
          disableAutoFocus={false}
        >
          <DialogTitle sx={{ 
            backgroundColor: themeColors.lightBg,
            color: themeColors.text,
            borderBottom: `1px solid ${themeColors.primary}`
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BarChartIcon sx={{ mr: 1, color: themeColors.primary }} />
              Nutrition Report for {format(selectedDate, 'MMMM d, yyyy')}
            </Box>
            <IconButton
              aria-label="close"
              onClick={() => setOpenReportDialog(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: themeColors.text
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ backgroundColor: '#fff' }}>
            {dailyReport && (
              <Box>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom sx={{ color: themeColors.text }}>
                      Macronutrient Distribution
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      {getMacroChartData() && (
                        <Doughnut
                          data={getMacroChartData()}
                          options={{
                            maintainAspectRatio: false,
                            plugins: {
                              tooltip: {
                                callbacks: {
                                  label: function (context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = Math.round((value / total) * 100);
                                    return `${label}: ${value}g (${percentage}%)`;
                                  }
                                }
                              },
                              legend: {
                                labels: {
                                  color: themeColors.text
                                }
                              }
                            }
                          }}
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom sx={{ color: themeColors.text }}>
                      Calories by Meal
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      {getCalorieChartData() && (
                        <Bar
                          data={getCalorieChartData()}
                          options={{
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: true,
                                title: {
                                  display: true,
                                  text: 'Calories',
                                  color: themeColors.text
                                },
                                ticks: {
                                  color: themeColors.text
                                },
                                grid: {
                                  color: 'rgba(0,0,0,0.1)'
                                }
                              },
                              x: {
                                ticks: {
                                  color: themeColors.text
                                },
                                grid: {
                                  color: 'rgba(0,0,0,0.1)'
                                }
                              }
                            },
                            plugins: {
                              legend: {
                                labels: {
                                  color: themeColors.text
                                }
                              }
                            }
                          }}
                        />
                      )}
                    </Box>
                  </Grid>
                </Grid>

                <Typography variant="h6" gutterBottom sx={{ color: themeColors.text }}>
                  Meal Breakdown
                </Typography>
                <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: themeColors.lightBg }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Meal Type</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Calories</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Carbs (g)</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Protein (g)</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Fat (g)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dailyReport.breakdown.map((meal) => (
                        <TableRow key={meal.meal_type}>
                          <TableCell>
                            <Chip
                              label={getMealTypeName(meal.meal_type)}
                              sx={{
                                backgroundColor: getMealTypeColor(meal.meal_type),
                                color: '#fff',
                                fontWeight: 'bold'
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">{meal.calories || 0}</TableCell>
                          <TableCell align="right">{meal.carbs || 0}</TableCell>
                          <TableCell align="right">{meal.protein || 0}</TableCell>
                          <TableCell align="right">{meal.fat || 0}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        backgroundColor: themeColors.lightBg
                      }}>
                        <TableCell component="th" scope="row">
                          <strong>Total</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>{dailyReport.totals.total_calories || 0}</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>{dailyReport.totals.total_carbs || 0}</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>{dailyReport.totals.total_protein || 0}</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>{dailyReport.totals.total_fat || 0}</strong>
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        backgroundColor: themeColors.lightBg
                      }}>
                        <TableCell component="th" scope="row">
                          <strong>Daily Goal</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>{userGoals.daily_calories || '-'}</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>{userGoals.daily_carbs || '-'}</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>{userGoals.daily_protein || '-'}</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>{userGoals.daily_fat || '-'}</strong>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ backgroundColor: themeColors.lightBg }}>
            <Button 
              onClick={() => setOpenReportDialog(false)}
              sx={{ color: themeColors.text }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default MealTracker;