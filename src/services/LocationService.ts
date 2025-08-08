export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

export interface LocationRiskAssessment {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  factors: string[];
  isKnownLocation: boolean;
  isHighRiskArea: boolean;
  distanceFromHome: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  isBusinessHours: boolean;
}

export interface GeofenceZone {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  radius: number; // in meters
  type: 'safe' | 'restricted' | 'high-risk' | 'business';
  alertLevel: 'none' | 'low' | 'medium' | 'high';
}

export class LocationService {
  private currentLocation: LocationData | null = null;
  private watchId: number | null = null;
  private locationHistory: LocationData[] = [];
  private knownLocations: LocationData[] = [];
  private geofenceZones: GeofenceZone[] = [];
  private locationCallbacks: ((location: LocationData) => void)[] = [];
  private riskCallbacks: ((risk: LocationRiskAssessment) => void)[] = [];

  constructor() {
    this.initializeGeofenceZones();
    this.loadKnownLocations();
  }

  private initializeGeofenceZones() {
    // Initialize some default geofence zones
    this.geofenceZones = [
      {
        id: 'home',
        name: 'Home Area',
        center: { lat: 28.6139, lng: 77.2090 }, // Delhi, India
        radius: 500,
        type: 'safe',
        alertLevel: 'none'
      },
      {
        id: 'office',
        name: 'Office District',
        center: { lat: 28.5355, lng: 77.3910 }, // Noida
        radius: 1000,
        type: 'business',
        alertLevel: 'low'
      },
      {
        id: 'airport',
        name: 'Airport Area',
        center: { lat: 28.5562, lng: 77.1000 }, // IGI Airport
        radius: 2000,
        type: 'restricted',
        alertLevel: 'medium'
      },
      {
        id: 'high-crime',
        name: 'High Crime Area',
        center: { lat: 28.6500, lng: 77.2300 },
        radius: 800,
        type: 'high-risk',
        alertLevel: 'high'
      }
    ];
  }

  private loadKnownLocations() {
    // Load known safe locations from localStorage or API
    const stored = localStorage.getItem('knownLocations');
    if (stored) {
      try {
        this.knownLocations = JSON.parse(stored);
      } catch (error) {
        console.error('Failed to load known locations:', error);
      }
    }
  }

  private saveKnownLocations() {
    try {
      localStorage.setItem('knownLocations', JSON.stringify(this.knownLocations));
    } catch (error) {
      console.error('Failed to save known locations:', error);
    }
  }

  async getCurrentLocation(options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000
  }): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude || undefined,
            altitudeAccuracy: position.coords.altitudeAccuracy || undefined,
            heading: position.coords.heading || undefined,
            speed: position.coords.speed || undefined,
            timestamp: position.timestamp
          };

          this.currentLocation = location;
          this.addToHistory(location);
          this.notifyLocationCallbacks(location);
          this.assessLocationRisk(location);
          
          resolve(location);
        },
        (error) => {
          let errorMessage = 'Unknown location error';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          reject(new Error(errorMessage));
        },
        options
      );
    });
  }

  startLocationTracking(options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 30000
  }): void {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by this browser');
    }

    if (this.watchId !== null) {
      this.stopLocationTracking();
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude || undefined,
          altitudeAccuracy: position.coords.altitudeAccuracy || undefined,
          heading: position.coords.heading || undefined,
          speed: position.coords.speed || undefined,
          timestamp: position.timestamp
        };

        this.currentLocation = location;
        this.addToHistory(location);
        this.notifyLocationCallbacks(location);
        this.assessLocationRisk(location);
      },
      (error) => {
        console.error('Location tracking error:', error);
      },
      options
    );
  }

  stopLocationTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  private addToHistory(location: LocationData): void {
    this.locationHistory.push(location);
    
    // Keep only last 100 locations
    if (this.locationHistory.length > 100) {
      this.locationHistory = this.locationHistory.slice(-100);
    }
  }

  private notifyLocationCallbacks(location: LocationData): void {
    this.locationCallbacks.forEach(callback => {
      try {
        callback(location);
      } catch (error) {
        console.error('Location callback error:', error);
      }
    });
  }

  private assessLocationRisk(location: LocationData): void {
    const risk = this.calculateLocationRisk(location);
    this.riskCallbacks.forEach(callback => {
      try {
        callback(risk);
      } catch (error) {
        console.error('Risk callback error:', error);
      }
    });
  }

  calculateLocationRisk(location: LocationData): LocationRiskAssessment {
    let riskScore = 0;
    const factors: string[] = [];
    
    // Check if location is known/trusted
    const isKnownLocation = this.isKnownLocation(location);
    if (!isKnownLocation) {
      riskScore += 20;
      factors.push('Unknown location');
    }

    // Check geofence zones
    const currentZone = this.getCurrentGeofenceZone(location);
    let isHighRiskArea = false;
    
    if (currentZone) {
      switch (currentZone.type) {
        case 'high-risk':
          riskScore += 40;
          isHighRiskArea = true;
          factors.push(`High-risk area: ${currentZone.name}`);
          break;
        case 'restricted':
          riskScore += 25;
          factors.push(`Restricted area: ${currentZone.name}`);
          break;
        case 'business':
          riskScore += 5;
          factors.push(`Business area: ${currentZone.name}`);
          break;
        case 'safe':
          riskScore -= 10;
          break;
      }
    }

    // Time-based risk assessment
    const now = new Date();
    const hour = now.getHours();
    let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    let isBusinessHours = false;

    if (hour >= 6 && hour < 12) {
      timeOfDay = 'morning';
      isBusinessHours = hour >= 9;
    } else if (hour >= 12 && hour < 18) {
      timeOfDay = 'afternoon';
      isBusinessHours = true;
    } else if (hour >= 18 && hour < 22) {
      timeOfDay = 'evening';
      isBusinessHours = hour < 18;
    } else {
      timeOfDay = 'night';
      riskScore += 15;
      factors.push('Late night activity');
    }

    if (!isBusinessHours && currentZone?.type === 'business') {
      riskScore += 10;
      factors.push('Business area access outside hours');
    }

    // Distance from home/known locations
    const distanceFromHome = this.getDistanceFromKnownLocations(location);
    if (distanceFromHome > 50000) { // 50km
      riskScore += 20;
      factors.push('Far from known locations');
    } else if (distanceFromHome > 20000) { // 20km
      riskScore += 10;
      factors.push('Moderate distance from known locations');
    }

    // Movement pattern analysis
    if (this.locationHistory.length > 1) {
      const recentMovement = this.analyzeMovementPattern();
      if (recentMovement.isErratic) {
        riskScore += 15;
        factors.push('Erratic movement pattern');
      }
      if (recentMovement.speed > 120) { // km/h
        riskScore += 10;
        factors.push('High-speed movement');
      }
    }

    // Location accuracy
    if (location.accuracy > 100) {
      riskScore += 5;
      factors.push('Low location accuracy');
    }

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (riskScore < 20) riskLevel = 'low';
    else if (riskScore < 40) riskLevel = 'medium';
    else if (riskScore < 70) riskLevel = 'high';
    else riskLevel = 'critical';

    return {
      riskLevel,
      riskScore: Math.min(100, Math.max(0, riskScore)),
      factors,
      isKnownLocation,
      isHighRiskArea,
      distanceFromHome,
      timeOfDay,
      isBusinessHours
    };
  }

  private isKnownLocation(location: LocationData, threshold: number = 200): boolean {
    return this.knownLocations.some(known => 
      this.calculateDistance(location, known) < threshold
    );
  }

  private getCurrentGeofenceZone(location: LocationData): GeofenceZone | null {
    for (const zone of this.geofenceZones) {
      const distance = this.calculateDistance(
        location,
        { latitude: zone.center.lat, longitude: zone.center.lng, accuracy: 0, timestamp: 0 }
      );
      if (distance <= zone.radius) {
        return zone;
      }
    }
    return null;
  }

  private getDistanceFromKnownLocations(location: LocationData): number {
    if (this.knownLocations.length === 0) return Infinity;
    
    return Math.min(...this.knownLocations.map(known => 
      this.calculateDistance(location, known)
    ));
  }

  private analyzeMovementPattern(): { isErratic: boolean; speed: number } {
    if (this.locationHistory.length < 3) {
      return { isErratic: false, speed: 0 };
    }

    const recent = this.locationHistory.slice(-5);
    let totalDistance = 0;
    let totalTime = 0;
    let directionChanges = 0;

    for (let i = 1; i < recent.length; i++) {
      const distance = this.calculateDistance(recent[i-1], recent[i]);
      const time = (recent[i].timestamp - recent[i-1].timestamp) / 1000; // seconds
      
      totalDistance += distance;
      totalTime += time;

      // Check for direction changes
      if (i > 1) {
        const bearing1 = this.calculateBearing(recent[i-2], recent[i-1]);
        const bearing2 = this.calculateBearing(recent[i-1], recent[i]);
        const angleDiff = Math.abs(bearing1 - bearing2);
        
        if (angleDiff > 45 && angleDiff < 315) {
          directionChanges++;
        }
      }
    }

    const averageSpeed = totalTime > 0 ? (totalDistance / totalTime) * 3.6 : 0; // km/h
    const isErratic = directionChanges > recent.length * 0.6;

    return { isErratic, speed: averageSpeed };
  }

  calculateDistance(loc1: LocationData, loc2: LocationData): number {
    const R = 6371000; // Earth's radius in meters
    const lat1Rad = (loc1.latitude * Math.PI) / 180;
    const lat2Rad = (loc2.latitude * Math.PI) / 180;
    const deltaLatRad = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
    const deltaLngRad = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;

    const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  private calculateBearing(loc1: LocationData, loc2: LocationData): number {
    const lat1Rad = (loc1.latitude * Math.PI) / 180;
    const lat2Rad = (loc2.latitude * Math.PI) / 180;
    const deltaLngRad = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;

    const y = Math.sin(deltaLngRad) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
              Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLngRad);

    const bearing = Math.atan2(y, x);
    return ((bearing * 180) / Math.PI + 360) % 360;
  }

  addKnownLocation(location: LocationData, name?: string): void {
    this.knownLocations.push(location);
    this.saveKnownLocations();
  }

  addGeofenceZone(zone: GeofenceZone): void {
    this.geofenceZones.push(zone);
  }

  removeGeofenceZone(zoneId: string): void {
    this.geofenceZones = this.geofenceZones.filter(zone => zone.id !== zoneId);
  }

  onLocationUpdate(callback: (location: LocationData) => void): void {
    this.locationCallbacks.push(callback);
  }

  onRiskUpdate(callback: (risk: LocationRiskAssessment) => void): void {
    this.riskCallbacks.push(callback);
  }

  removeLocationCallback(callback: (location: LocationData) => void): void {
    const index = this.locationCallbacks.indexOf(callback);
    if (index > -1) {
      this.locationCallbacks.splice(index, 1);
    }
  }

  removeRiskCallback(callback: (risk: LocationRiskAssessment) => void): void {
    const index = this.riskCallbacks.indexOf(callback);
    if (index > -1) {
      this.riskCallbacks.splice(index, 1);
    }
  }

  getCurrentLocationData(): LocationData | null {
    return this.currentLocation;
  }

  getLocationHistory(): LocationData[] {
    return [...this.locationHistory];
  }

  getGeofenceZones(): GeofenceZone[] {
    return [...this.geofenceZones];
  }

  getKnownLocations(): LocationData[] {
    return [...this.knownLocations];
  }
}

export const locationService = new LocationService();
