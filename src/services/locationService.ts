import { indianStates } from '@/data/indianStates';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface LocationInfo {
  city: string;
  state: string;
  coordinates: LocationCoordinates;
  region: string;
}

class LocationService {
  private static instance: LocationService;

  private constructor() {}

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  // Calculate distance between two coordinates using Haversine formula
  calculateDistance(coord1: LocationCoordinates, coord2: LocationCoordinates): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(coord2.lat - coord1.lat);
    const dLng = this.toRadians(coord2.lng - coord1.lng);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(coord1.lat)) * Math.cos(this.toRadians(coord2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Get major Indian cities with coordinates
  getMajorIndianCities(): LocationInfo[] {
    return [
      { city: 'Mumbai', state: 'Maharashtra', coordinates: { lat: 19.0760, lng: 72.8777 }, region: 'West' },
      { city: 'Delhi', state: 'Delhi', coordinates: { lat: 28.7041, lng: 77.1025 }, region: 'North' },
      { city: 'Bengaluru', state: 'Karnataka', coordinates: { lat: 12.9716, lng: 77.5946 }, region: 'South' },
      { city: 'Chennai', state: 'Tamil Nadu', coordinates: { lat: 13.0827, lng: 80.2707 }, region: 'South' },
      { city: 'Kolkata', state: 'West Bengal', coordinates: { lat: 22.5726, lng: 88.3639 }, region: 'East' },
      { city: 'Hyderabad', state: 'Telangana', coordinates: { lat: 17.3850, lng: 78.4867 }, region: 'South' },
      { city: 'Pune', state: 'Maharashtra', coordinates: { lat: 18.5204, lng: 73.8567 }, region: 'West' },
      { city: 'Ahmedabad', state: 'Gujarat', coordinates: { lat: 23.0225, lng: 72.5714 }, region: 'West' },
      { city: 'Jaipur', state: 'Rajasthan', coordinates: { lat: 26.9124, lng: 75.7873 }, region: 'North' },
      { city: 'Lucknow', state: 'Uttar Pradesh', coordinates: { lat: 26.8467, lng: 80.9462 }, region: 'North' },
      { city: 'Kanpur', state: 'Uttar Pradesh', coordinates: { lat: 26.4499, lng: 80.3319 }, region: 'North' },
      { city: 'Nagpur', state: 'Maharashtra', coordinates: { lat: 21.1458, lng: 79.0882 }, region: 'Central' },
      { city: 'Indore', state: 'Madhya Pradesh', coordinates: { lat: 22.7196, lng: 75.8577 }, region: 'Central' },
      { city: 'Thane', state: 'Maharashtra', coordinates: { lat: 19.2183, lng: 72.9781 }, region: 'West' },
      { city: 'Bhopal', state: 'Madhya Pradesh', coordinates: { lat: 23.2599, lng: 77.4126 }, region: 'Central' },
      { city: 'Visakhapatnam', state: 'Andhra Pradesh', coordinates: { lat: 17.6868, lng: 83.2185 }, region: 'South' },
      { city: 'Pimpri-Chinchwad', state: 'Maharashtra', coordinates: { lat: 18.6298, lng: 73.7997 }, region: 'West' },
      { city: 'Patna', state: 'Bihar', coordinates: { lat: 25.5941, lng: 85.1376 }, region: 'East' },
      { city: 'Vadodara', state: 'Gujarat', coordinates: { lat: 22.3072, lng: 73.1812 }, region: 'West' },
      { city: 'Ghaziabad', state: 'Uttar Pradesh', coordinates: { lat: 28.6692, lng: 77.4538 }, region: 'North' },
      { city: 'Ludhiana', state: 'Punjab', coordinates: { lat: 30.9010, lng: 75.8573 }, region: 'North' },
      { city: 'Agra', state: 'Uttar Pradesh', coordinates: { lat: 27.1767, lng: 78.0081 }, region: 'North' },
      { city: 'Nashik', state: 'Maharashtra', coordinates: { lat: 19.9975, lng: 73.7898 }, region: 'West' },
      { city: 'Faridabad', state: 'Haryana', coordinates: { lat: 28.4089, lng: 77.3178 }, region: 'North' },
      { city: 'Meerut', state: 'Uttar Pradesh', coordinates: { lat: 28.9845, lng: 77.7064 }, region: 'North' },
      { city: 'Rajkot', state: 'Gujarat', coordinates: { lat: 22.3039, lng: 70.8022 }, region: 'West' },
      { city: 'Kalyan-Dombivli', state: 'Maharashtra', coordinates: { lat: 19.2403, lng: 73.1305 }, region: 'West' },
      { city: 'Vasai-Virar', state: 'Maharashtra', coordinates: { lat: 19.4912, lng: 72.8054 }, region: 'West' },
      { city: 'Varanasi', state: 'Uttar Pradesh', coordinates: { lat: 25.3176, lng: 82.9739 }, region: 'North' },
      { city: 'Srinagar', state: 'Jammu and Kashmir', coordinates: { lat: 34.0837, lng: 74.7973 }, region: 'North' },
      { city: 'Aurangabad', state: 'Maharashtra', coordinates: { lat: 19.8762, lng: 75.3433 }, region: 'West' },
      { city: 'Dhanbad', state: 'Jharkhand', coordinates: { lat: 23.7957, lng: 86.4304 }, region: 'East' },
      { city: 'Amritsar', state: 'Punjab', coordinates: { lat: 31.6340, lng: 74.8723 }, region: 'North' },
      { city: 'Navi Mumbai', state: 'Maharashtra', coordinates: { lat: 19.0330, lng: 73.0297 }, region: 'West' },
      { city: 'Allahabad', state: 'Uttar Pradesh', coordinates: { lat: 25.4358, lng: 81.8463 }, region: 'North' },
      { city: 'Ranchi', state: 'Jharkhand', coordinates: { lat: 23.3441, lng: 85.3096 }, region: 'East' },
      { city: 'Howrah', state: 'West Bengal', coordinates: { lat: 22.5958, lng: 88.2636 }, region: 'East' },
      { city: 'Coimbatore', state: 'Tamil Nadu', coordinates: { lat: 11.0168, lng: 76.9558 }, region: 'South' },
      { city: 'Jabalpur', state: 'Madhya Pradesh', coordinates: { lat: 23.1815, lng: 79.9864 }, region: 'Central' },
      { city: 'Gwalior', state: 'Madhya Pradesh', coordinates: { lat: 26.2183, lng: 78.1828 }, region: 'Central' },
      { city: 'Vijayawada', state: 'Andhra Pradesh', coordinates: { lat: 16.5062, lng: 80.6480 }, region: 'South' },
      { city: 'Jodhpur', state: 'Rajasthan', coordinates: { lat: 26.2389, lng: 73.0243 }, region: 'North' },
      { city: 'Madurai', state: 'Tamil Nadu', coordinates: { lat: 9.9252, lng: 78.1198 }, region: 'South' },
      { city: 'Raipur', state: 'Chhattisgarh', coordinates: { lat: 21.2514, lng: 81.6296 }, region: 'Central' },
      { city: 'Kota', state: 'Rajasthan', coordinates: { lat: 25.2138, lng: 75.8648 }, region: 'North' },
      { city: 'Chandigarh', state: 'Chandigarh', coordinates: { lat: 30.7333, lng: 76.7794 }, region: 'North' },
      { city: 'Guwahati', state: 'Assam', coordinates: { lat: 26.1445, lng: 91.7362 }, region: 'Northeast' },
      { city: 'Solapur', state: 'Maharashtra', coordinates: { lat: 17.6599, lng: 75.9064 }, region: 'West' },
      { city: 'Hubli-Dharwad', state: 'Karnataka', coordinates: { lat: 15.3647, lng: 75.1240 }, region: 'South' },
      { city: 'Bareilly', state: 'Uttar Pradesh', coordinates: { lat: 28.3670, lng: 79.4304 }, region: 'North' },
      { city: 'Moradabad', state: 'Uttar Pradesh', coordinates: { lat: 28.8386, lng: 78.7733 }, region: 'North' },
      { city: 'Mysore', state: 'Karnataka', coordinates: { lat: 12.2958, lng: 76.6394 }, region: 'South' },
      { city: 'Gurgaon', state: 'Haryana', coordinates: { lat: 28.4595, lng: 77.0266 }, region: 'North' },
      { city: 'Aligarh', state: 'Uttar Pradesh', coordinates: { lat: 27.8974, lng: 78.0880 }, region: 'North' },
      { city: 'Jalandhar', state: 'Punjab', coordinates: { lat: 31.3260, lng: 75.5762 }, region: 'North' },
      { city: 'Tiruchirappalli', state: 'Tamil Nadu', coordinates: { lat: 10.7905, lng: 78.7047 }, region: 'South' },
      { city: 'Bhubaneswar', state: 'Odisha', coordinates: { lat: 20.2961, lng: 85.8245 }, region: 'East' },
      { city: 'Salem', state: 'Tamil Nadu', coordinates: { lat: 11.6643, lng: 78.1460 }, region: 'South' },
      { city: 'Warangal', state: 'Telangana', coordinates: { lat: 17.9689, lng: 79.5941 }, region: 'South' },
      { city: 'Mira-Bhayandar', state: 'Maharashtra', coordinates: { lat: 19.2952, lng: 72.8544 }, region: 'West' },
      { city: 'Thiruvananthapuram', state: 'Kerala', coordinates: { lat: 8.5241, lng: 76.9366 }, region: 'South' },
      { city: 'Bhiwandi', state: 'Maharashtra', coordinates: { lat: 19.3002, lng: 73.0635 }, region: 'West' },
      { city: 'Saharanpur', state: 'Uttar Pradesh', coordinates: { lat: 29.9680, lng: 77.5552 }, region: 'North' },
      { city: 'Guntur', state: 'Andhra Pradesh', coordinates: { lat: 16.3067, lng: 80.4365 }, region: 'South' },
      { city: 'Amravati', state: 'Maharashtra', coordinates: { lat: 20.9374, lng: 77.7796 }, region: 'West' },
      { city: 'Bikaner', state: 'Rajasthan', coordinates: { lat: 28.0229, lng: 73.3119 }, region: 'North' },
      { city: 'Noida', state: 'Uttar Pradesh', coordinates: { lat: 28.5355, lng: 77.3910 }, region: 'North' },
      { city: 'Jamshedpur', state: 'Jharkhand', coordinates: { lat: 22.8046, lng: 86.2029 }, region: 'East' },
      { city: 'Bhilai Nagar', state: 'Chhattisgarh', coordinates: { lat: 21.1938, lng: 81.3509 }, region: 'Central' },
      { city: 'Cuttack', state: 'Odisha', coordinates: { lat: 20.4625, lng: 85.8828 }, region: 'East' },
      { city: 'Firozabad', state: 'Uttar Pradesh', coordinates: { lat: 27.1592, lng: 78.3957 }, region: 'North' },
      { city: 'Kochi', state: 'Kerala', coordinates: { lat: 9.9312, lng: 76.2673 }, region: 'South' },
      { city: 'Bhavnagar', state: 'Gujarat', coordinates: { lat: 21.7645, lng: 72.1519 }, region: 'West' },
      { city: 'Dehradun', state: 'Uttarakhand', coordinates: { lat: 30.3165, lng: 78.0322 }, region: 'North' },
      { city: 'Durgapur', state: 'West Bengal', coordinates: { lat: 23.5204, lng: 87.3119 }, region: 'East' },
      { city: 'Asansol', state: 'West Bengal', coordinates: { lat: 23.6739, lng: 86.9524 }, region: 'East' },
      { city: 'Rourkela', state: 'Odisha', coordinates: { lat: 22.2604, lng: 84.8536 }, region: 'East' },
      { city: 'Nanded', state: 'Maharashtra', coordinates: { lat: 19.1383, lng: 77.3210 }, region: 'West' },
      { city: 'Kolhapur', state: 'Maharashtra', coordinates: { lat: 16.7050, lng: 74.2433 }, region: 'West' },
      { city: 'Ajmer', state: 'Rajasthan', coordinates: { lat: 26.4499, lng: 74.6399 }, region: 'North' },
      { city: 'Akola', state: 'Maharashtra', coordinates: { lat: 20.7002, lng: 77.0082 }, region: 'West' },
      { city: 'Gulbarga', state: 'Karnataka', coordinates: { lat: 17.3297, lng: 76.8343 }, region: 'South' },
      { city: 'Jamnagar', state: 'Gujarat', coordinates: { lat: 22.4707, lng: 70.0577 }, region: 'West' },
      { city: 'Ujjain', state: 'Madhya Pradesh', coordinates: { lat: 23.1765, lng: 75.7885 }, region: 'Central' },
      { city: 'Loni', state: 'Uttar Pradesh', coordinates: { lat: 28.7333, lng: 77.2833 }, region: 'North' },
      { city: 'Siliguri', state: 'West Bengal', coordinates: { lat: 26.7271, lng: 88.3953 }, region: 'East' },
      { city: 'Jhansi', state: 'Uttar Pradesh', coordinates: { lat: 25.4484, lng: 78.5685 }, region: 'North' },
      { city: 'Ulhasnagar', state: 'Maharashtra', coordinates: { lat: 19.2215, lng: 73.1645 }, region: 'West' },
      { city: 'Jammu', state: 'Jammu and Kashmir', coordinates: { lat: 32.7266, lng: 74.8570 }, region: 'North' },
      { city: 'Sangli-Miraj & Kupwad', state: 'Maharashtra', coordinates: { lat: 16.8524, lng: 74.5815 }, region: 'West' },
      { city: 'Mangalore', state: 'Karnataka', coordinates: { lat: 12.9141, lng: 74.8560 }, region: 'South' },
      { city: 'Erode', state: 'Tamil Nadu', coordinates: { lat: 11.3410, lng: 77.7172 }, region: 'South' },
      { city: 'Belgaum', state: 'Karnataka', coordinates: { lat: 15.8497, lng: 74.4977 }, region: 'South' },
      { city: 'Ambattur', state: 'Tamil Nadu', coordinates: { lat: 13.1143, lng: 80.1548 }, region: 'South' },
      { city: 'Tirunelveli', state: 'Tamil Nadu', coordinates: { lat: 8.7139, lng: 77.7567 }, region: 'South' },
      { city: 'Malegaon', state: 'Maharashtra', coordinates: { lat: 20.5579, lng: 74.5287 }, region: 'West' },
      { city: 'Gaya', state: 'Bihar', coordinates: { lat: 24.7914, lng: 85.0002 }, region: 'East' }
    ];
  }

  // Find nearby cities within specified radius
  findNearbyCities(alertCoordinates: LocationCoordinates, radiusKm: number = 50): LocationInfo[] {
    const cities = this.getMajorIndianCities();
    return cities.filter(city => {
      const distance = this.calculateDistance(alertCoordinates, city.coordinates);
      return distance <= radiusKm;
    });
  }

  // Get coordinates for a city name
  getCityCoordinates(cityName: string): LocationCoordinates | null {
    const cities = this.getMajorIndianCities();
    const city = cities.find(c => 
      c.city.toLowerCase().includes(cityName.toLowerCase()) ||
      cityName.toLowerCase().includes(c.city.toLowerCase())
    );
    return city ? city.coordinates : null;
  }

  // Determine alert zones based on distance
  getAlertZones(alertCoordinates: LocationCoordinates) {
    const cities = this.getMajorIndianCities();
    const zones = {
      immediate: [] as LocationInfo[], // 0-5km - Critical alerts
      nearby: [] as LocationInfo[],    // 5-25km - Warning alerts
      regional: [] as LocationInfo[]   // 25-100km - Info alerts
    };

    cities.forEach(city => {
      const distance = this.calculateDistance(alertCoordinates, city.coordinates);
      
      if (distance <= 5) {
        zones.immediate.push(city);
      } else if (distance <= 25) {
        zones.nearby.push(city);
      } else if (distance <= 100) {
        zones.regional.push(city);
      }
    });

    return zones;
  }

  // Parse location from alert text using NLP-like approach
  parseLocationFromAlert(alertText: string): LocationCoordinates | null {
    const cities = this.getMajorIndianCities();
    const states = indianStates;
    
    const text = alertText.toLowerCase();
    
    // First try to find city matches
    for (const city of cities) {
      if (text.includes(city.city.toLowerCase())) {
        return city.coordinates;
      }
    }
    
    // Then try state matches
    for (const state of states) {
      if (text.includes(state.name.toLowerCase())) {
        // Return approximate center coordinates for the state
        const stateCities = cities.filter(c => c.state === state.name);
        if (stateCities.length > 0) {
          // Return coordinates of the capital or major city
          const capital = stateCities.find(c => c.city === state.capital);
          return capital ? capital.coordinates : stateCities[0].coordinates;
        }
      }
    }
    
    return null;
  }
}

export default LocationService;