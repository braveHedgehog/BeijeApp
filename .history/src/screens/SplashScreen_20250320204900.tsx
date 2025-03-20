/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Dimensions,Text} from 'react-native';
import LottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/AppNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {signIn, getProfile, getMenstruationDays, getInsights} from '../api';
import {setToken} from '../redux/slices/authSlice';
import {setProfile} from '../redux/slices/profileSlice';
import {setMenstruationData} from '../redux/slices/menstruationSlice';
import {setInsights} from '../redux/slices/insightsSlice';
import {RootState} from '../redux/store';

type SplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Splash'
>;

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const dispatch = useDispatch();
  const {token} = useSelector((state: RootState) => state.auth);

  const [animationCount, setAnimationCount] = useState(0);
  const [apiLoaded, setApiLoaded] = useState(false);

  const lottieRef = useRef<LottieView>(null);
  // API isteklerini yap
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await signIn();
        const profileData = await getProfile();
        const cycleData = await getMenstruationDays();
        const insightsData = await getInsights();
        dispatch(setProfile(profileData));
        dispatch(setMenstruationData(cycleData));
        dispatch(setInsights(insightsData));
      } catch (error: any) {
        console.error(
          'Veri yükleme hatası:',
          error.response?.data || error.message,
        );
      }
    };
    fetchData();
  }, []);
  const menstruationDays = useSelector(
    (state: RootState) => state.menstruation.menstrationDays,
  );
  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Cycle');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);
  return (
    <View style={styles.container}>
      <LottieView
        ref={lottieRef}
        source={require('../assets/animation_splash.json')} // Lottie dosyanızı buraya koyun
        autoPlay
        loop={false}
        style={styles.lottie}
      />
      <Text style={styles.logo}>beije.</Text>
    </View>
  );
};

export default SplashScreen;

const {width, height} = Dimensions.get('screen');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBEFEB', // Figma'daki arka plan rengi
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: width * 0.4,
    height: width * 0.4,
    //marginBottom: 400,
  },
  logo: {
    fontSize: 24,
    color: '#F28C38',
  },
});
