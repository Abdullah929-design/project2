import { useState } from "react";

function Bmi() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [message, setMessage] = useState('');
  const [nutritionData, setNutritionData] = useState(null);

  const generateNutritionRecommendations = (bmiValue, weightKg, heightInches) => {
    const heightCm = heightInches * 2.54;
    
    // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
    // Assuming average age of 30 and moderate activity level
    const bmr = 10 * weightKg + 6.25 * heightCm - 5 * 30 + 5; // for males
    const dailyCalories = Math.round(bmr * 1.55); // moderate activity multiplier
    
    // Calculate macronutrient recommendations
    let proteinGrams, carbsGrams, fatsGrams;
    
    if (bmiValue < 18.5) {
      // Underweight - higher calories for weight gain
      const targetCalories = dailyCalories + 500;
      proteinGrams = Math.round(weightKg * 1.6);
      carbsGrams = Math.round((targetCalories * 0.5) / 4);
      fatsGrams = Math.round((targetCalories * 0.3) / 9);
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      // Normal - maintenance calories
      proteinGrams = Math.round(weightKg * 1.2);
      carbsGrams = Math.round((dailyCalories * 0.5) / 4);
      fatsGrams = Math.round((dailyCalories * 0.3) / 9);
    } else {
      // Overweight/Obese - deficit for weight loss
      const targetCalories = dailyCalories - 500;
      proteinGrams = Math.round(weightKg * 1.4);
      carbsGrams = Math.round((targetCalories * 0.4) / 4);
      fatsGrams = Math.round((targetCalories * 0.3) / 9);
    }

    setNutritionData({
      dailyCalories,
      macronutrients: {
        protein: proteinGrams,
        carbs: carbsGrams,
        fats: fatsGrams
      }
    });
  };

  const calcBmi = () => {
    // Reset previous results
    setNutritionData(null);
    
    // Check if weight and height are valid numbers
    if (isNaN(weight) || isNaN(height) || weight === '' || height === '') {
      setMessage("Please enter a valid weight and height");
      setBmi('');
      return;
    }

    // Check if weight and height are positive
    if (weight <= 0 || height <= 0) {
      setMessage("Please enter a positive weight and height");
      setBmi('');
      return;
    }

    const heightInMeters = height * 0.0254;
    const bmiValue = weight / (heightInMeters * heightInMeters);
    setBmi(bmiValue.toFixed(1));

    if (bmiValue < 18.5) {
      setMessage('You are Underweight');
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      setMessage('You are Normal')
    } else if (bmiValue >= 25 && bmiValue < 30) {
      setMessage('You are Overweight')
    } else {
      setMessage('You are Obese')
    }

    // Generate nutrition recommendations based on BMI
    generateNutritionRecommendations(bmiValue, parseFloat(weight), parseFloat(height));
  }

  const reload = () => {
    setWeight('');
    setHeight('');
    setBmi('');
    setMessage('');
    setNutritionData(null);
  }

  const getBmiColor = () => {
    if (!bmi) return 'text-gray-400';
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return 'text-blue-400';
    if (bmiValue < 25) return 'text-green-400';
    if (bmiValue < 30) return 'text-yellow-400';
    return 'text-red-400';
  }

  const getNutritionRecommendation = () => {
    if (!nutritionData) return null;
    
    const bmiValue = parseFloat(bmi);
    let recommendation = '';
    
    if (bmiValue < 18.5) {
      recommendation = {
        title: 'Weight Gain Recommendation',
        details: 'Focus on calorie-dense foods and increase protein intake to build healthy muscle mass. Include nuts, avocados, whole grains, and lean proteins.',
        tips: ['Eat 5-6 small meals per day', 'Add healthy fats to meals', 'Include protein shakes', 'Focus on strength training']
      };
    } else if (bmiValue < 25) {
      recommendation = {
        title: 'Maintenance Recommendation',
        details: 'Maintain your current healthy diet with balanced macronutrients. Continue with a variety of fruits, vegetables, lean proteins, and whole grains.',
        tips: ['Eat a balanced diet', 'Stay hydrated', 'Regular exercise', 'Get adequate sleep']
      };
    } else {
      recommendation = {
        title: 'Weight Loss Recommendation',
        details: 'Focus on nutrient-dense, lower calorie foods and create a moderate calorie deficit. Emphasize vegetables, lean proteins, and complex carbohydrates.',
        tips: ['Reduce portion sizes', 'Increase vegetable intake', 'Choose lean proteins', 'Stay active daily']
      };
    }

    return (
      <div style={{ marginTop: '16px' }}>
        <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '8px' }}>{recommendation.title}</h4>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', marginBottom: '12px' }}>{recommendation.details}</p>
        
        {/* Daily Calories */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '8px' }}>Daily Calorie Target</h4>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '12px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>{nutritionData.dailyCalories} calories</p>
          </div>
        </div>

        {/* Macronutrients */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '8px' }}>Daily Macronutrients</h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '12px',
            borderRadius: '8px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>Protein</p>
              <p style={{ color: 'white', fontWeight: '600', fontSize: '18px' }}>{nutritionData.macronutrients.protein}g</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>Carbs</p>
              <p style={{ color: 'white', fontWeight: '600', fontSize: '18px' }}>{nutritionData.macronutrients.carbs}g</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>Fats</p>
              <p style={{ color: 'white', fontWeight: '600', fontSize: '18px' }}>{nutritionData.macronutrients.fats}g</p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div>
          <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '8px' }}>Key Tips</h4>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '12px',
            borderRadius: '8px'
          }}>
            {recommendation.tips.map((tip, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                <div style={{
                  width: '4px',
                  height: '4px',
                  background: '#f97316',
                  borderRadius: '50%',
                  marginRight: '8px'
                }}></div>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '13px' }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f97316 0%, #ef4444 50%, #ec4899 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '28rem',
        position: 'relative'
      }}>
        {/* Background decorative elements */}
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: '8rem',
          height: '8rem',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'pulse 2s infinite'
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: '25%',
          right: '25%',
          width: '6rem',
          height: '6rem',
          background: 'rgba(251, 146, 60, 0.2)',
          borderRadius: '50%',
          filter: 'blur(20px)',
          animation: 'pulse 2s infinite 0.7s'
        }}></div>

        {/* Main container */}
        <div style={{
          position: 'relative',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(16px)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #f97316, #ef4444)',
              borderRadius: '50%',
              marginBottom: '16px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
            }}>
              <svg style={{ width: '32px', height: '32px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 style={{
              fontSize: '30px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '8px'
            }}>BMI Calculator</h1>
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '16px'
            }}>Track your health journey</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Weight Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{
                display: 'block',
                color: 'white',
                fontWeight: '500',
                fontSize: '14px'
              }}>Weight (Kgs)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  placeholder="Enter your weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 0 2px rgba(251, 146, 60, 0.5)';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  right: '12px',
                  top: '12px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '14px'
                }}>
                  kg
                </div>
              </div>
            </div>

            {/* Height Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{
                display: 'block',
                color: 'white',
                fontWeight: '500',
                fontSize: '14px'
              }}>Height (Inches)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  placeholder="Enter your height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 0 2px rgba(251, 146, 60, 0.5)';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  right: '12px',
                  top: '12px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '14px'
                }}>
                  in
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px', paddingTop: '16px' }}>
              <button
                onClick={calcBmi}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #f97316, #ef4444)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 15px 35px -5px rgba(0, 0, 0, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3)';
                }}
              >
                Calculate BMI
              </button>
              <button
                onClick={reload}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                Reset
              </button>
            </div>

            {/* Results */}
            {(bmi || message) && (
              <div style={{
                marginTop: '32px',
                padding: '24px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(8px)'
              }}>
                <div style={{ textAlign: 'center' }}>
                  {bmi && (
                    <div style={{ marginBottom: '16px' }}>
                      <p style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                        marginBottom: '4px'
                      }}>Your BMI is</p>
                      <p style={{
                        fontSize: '36px',
                        fontWeight: 'bold',
                        color: getBmiColor() === 'text-blue-400' ? '#60a5fa' :
                               getBmiColor() === 'text-green-400' ? '#4ade80' :
                               getBmiColor() === 'text-yellow-400' ? '#facc15' :
                               getBmiColor() === 'text-red-400' ? '#f87171' : '#9ca3af'
                      }}>{bmi}</p>
                    </div>
                  )}
                  {message && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '8px 16px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '25px'
                    }}>
                      <span style={{
                        color: 'white',
                        fontWeight: '500'
                      }}>{message}</span>
                    </div>
                  )}
                  {nutritionData && getNutritionRecommendation()}
                </div>
              </div>
            )}
          </div>

          {/* BMI Scale Reference */}
          <div style={{
            marginTop: '32px',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{
              color: 'white',
              fontWeight: '600',
              fontSize: '14px',
              marginBottom: '12px'
            }}>BMI Scale Reference</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              fontSize: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  background: '#60a5fa',
                  borderRadius: '50%',
                  marginRight: '8px'
                }}></div>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Underweight (&lt;18.5)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  background: '#4ade80',
                  borderRadius: '50%',
                  marginRight: '8px'
                }}></div>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Normal (18.5-24.9)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  background: '#facc15',
                  borderRadius: '50%',
                  marginRight: '8px'
                }}></div>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Overweight (25-29.9)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  background: '#f87171',
                  borderRadius: '50%',
                  marginRight: '8px'
                }}></div>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Obese (≥30)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
        
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}

export default Bmi;