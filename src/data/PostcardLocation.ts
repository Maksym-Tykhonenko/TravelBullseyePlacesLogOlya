export type PostcardLocation = {
  id: string;
  title: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  whyPeopleLoveIt: string;
  quickCulturalNote: string;
  whatMakesItSpecial: string;
  travelerVibe: string[];
  image: any;
};

export const postcardPicks: PostcardLocation[] = [
  {
    id: 'hallstatt-austria',
    title: 'Hallstatt',
    country: 'Austria',
    coordinates: { latitude: 47.5613, longitude: 13.6493 },
    whyPeopleLoveIt:
      'Hallstatt looks like a postcard brought to life — colorful houses clinging to a lakeshore beneath dramatic alpine mountains. Travelers come for the serene beauty and the magical reflections on the water.',
    quickCulturalNote:
      'The village sits in one of the oldest salt mining regions in the world. Salt from Hallstatt helped shape the prosperity of the region thousands of years ago.',
    whatMakesItSpecial:
      'The entire village feels suspended between mountains and water, creating one of the most photographed landscapes in Europe.',
    travelerVibe: ['Dreamy alpine village', 'Quiet morning walks', 'Fairytale scenery'],
    image: require('../assets/images/places/spot_hallstatt_at.png'),
  },
  {
    id: 'albarracin-spain',
    title: 'Albarracín',
    country: 'Spain',
    coordinates: { latitude: 40.408, longitude: -1.4445 },
    whyPeopleLoveIt:
      'This hilltop town is filled with narrow winding streets, pink-toned medieval houses, and ancient walls that follow the surrounding cliffs.',
    quickCulturalNote:
      'Albarracín was once an independent Moorish kingdom before becoming part of Spain, which shaped its unique architecture and layout.',
    whatMakesItSpecial:
      'The entire town seems frozen in time, with almost no modern structures disturbing the historic skyline.',
    travelerVibe: ['Historic', 'Mysterious', 'Cinematic medieval atmosphere'],
    image: require('../assets/images/places/spot_albarracin_es.png'),
  },
  {
    id: 'wulingyuan-china',
    title: 'Wulingyuan Scenic Area',
    country: 'China',
    coordinates: { latitude: 29.345, longitude: 110.55 },
    whyPeopleLoveIt:
      'Towering sandstone pillars rise from the forest like a surreal stone forest, often surrounded by mist.',
    quickCulturalNote:
      'This landscape inspired the floating mountains in the film Avatar, bringing global attention to the region.',
    whatMakesItSpecial:
      'Thousands of narrow rock pillars form a natural maze that looks almost otherworldly.',
    travelerVibe: ['Epic nature', 'Misty fantasy landscapes', 'Awe-inspiring views'],
    image: require('../assets/images/places/spot_wulingyuan_cn.png'),
  },
  {
    id: 'chefchaouen-morocco',
    title: 'Chefchaouen',
    country: 'Morocco',
    coordinates: { latitude: 35.1688, longitude: -5.2636 },
    whyPeopleLoveIt:
      'The town is famous for its blue-painted streets and buildings that glow under the Moroccan sun.',
    quickCulturalNote:
      'The blue color tradition is believed to have been introduced centuries ago by Jewish communities living in the region.',
    whatMakesItSpecial:
      'Every alley, stairway, and doorway feels like a perfect photo spot.',
    travelerVibe: ['Colorful', 'Relaxed mountain town', 'Artistic and photogenic'],
    image: require('../assets/images/places/spot_chefchaouen_ma.png'),
  },
  {
    id: 'jiufen-taiwan',
    title: 'Jiufen',
    country: 'Taiwan',
    coordinates: { latitude: 25.1097, longitude: 121.8452 },
    whyPeopleLoveIt:
      'Jiufen is a hillside town full of glowing lanterns, narrow streets, and teahouses overlooking the Pacific Ocean.',
    quickCulturalNote:
      'The town grew during Taiwan’s gold mining boom in the late 19th century.',
    whatMakesItSpecial:
      'Its layered streets and lantern-lit atmosphere at night create a magical cinematic feeling.',
    travelerVibe: ['Misty evenings', 'Glowing lanterns', 'Nostalgic mountain town'],
    image: require('../assets/images/places/spot_jiufen_tw.png'),
  },
  {
    id: 'saksun-faroe-islands',
    title: 'Saksun Village',
    country: 'Faroe Islands',
    coordinates: { latitude: 62.248, longitude: -7.185 },
    whyPeopleLoveIt:
      'Travelers are drawn to Saksun for its dramatic fjord landscapes, grass-roof houses, and complete isolation.',
    quickCulturalNote:
      'Traditional Faroese architecture uses turf roofs, which help insulate homes against the cold North Atlantic climate.',
    whatMakesItSpecial:
      'The village sits at the end of a tidal lagoon surrounded by towering green mountains.',
    travelerVibe: ['Wild nature', 'Remote beauty', 'Cinematic Nordic landscapes'],
    image: require('../assets/images/places/spot_saksun_fo.png'),
  },
  {
    id: 'lake-bled-slovenia',
    title: 'Lake Bled',
    country: 'Slovenia',
    coordinates: { latitude: 46.3636, longitude: 14.0938 },
    whyPeopleLoveIt:
      'A small island church sits in the middle of a crystal-clear alpine lake surrounded by mountains.',
    quickCulturalNote:
      'Visitors traditionally ring the church bell on the island to make a wish.',
    whatMakesItSpecial:
      'Few places combine castle views, mountains, and a tiny island church in such a perfectly balanced scene.',
    travelerVibe: ['Romantic', 'Peaceful', 'Magical alpine getaway'],
    image: require('../assets/images/places/spot_bled_si.png'),
  },
  {
    id: 'zhangye-danxia-china',
    title: 'Zhangye Danxia Landform',
    country: 'China',
    coordinates: { latitude: 38.915, longitude: 100.098 },
    whyPeopleLoveIt:
      'Rainbow-colored mountains stretch across the landscape like giant painted waves.',
    quickCulturalNote:
      'The colors come from millions of years of mineral deposits layered into sandstone.',
    whatMakesItSpecial:
      'The terrain looks almost unreal, like a natural abstract painting.',
    travelerVibe: ['Colorful', 'Surreal', 'Wide open desert landscapes'],
    image: require('../assets/images/places/spot_zhangye_cn.png'),
  },
  {
    id: 'ban-gioc-vietnam',
    title: 'Ban Gioc Waterfall',
    country: 'Vietnam',
    coordinates: { latitude: 22.853, longitude: 106.723 },
    whyPeopleLoveIt:
      'One of Asia’s largest waterfalls cascades through lush jungle on the border between Vietnam and China.',
    quickCulturalNote:
      'The waterfall has long been part of local folklore and border history between the two countries.',
    whatMakesItSpecial:
      'The waterfall spreads across multiple tiers surrounded by dramatic limestone cliffs.',
    travelerVibe: ['Powerful nature', 'Tropical calm', 'Adventurous exploration'],
    image: require('../assets/images/places/spot_bangioc_vn.png'),
  },
  {
    id: 'meteora-greece',
    title: 'Meteora',
    country: 'Greece',
    coordinates: { latitude: 39.7217, longitude: 21.63 },
    whyPeopleLoveIt:
      'Ancient monasteries sit atop towering rock pillars rising from the Thessalian plains.',
    quickCulturalNote:
      'Monks built these monasteries centuries ago to live in isolation and spiritual retreat.',
    whatMakesItSpecial:
      'The monasteries appear to float above the landscape.',
    travelerVibe: ['Spiritual', 'Dramatic', 'Timeless mountain scenery'],
    image: require('../assets/images/places/spot_meteora_gr.png'),
  },
  {
    id: 'socotra-yemen',
    title: 'Socotra Island',
    country: 'Yemen',
    coordinates: { latitude: 12.4634, longitude: 53.8238 },
    whyPeopleLoveIt:
      'Socotra feels like a different planet. Travelers are drawn to its surreal landscapes filled with strange umbrella-shaped dragon blood trees, white sand dunes, turquoise lagoons, and dramatic cliffs that drop straight into the Arabian Sea.',
    quickCulturalNote:
      'Socotra has been isolated for millions of years, which allowed many plants and animals to evolve in ways found nowhere else on Earth.',
    whatMakesItSpecial:
      'Nearly a third of the island’s plant life exists only here. The strange tree shapes and untouched wilderness make it look like a natural fantasy world.',
    travelerVibe: ['Wild', 'Remote', 'Otherworldly nature'],
    image: require('../assets/images/places/spot_socotra_ye.png'),
  },
  {
    id: 'huacachina-peru',
    title: 'Huacachina Oasis',
    country: 'Peru',
    coordinates: { latitude: -14.0875, longitude: -75.7626 },
    whyPeopleLoveIt:
      'In the middle of vast golden sand dunes lies a tiny desert oasis surrounded by palm trees and a peaceful lagoon.',
    quickCulturalNote:
      'Local legends say the lagoon was formed by the tears of an Incan princess.',
    whatMakesItSpecial:
      'It’s one of the few natural desert oases in South America and offers stunning sunset views over endless dunes.',
    travelerVibe: ['Adventurous desert escape', 'Sandboarding', 'Warm golden sunsets'],
    image: require('../assets/images/places/spot_huacachina_pe.png'),
  },
  {
    id: 'plitvice-croatia',
    title: 'Plitvice Lakes National Park',
    country: 'Croatia',
    coordinates: { latitude: 44.8654, longitude: 15.582 },
    whyPeopleLoveIt:
      'Travelers come to wander through wooden pathways above turquoise lakes connected by cascading waterfalls.',
    quickCulturalNote:
      'The lakes constantly change shape as mineral-rich water forms natural travertine barriers that create new waterfalls over time.',
    whatMakesItSpecial:
      'Sixteen terraced lakes glow in shades of emerald, turquoise, and deep blue depending on sunlight and minerals.',
    travelerVibe: ['Refreshing', 'Magical forest waterfalls'],
    image: require('../assets/images/places/spot_plitvice_hr.png'),
  },
  {
    id: 'cappadocia-turkey',
    title: 'Cappadocia',
    country: 'Turkey',
    coordinates: { latitude: 38.6431, longitude: 34.8273 },
    whyPeopleLoveIt:
      'Hundreds of hot air balloons float above valleys filled with unique rock formations called “fairy chimneys.”',
    quickCulturalNote:
      'Ancient civilizations carved homes, churches, and entire underground cities into the soft volcanic rock.',
    whatMakesItSpecial:
      'The landscape looks like a natural sculpture park shaped by wind and volcanic activity over thousands of years.',
    travelerVibe: ['Dreamlike sunrise skies', 'Epic balloon views'],
    image: require('../assets/images/places/spot_cappadocia_tr.png'),
  },
  {
    id: 'torres-del-paine-chile',
    title: 'Torres del Paine National Park',
    country: 'Chile',
    coordinates: { latitude: -50.9423, longitude: -73.4068 },
    whyPeopleLoveIt:
      'Jagged granite peaks rise above turquoise lakes and golden grasslands in one of Patagonia’s most dramatic landscapes.',
    quickCulturalNote:
      'The park is part of the ancient Patagonian wilderness where indigenous communities once lived among glaciers and mountains.',
    whatMakesItSpecial:
      'The iconic “Torres” towers dominate the skyline and glow pink during sunrise.',
    travelerVibe: ['Epic wilderness', 'Powerful nature', 'Vast open spaces'],
    image: require('../assets/images/places/spot_torresdelpaine_cl.png'),
  },
  {
    id: 'lofoten-norway',
    title: 'Lofoten Islands',
    country: 'Norway',
    coordinates: { latitude: 68.207, longitude: 13.57 },
    whyPeopleLoveIt:
      'Sharp mountain peaks rise straight out of the sea while colorful fishing villages sit along quiet fjords.',
    quickCulturalNote:
      'Fishing has been the backbone of life here for centuries, especially the seasonal cod harvest.',
    whatMakesItSpecial:
      'The islands combine dramatic Arctic landscapes with surprisingly mild coastal climates.',
    travelerVibe: ['Wild Nordic beauty', 'Peaceful coastal life'],
    image: require('../assets/images/places/spot_lofoten_no.png'),
  },
  {
    id: 'ait-benhaddou-morocco',
    title: 'Aït Benhaddou',
    country: 'Morocco',
    coordinates: { latitude: 31.047, longitude: -7.129 },
    whyPeopleLoveIt:
      'This ancient desert village made of clay buildings rises above the surrounding valley like a sand-colored fortress.',
    quickCulturalNote:
      'The ksar has served as a caravan stop along historic trade routes across the Sahara.',
    whatMakesItSpecial:
      'Its striking architecture has appeared in many famous films and historical dramas.',
    travelerVibe: ['Timeless desert history', 'Cinematic landscapes'],
    image: require('../assets/images/places/spot_aitbenhaddou_ma.png'),
  },
  {
    id: 'mount-roraima',
    title: 'Mount Roraima',
    country: 'Venezuela / Brazil / Guyana',
    coordinates: { latitude: 5.212, longitude: -60.762 },
    whyPeopleLoveIt:
      'This massive flat-topped mountain rises abruptly from the surrounding rainforest like a giant stone table.',
    quickCulturalNote:
      'Local indigenous legends describe the mountain as the stump of a mythical tree that once held all the fruits of the world.',
    whatMakesItSpecial:
      'The summit is often covered in mist and contains rare ecosystems found nowhere else.',
    travelerVibe: ['Mystical adventure', 'Lost-world exploration'],
    image: require('../assets/images/places/spot_roraima_ve.png'),
  },
  {
    id: 'sapa-vietnam',
    title: 'Sapa Rice Terraces',
    country: 'Vietnam',
    coordinates: { latitude: 22.3364, longitude: 103.8438 },
    whyPeopleLoveIt:
      'Endless green rice terraces flow across the mountain slopes like natural staircases.',
    quickCulturalNote:
      'Local ethnic communities have farmed these mountains using traditional terrace methods for generations.',
    whatMakesItSpecial:
      'During harvest season the terraces turn golden, creating breathtaking patterns across the landscape.',
    travelerVibe: ['Peaceful mountain villages', 'Cultural discovery'],
    image: require('../assets/images/places/spot_sapa_vn.png'),
  },
  {
    id: 'fairy-pools-skye',
    title: 'Fairy Pools',
    country: 'Scotland',
    coordinates: { latitude: 57.2527, longitude: -6.2724 },
    whyPeopleLoveIt:
      'Crystal-clear pools and small waterfalls flow through dramatic highland scenery beneath the Black Cuillin mountains.',
    quickCulturalNote:
      'Scottish folklore is filled with stories of mystical creatures and fairy legends tied to places like this.',
    whatMakesItSpecial:
      'The water glows turquoise against dark volcanic rock and misty skies.',
    travelerVibe: ['Moody', 'Magical highland landscapes'],
    image: require('../assets/images/places/spot_fairypools_skye_gb.png'),
  },
  {
    id: 'antelope-canyon-usa',
    title: 'Antelope Canyon',
    country: 'USA',
    coordinates: { latitude: 36.8619, longitude: -111.3743 },
    whyPeopleLoveIt:
      'Narrow sandstone corridors twist and glow with orange and red colors as sunlight beams through the canyon above.',
    quickCulturalNote:
      'The canyon lies on Navajo land and holds cultural significance for the local community.',
    whatMakesItSpecial:
      'Light beams illuminate the canyon walls in shifting patterns throughout the day.',
    travelerVibe: ['Warm desert light', 'Surreal rock textures'],
    image: require('../assets/images/places/spot_antelopecanyon_us.png'),
  },
  {
    id: 'raja-ampat-indonesia',
    title: 'Raja Ampat Islands',
    country: 'Indonesia',
    coordinates: { latitude: -0.2333, longitude: 130.5167 },
    whyPeopleLoveIt:
      'Hundreds of jungle-covered limestone islands rise from some of the clearest turquoise water on Earth.',
    quickCulturalNote:
      'The region sits within the Coral Triangle, one of the most biodiverse marine areas on the planet.',
    whatMakesItSpecial:
      'Underwater life here is among the richest anywhere in the world.',
    travelerVibe: ['Tropical paradise', 'Hidden island adventure'],
    image: require('../assets/images/places/spot_rajaampat_id.png'),
  },
];