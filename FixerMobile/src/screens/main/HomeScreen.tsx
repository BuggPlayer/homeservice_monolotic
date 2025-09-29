import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Card, Searchbar, Chip, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../../types';
import { RootState, AppDispatch } from '../../store';
import { getServiceRequests, getProviders } from '../../store/slices/serviceSlice';
import { COLORS, FONT_SIZES, SPACING, SERVICE_CATEGORIES } from '../../constants';
import { showToast } from '../../store/slices/uiSlice';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.MD * 3) / 2;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { serviceRequests, providers, isLoading } = useSelector((state: RootState) => state.service);

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        dispatch(getServiceRequests({ limit: 5 })),
        dispatch(getProviders({ limit: 5, verification_status: 'verified' })),
      ]);
    } catch (error) {
      dispatch(showToast({
        message: 'Failed to load data',
        type: 'error',
      }));
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
    navigation.navigate('ServiceRequest', { serviceType: categoryId });
  };

  const handleServiceRequestPress = (requestId: string) => {
    navigation.navigate('ServiceRequestDetails', { requestId });
  };

  const handleProviderPress = (providerId: string) => {
    navigation.navigate('ProviderProfile', { providerId });
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to search screen with query
      navigation.navigate('Search', { query: searchQuery });
    }
  };

  const renderServiceCategory = (category: typeof SERVICE_CATEGORIES[0]) => (
    <TouchableOpacity
      key={category.id}
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(category.id)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
        <Icon name={category.icon} size={32} color={COLORS.WHITE} />
      </View>
      <Text style={styles.categoryName}>{category.name}</Text>
      <Text style={styles.categoryDescription}>{category.description}</Text>
    </TouchableOpacity>
  );

  const renderServiceRequest = (request: any) => (
    <TouchableOpacity
      key={request.id}
      style={styles.requestCard}
      onPress={() => handleServiceRequestPress(request.id)}
    >
      <View style={styles.requestHeader}>
        <Text style={styles.requestTitle} numberOfLines={1}>
          {request.title}
        </Text>
        <Chip
          mode="outlined"
          compact
          style={[
            styles.urgencyChip,
            { backgroundColor: getUrgencyColor(request.urgency) }
          ]}
        >
          {request.urgency}
        </Chip>
      </View>
      <Text style={styles.requestDescription} numberOfLines={2}>
        {request.description}
      </Text>
      <View style={styles.requestFooter}>
        <Text style={styles.requestLocation}>{request.location.city}</Text>
        <Text style={styles.requestTime}>
          {new Date(request.created_at).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderProvider = (provider: any) => (
    <TouchableOpacity
      key={provider.id}
      style={styles.providerCard}
      onPress={() => handleProviderPress(provider.id)}
    >
      <Avatar.Text
        size={50}
        label={provider.business_name.charAt(0)}
        style={styles.providerAvatar}
      />
      <View style={styles.providerInfo}>
        <Text style={styles.providerName} numberOfLines={1}>
          {provider.business_name}
        </Text>
        <Text style={styles.providerServices} numberOfLines={1}>
          {provider.services_offered.join(', ')}
        </Text>
        <View style={styles.providerRating}>
          <Icon name="star" size={16} color={COLORS.WARNING} />
          <Text style={styles.ratingText}>{provider.rating.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({provider.total_reviews})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return COLORS.ERROR;
      case 'high': return '#FF5722';
      case 'medium': return COLORS.WARNING;
      case 'low': return COLORS.SUCCESS;
      default: return COLORS.GRAY;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.first_name || 'User'}!</Text>
          <Text style={styles.subtitle}>What service do you need today?</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Icon name="notifications" size={24} color={COLORS.PRIMARY} />
        </TouchableOpacity>
      </View>

      <Searchbar
        placeholder="Search for services..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        onSubmitEditing={handleSearch}
        style={styles.searchBar}
        iconColor={COLORS.GRAY}
        inputStyle={styles.searchInput}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Service Categories</Text>
        <View style={styles.categoriesGrid}>
          {SERVICE_CATEGORIES.map(renderServiceCategory)}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Requests</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {serviceRequests.map(renderServiceRequest)}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Providers</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.providersList}>
          {providers.map(renderProvider)}
        </View>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.MD,
    backgroundColor: COLORS.WHITE,
  },
  greeting: {
    fontSize: FONT_SIZES.XL,
    fontWeight: 'bold',
    color: COLORS.BLACK,
  },
  subtitle: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.DARK_GRAY,
    marginTop: SPACING.XS,
  },
  notificationButton: {
    padding: SPACING.SM,
  },
  searchBar: {
    margin: SPACING.MD,
    elevation: 2,
  },
  searchInput: {
    fontSize: FONT_SIZES.MD,
  },
  section: {
    marginBottom: SPACING.LG,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    marginBottom: SPACING.MD,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.BLACK,
  },
  seeAllText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.MD,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
    alignItems: 'center',
    elevation: 2,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  categoryName: {
    fontSize: FONT_SIZES.SM,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    textAlign: 'center',
    marginBottom: SPACING.XS,
  },
  categoryDescription: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.DARK_GRAY,
    textAlign: 'center',
    lineHeight: 16,
  },
  requestCard: {
    width: 280,
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: SPACING.MD,
    marginRight: SPACING.MD,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  requestTitle: {
    fontSize: FONT_SIZES.MD,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    flex: 1,
    marginRight: SPACING.SM,
  },
  urgencyChip: {
    height: 24,
  },
  requestDescription: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.DARK_GRAY,
    lineHeight: 18,
    marginBottom: SPACING.SM,
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestLocation: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  requestTime: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.GRAY,
  },
  providersList: {
    paddingHorizontal: SPACING.MD,
  },
  providerCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: SPACING.MD,
    marginBottom: SPACING.SM,
    elevation: 2,
    alignItems: 'center',
  },
  providerAvatar: {
    backgroundColor: COLORS.PRIMARY,
    marginRight: SPACING.MD,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: FONT_SIZES.MD,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: SPACING.XS,
  },
  providerServices: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.DARK_GRAY,
    marginBottom: SPACING.XS,
  },
  providerRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: FONT_SIZES.SM,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginLeft: SPACING.XS,
  },
  reviewCount: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.GRAY,
    marginLeft: SPACING.XS,
  },
  bottomSpacing: {
    height: SPACING.XXL,
  },
});

export default HomeScreen;
