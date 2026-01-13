import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  editable?: boolean;
  onRatingChange?: (rating: number) => void;
  color?: string;
}

export function StarRating({
  rating,
  maxStars = 5,
  size = 20,
  editable = false,
  onRatingChange,
  color = '#F59E0B',
}: StarRatingProps) {
  const handlePress = (index: number) => {
    if (editable && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: maxStars }, (_, index) => {
        const isFilled = index < Math.floor(rating);
        const isHalfFilled = index < rating && index >= Math.floor(rating);

        return (
          <Pressable
            key={index}
            onPress={() => handlePress(index)}
            disabled={!editable}
            style={styles.star}
          >
            {isHalfFilled ? (
              <FontAwesome name="star-half-full" size={size} color={color} />
            ) : (
              <FontAwesome
                name={isFilled ? 'star' : 'star-o'}
                size={size}
                color={isFilled ? color : '#D1D5DB'}
              />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 4,
  },
});