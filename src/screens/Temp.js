import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useContext } from 'react';
import { GasContext } from '../context/GasContext';
const Temp = ({currentTemp}) => {
  const chartHeight = 250;
  const chartWidth = 40;
  const bulbRadius = 30;
  const {maxTemp}=useContext(GasContext)

  // Calculate filled height (accounting for bulb at the bottom)
  const availableHeight = chartHeight - bulbRadius;
  const fillPercentage = Math.min(currentTemp / maxTemp, 1);
  const fillHeight = availableHeight * fillPercentage;

  return (
    <View style={styles.container}>
      <Svg height={chartHeight} width={chartWidth + bulbRadius}>
        {/* Thermometer Tube Background */}
        <Rect
          x={(chartWidth + bulbRadius) / 2 - chartWidth / 2}
          y={0}
          width={chartWidth}
          height={availableHeight}
          rx={chartWidth / 2}
          fill="#e0e0e0"
        />

        {/* Liquid (Mercury) Fill */}
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="1" x2="0%" y2="0">
            <Stop offset="0%" stopColor="#2196F3" />
            <Stop offset="100%" stopColor="#F44336" />
          </LinearGradient>
        </Defs>
        <Rect
          x={(chartWidth + bulbRadius) / 2 - chartWidth / 2}
          y={availableHeight - fillHeight}
          width={chartWidth}
          height={fillHeight}
          rx={chartWidth / 2}
          fill="url(#grad)"
        />

        {/* Thermometer Bulb */}
        <Circle
          cx={(chartWidth + bulbRadius) / 2}
          cy={availableHeight}
          r={bulbRadius}
          fill="#F44336"
        />
      </Svg>
      <Text style={styles.text}>{currentTemp}°C</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
   
  },
  text: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Temp; 

