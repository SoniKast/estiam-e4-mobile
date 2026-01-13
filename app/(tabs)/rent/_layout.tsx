import { Stack } from 'expo-router';

export default function RentLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="offers" options={{ headerShown: false }} />
      <Stack.Screen name="renters-nearby" options={{ title: 'Loueurs à proximité' }} />
      <Stack.Screen name="user-profile" options={{ title: 'Profil' }} />
      <Stack.Screen name="book-appointment" options={{ title: 'Prendre rendez-vous' }} />
      <Stack.Screen name="appointment-detail" options={{ title: 'Détail du rendez-vous' }} />
    </Stack>
  );
}