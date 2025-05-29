import axios from 'axios';

class GeocodingService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async geocodeAddress(address: string) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`;
    try {
      const response = await axios.get(url);
      if (response.data.status === 'OK') {
        return response.data.results; // Retorna todos os resultados
      } else {
        throw new Error(response.data.error_message || 'Geocoding failed');
      }
    } catch (error: any) {
      throw new Error(`Error fetching geocoding data: ${error.message}`);
    }
  }

  async reverseGeocode(lat: number, lng: number) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`;
    try {
      const response = await axios.get(url);
      if (response.data.status === 'OK') {
        return response.data.results[0].formatted_address;
      } else {
        throw new Error(response.data.error_message || 'Reverse geocoding failed');
      }
    } catch (error: any) {
      throw new Error(`Error fetching reverse geocoding data: ${error.message}`);
    }
  }
}

export default GeocodingService;