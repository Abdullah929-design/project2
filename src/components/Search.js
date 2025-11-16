import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography, TextField, Button, CircularProgress, Pagination, PaginationItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const Search = () => {
  // ExerciseDB API configuration
  const API_BASE_URL = "https://exercisedb.p.rapidapi.com";
  const API_HOST = "exercisedb.p.rapidapi.com";
  const API_KEY = "4f1bf5105dmshc01806e19a87df9p12271bjsn6d88532c6a2d";
  
  // YouTube API configuration
  const YOUTUBE_API_KEY = "AIzaSyAwSxuo0maJvPrZlthYSZNatqRkBzm-8ds";

  const [search, setSearch] = useState('');
  const [exercises, setExercises] = useState([]);
  const [bodyParts, setBodyParts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoLoading, setVideoLoading] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [activeBodyPart, setActiveBodyPart] = useState('all');
  const exercisesPerPage = 9; // Increased from 10 to 9 for better layout

  // Custom styled components
  const GradientButton = styled(Button)({
    background: 'linear-gradient(45deg, #FF2625 0%, #FF8A00 90%)',
    border: 0,
    borderRadius: 8,
    color: 'white',
    height: 56,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    '&:hover': {
      background: 'linear-gradient(45deg, #CC1F1A 0%, #E67C00 90%)',
    },
  });

  const BodyPartButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== 'active',
  })(({ theme, active }) => ({
    minWidth: 150,
    height: 60,
    borderRadius: 8,
    textTransform: 'capitalize',
    fontWeight: 600,
    background: active 
      ? 'linear-gradient(45deg, #CC1F1A 0%, #E67C00 90%)'
      : 'linear-gradient(45deg, #FF2625 0%, #FF8A00 90%)',
    color: 'white',
    boxShadow: active 
      ? '0 4px 8px rgba(255, 105, 135, .4)'
      : '0 2px 4px rgba(255, 105, 135, .3)',
    transform: active ? 'scale(1.05)' : 'scale(1)',
    '&:hover': {
      background: 'linear-gradient(45deg, #CC1F1A 0%, #E67C00 90%)',
      boxShadow: '0 4px 8px rgba(255, 105, 135, .4)',
      transform: 'scale(1.05)',
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: 120,
      height: 50,
      fontSize: '0.8rem',
    },
  }));

  const ExerciseCard = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    border: '1px solid rgba(255, 38, 37, 0.2)',
    borderRadius: 12,
    background: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 4px 20px rgba(255, 105, 135, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 25px rgba(255, 105, 135, 0.2)',
    },
  }));

  const CustomPagination = styled(Pagination)(({ theme }) => ({
    '& .MuiPaginationItem-root': {
      color: '#FF2625',
      fontWeight: 600,
      fontSize: '1rem',
      margin: '0 4px',
      minWidth: '40px',
      height: '40px',
      borderRadius: '8px',
      border: '1px solid rgba(255, 38, 37, 0.2)',
      background: 'rgba(255, 255, 255, 0.8)',
      '&:hover': {
        backgroundColor: 'rgba(255, 38, 37, 0.1)',
        borderColor: '#FF2625',
        transform: 'translateY(-2px)',
      },
    },
    '& .MuiPaginationItem-page.Mui-selected': {
      backgroundColor: '#FF2625',
      color: 'white',
      borderColor: '#FF2625',
      '&:hover': {
        backgroundColor: '#CC1F1A',
        borderColor: '#CC1F1A',
      },
    },
    '& .MuiPaginationItem-previousNext': {
      backgroundColor: 'rgba(255, 138, 0, 0.1)',
      '&:hover': {
        backgroundColor: 'rgba(255, 138, 0, 0.2)',
      },
    },
  }));

  useEffect(() => {
    const fetchBodyParts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/exercises/bodyPartList`, {
          method: "GET",
          headers: {
            "x-rapidapi-host": API_HOST,
            "x-rapidapi-key": API_KEY,
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setBodyParts(['all', ...data]);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBodyParts();
  }, []);

  const fetchYouTubeVideo = async (exerciseName) => {
    try {
      const query = `${exerciseName} exercise tutorial how to`;
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&type=video&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}&order=relevance&videoDuration=medium`
      );
      
      if (!response.ok) {
        console.error(`YouTube API error! Status: ${response.status}`);
        return null;
      }
      
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        console.log(`No YouTube videos found for: ${exerciseName}`);
        return null;
      }
      
      const videoId = data.items[0]?.id?.videoId;
      console.log(`Found video for ${exerciseName}: ${videoId}`);
      return videoId || null;
    } catch (err) {
      console.error("Failed to fetch YouTube video:", err);
      return null;
    }
  };

  // Enhanced function to fetch exercises with multiple endpoints
  const fetchExercises = async (searchTerm, bodyPart) => {
    try {
      setIsLoading(true);
      setError(null);
      setExercises([]);
      setCurrentPage(1);
      
      let exercises = [];
      
      // If searching by body part
      if (bodyPart && bodyPart !== 'all') {
        const response = await fetch(`${API_BASE_URL}/exercises/bodyPart/${bodyPart}`, {
          method: "GET",
          headers: {
            "x-rapidapi-host": API_HOST,
            "x-rapidapi-key": API_KEY,
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        exercises = data || [];
         console.log(`✅ Fetched ${exercises.length} exercises for body part: ${bodyPart}`);
        
        
        // If there's also a search term, filter the results
        if (searchTerm && searchTerm.trim()) {
          exercises = exercises.filter(exercise =>
            exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exercise.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exercise.equipment.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
      }
      // If searching by name only
      else if (searchTerm && searchTerm.trim()) {
        // Try searching by name first
        const nameResponse = await fetch(`${API_BASE_URL}/exercises/name/${searchTerm}`, {
          method: "GET",
          headers: {
            "x-rapidapi-host": API_HOST,
            "x-rapidapi-key": API_KEY,
          },
        });
        
        if (nameResponse.ok) {
          const nameData = await nameResponse.json();
          exercises = [...exercises, ...(nameData || [])];
        }
        
        // Also try searching by target muscle
        const targetResponse = await fetch(`${API_BASE_URL}/exercises/target/${searchTerm}`, {
          method: "GET",
          headers: {
            "x-rapidapi-host": API_HOST,
            "x-rapidapi-key": API_KEY,
          },
        });
        
        if (targetResponse.ok) {
          const targetData = await targetResponse.json();
          exercises = [...exercises, ...(targetData || [])];
        }
        
        // Also try searching by equipment
        const equipmentResponse = await fetch(`${API_BASE_URL}/exercises/equipment/${searchTerm}`, {
          method: "GET",
          headers: {
            "x-rapidapi-host": API_HOST,
            "x-rapidapi-key": API_KEY,
          },
        });
        
        if (equipmentResponse.ok) {
          const equipmentData = await equipmentResponse.json();
          exercises = [...exercises, ...(equipmentData || [])];
        }
        
        // Remove duplicates based on exercise ID
        const uniqueExercises = exercises.filter((exercise, index, self) =>
          index === self.findIndex(e => e.id === exercise.id)
        );
        exercises = uniqueExercises;
      }
      // If no search term and 'all' is selected, fetch a general list
      else {
        const response = await fetch(`${API_BASE_URL}/exercises?limit=100&offset=0`, {
          method: "GET",
          headers: {
            "x-rapidapi-host": API_HOST,
            "x-rapidapi-key": API_KEY,
          },
        });
        
        if (!response.ok) {
          // Fallback to bodyPart back if the limit/offset doesn't work
          const fallbackResponse = await fetch(`${API_BASE_URL}/exercises/bodyPart/back`, {
            method: "GET",
            headers: {
              "x-rapidapi-host": API_HOST,
              "x-rapidapi-key": API_KEY,
            },
          });
          
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            exercises = fallbackData.slice(0, 50) || []; // Limit to 50 for performance
          }
        } else {
          const data = await response.json();
          exercises = data || [];
        }
      }
      
      if (!exercises || exercises.length === 0) {
        setError("No exercises found for your search criteria.");
        return;
      }
      
      setExercises(exercises);
      
      // Enhance with YouTube videos in the background
      exercises.slice(0, 20).forEach(async (exercise) => { // Limit video fetching to first 20 for performance
        setVideoLoading(prev => ({ ...prev, [exercise.id]: true }));
        try {
          const videoId = await fetchYouTubeVideo(exercise.name);
          setExercises(prev => 
            prev.map(ex => ex.id === exercise.id ? { ...ex, videoId } : ex)
          );
        } catch (videoError) {
          console.error(`Error fetching video for ${exercise.name}:`, videoError);
        }
        setVideoLoading(prev => ({ ...prev, [exercise.id]: false }));
      });
      
    } catch (err) {
      setError("Failed to fetch exercises. Please try again later.");
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    await fetchExercises(search, activeBodyPart);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleBodyPartClick = async (bodyPart) => {
    setActiveBodyPart(bodyPart);
    await fetchExercises(search, bodyPart);
  };

  // New function to handle card clicks
  const handleCardClick = (exerciseName) => {
    setSearch(exerciseName.toLowerCase());
    setTimeout(() => {
      fetchExercises(exerciseName.toLowerCase(), activeBodyPart);
    }, 100);
  };

  // Pagination logic
  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = exercises.slice(indexOfFirstExercise, indexOfLastExercise);
  const totalPages = Math.ceil(exercises.length / exercisesPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Stack 
      alignItems="center" 
      justifyContent="center" 
      mt="45px" 
      p="20px"
      spacing={4}
      sx={{ 
        width: '100%',
        background: 'linear-gradient(to bottom, #FFF8F8, #FFF0F0)',
        minHeight: '100vh'
      }}
    >
      <Typography 
        fontWeight={900} 
        sx={{ 
          fontSize: { lg: '48px', xs: '36px' }, 
          textAlign: 'center',
          background: 'linear-gradient(45deg, #FF2625 30%, #FF8A00 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '2px 2px 4px rgba(255, 105, 135, 0.2)'
        }}
      >
        POWERFUL EXERCISES <br/> FOR YOUR WORKOUT
      </Typography>
      
      <Box sx={{ 
        width: '100%', 
        maxWidth: '800px', 
        display: 'flex', 
        gap: 2,
        position: 'relative'
      }}>
        <TextField 
          fullWidth
          sx={{ 
            '& .MuiOutlinedInput-root': {
              height: '56px',
              '& fieldset': {
                borderColor: '#FF2625',
                borderWidth: '2px',
                borderRadius: '8px'
              },
              '&:hover fieldset': {
                borderColor: '#FF8A00'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#FF8A00',
                boxShadow: '0 0 0 2px rgba(255, 138, 0, 0.2)'
              }
            }
          }} 
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase())} 
          onKeyPress={handleKeyPress}
          type="text" 
          placeholder="Search Exercises, Muscles, or Equipment..." 
        />
        <GradientButton 
          onClick={handleSearch} 
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'SEARCH'}
        </GradientButton>
      </Box>

      {error && (
        <Box sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: 'rgba(255, 38, 37, 0.1)',
          borderLeft: '4px solid #FF2625'
        }}>
          <Typography color="#FF2625" sx={{ textAlign: 'center', fontWeight: 600 }}>
            {error}
          </Typography>
        </Box>
      )}

      <Box sx={{ width: '100%' }}>
        <Typography variant="h5" gutterBottom sx={{ 
          fontWeight: 600,
          mb: 2,
          color: '#FF2625'
        }}>
          Filter by Body Part
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          overflowX: 'auto', 
          py: 2,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' }
        }}>
          {bodyParts.map((part) => (
            <BodyPartButton 
              key={part} 
              active={activeBodyPart === part}
              onClick={() => handleBodyPartClick(part)}
            >
              {part}
            </BodyPartButton>
          ))}
        </Box>
      </Box>

      <Box sx={{ width: '100%', maxWidth: '1200px' }}>
        <Typography variant="h5" gutterBottom sx={{ 
          fontWeight: 800,
          mb: 3,
          color: '#FF2625',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          {exercises.length > 0 ? `${exercises.length} EXERCISES FOUND` : 'FIND YOUR EXERCISES'}
        </Typography>
        
        {isLoading && exercises.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            py: 8,
            flexDirection: 'column',
            gap: 3
          }}>
            <CircularProgress size={80} thickness={4} sx={{ color: '#FF8A00' }} />
            <Typography variant="h6" color="#FF2625" fontWeight={600}>
              Loading exercises...
            </Typography>
          </Box>
        ) : (
          <>
            <Stack spacing={4}>
              {currentExercises.map((exercise) => (
                <ExerciseCard 
                  key={exercise.id}
                  onClick={() => handleCardClick(exercise.name)}
                >
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    sx={{ 
                      textTransform: 'capitalize',
                      color: '#FF2625',
                      fontWeight: 800,
                      fontSize: '1.8rem',
                      mb: 3
                    }}
                  >
                    {exercise.name}
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' }, 
                    gap: 4,
                    alignItems: 'flex-start'
                  }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap',
                        gap: 2,
                        mb: 3
                      }}>
                        <Box sx={{
                          backgroundColor: 'rgba(255, 38, 37, 0.1)',
                          borderRadius: 2,
                          p: 1.5,
                          flex: '1 1 200px'
                        }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            BODY PART
                          </Typography>
                          <Typography fontWeight={700} color="#FF2625" sx={{ textTransform: 'capitalize' }}>
                            {exercise.bodyPart}
                          </Typography>
                        </Box>
                        
                        <Box sx={{
                          backgroundColor: 'rgba(255, 138, 0, 0.1)',
                          borderRadius: 2,
                          p: 1.5,
                          flex: '1 1 200px'
                        }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            EQUIPMENT
                          </Typography>
                          <Typography fontWeight={700} color="#FF8A00" sx={{ textTransform: 'capitalize' }}>
                            {exercise.equipment}
                          </Typography>
                        </Box>
                        
                        <Box sx={{
                          backgroundColor: 'rgba(255, 38, 37, 0.1)',
                          borderRadius: 2,
                          p: 1.5,
                          flex: '1 1 200px'
                        }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            TARGET
                          </Typography>
                          <Typography fontWeight={700} color="#FF2625" sx={{ textTransform: 'capitalize' }}>
                            {exercise.target}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            SECONDARY MUSCLES
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {exercise.secondaryMuscles.map((muscle, index) => (
                              <Box key={index} sx={{
                                backgroundColor: 'rgba(255, 138, 0, 0.2)',
                                borderRadius: 4,
                                px: 2,
                                py: 0.5
                              }}>
                                <Typography variant="body2" fontWeight={600} color="#E67C00" sx={{ textTransform: 'capitalize' }}>
                                  {muscle}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      )}
                      
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          INSTRUCTIONS
                        </Typography>
                        <Box component="ol" sx={{ 
                          pl: 2,
                          '& li': { mb: 1 }
                        }}>
                          {exercise.instructions && exercise.instructions.length > 0 ? (
                            exercise.instructions.slice(0, 5).map((instruction, index) => (
                              <li key={index}>
                                <Typography variant="body1">
                                  {instruction}
                                </Typography>
                              </li>
                            ))
                          ) : (
                            <Typography color="text.secondary">
                              No instructions available
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                    
                    <Box sx={{ 
                      flex: 1, 
                      width: '100%',
                      minHeight: '300px',
                      borderRadius: 2,
                      overflow: 'hidden',
                      position: 'relative',
                      backgroundColor: '#f5f5f5',
                      border: '1px solid rgba(255, 38, 37, 0.2)'
                    }}>
                      {videoLoading[exercise.id] ? (
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center',
                          height: '100%',
                          flexDirection: 'column',
                          gap: 2,
                          background: 'linear-gradient(45deg, rgba(255,38,37,0.05) 0%, rgba(255,138,0,0.05) 100%)'
                        }}>
                          <CircularProgress size={60} sx={{ color: '#FF8A00' }} />
                          <Typography variant="body2" color="#FF2625" fontWeight={600}>
                            Loading video tutorial...
                          </Typography>
                        </Box>
                      ) : exercise.videoId ? (
                        <Box sx={{ 
                          position: 'relative', 
                          width: '100%', 
                          height: '100%',
                          minHeight: '300px'
                        }}>
                          <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${exercise.videoId}?modestbranding=1&rel=0&showinfo=0&fs=1&autoplay=0`}
                            title={`${exercise.name} tutorial`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{
                              borderRadius: '8px',
                              minHeight: '300px'
                            }}
                          />
                          
                          <Box sx={{ 
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            zIndex: 1
                          }}>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`https://www.youtube.com/watch?v=${exercise.videoId}`, '_blank');
                              }}
                              sx={{
                                background: 'linear-gradient(45deg, #FF2625 0%, #FF8A00 90%)',
                                color: 'white',
                                minWidth: 'auto',
                                px: 1.5,
                                py: 0.5,
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                '&:hover': {
                                  background: 'linear-gradient(45deg, #CC1F1A 0%, #E67C00 90%)'
                                }
                              }}
                            >
                              Watch on YouTube
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center',
                          height: '100%',
                          p: 4,
                          textAlign: 'center',
                          flexDirection: 'column',
                          gap: 2,
                          background: 'linear-gradient(45deg, rgba(255,38,37,0.05) 0%, rgba(255,138,0,0.05) 100%)'
                        }}>
                          <Typography color="#FF2625" variant="h6" fontWeight={700}>
                            Video Tutorial Not Available
                          </Typography>
                          <Typography color="text.secondary" variant="body1">
                            We couldn't find a video for this exercise. Try searching YouTube for "{exercise.name} exercise".
                          </Typography>
                          <Button
                            variant="outlined"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name + ' exercise')}`, '_blank');
                            }}
                            sx={{
                              borderColor: '#FF2625',
                              color: '#FF2625',
                              fontWeight: 600,
                              '&:hover': {
                                backgroundColor: 'rgba(255, 38, 37, 0.1)',
                                borderColor: '#FF8A00'
                              }
                            }}
                          >
                            Search YouTube
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </ExerciseCard>
              ))}
            </Stack>
            
            {exercises.length > exercisesPerPage && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                mt: 6,
                py: 4,
                flexDirection: 'column',
                gap: 3
              }}>
                <Typography variant="body1" color="#FF2625" fontWeight={600}>
                  Showing {indexOfFirstExercise + 1} - {Math.min(indexOfLastExercise, exercises.length)} of {exercises.length} exercises
                </Typography>
                <CustomPagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  size="large"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                  siblingCount={2}
                  boundaryCount={1}
                  renderItem={(item) => (
                    <PaginationItem
                      slots={{ 
                        previous: ChevronLeft, 
                        next: ChevronRight,
                        first: () => <Typography>First</Typography>,
                        last: () => <Typography>Last</Typography>
                      }}
                      {...item}
                    />
                  )}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Stack>
  );
};

export default Search;