/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { signInRequest, getProfile, getMenstruationDays, getInsights } from '../api';
import { setToken } from '../redux/slices/authSlice';
import { setProfile } from '../redux/slices/profileSlice';
import { setMenstruationData } from '../redux/slices/menstruationSlice';
import { setInsights } from '../redux/slices/insightsSlice';
import { RootState } from '../redux/store';

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);

  const [animationCount, setAnimationCount] = useState(0);
  const [apiLoaded, setApiLoaded] = useState(false);

  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    // API isteklerini yap
    const fetchData = async () => {
      try {
        let currentToken = token;
        // Token yoksa ilk kez giriş yapılıyordur
        const signInResponse = await signInRequest('salar@beije.co', 'beijeApp');
          currentToken = signInResponse.data.token;
        // Profil
        const profileResponse = await getProfile();
        dispatch(setProfile(profileResponse.data));

        // Menstruation days
        const menstruationResponse = await getMenstruationDays();
        dispatch(setMenstruationData(menstruationResponse.data));

        // Insights
        const insightsResponse = await getInsights();
        dispatch(setInsights(insightsResponse.data.insights));

        // API verileri yüklendi
        setApiLoaded(true);
      } catch (error) {
        console.log('API Error:', error);
      }
    };

    fetchData();
  }, []);

  // Her animasyon bittiğinde sayaç 1 artar
  const handleAnimationFinish = () => {
    setAnimationCount((prev) => prev + 1);
  };

  // 3 kez animasyon bittiğinde ve API'ler de yüklendiyse, Cycle ekranına yönlendir
  useEffect(() => {
    if (animationCount >= 3 && apiLoaded) {
      navigation.replace('Cycle');
    }
  }, [animationCount, apiLoaded]);

  return (
    <View style={styles.container}>
      <LottieView
        ref={lottieRef}
        source={require('../assets/animation_splash.json')} // Lottie dosyanızı buraya koyun
        autoPlay
        loop={false}
        onAnimationFinish={handleAnimationFinish}
        style={styles.lottie}
      />
    </View>
  );
};

export default SplashScreen;

const { width, height } = Dimensions.get('screen');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBEFEB', // Figma'daki arka plan rengi
    alignItems: 'center',
    justifyContent: 'center'
  },
  lottie: {
    width: width * 0.4,
    height: width * 0.4
  }
});
