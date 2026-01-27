import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'La geolocalización no está soportada en este navegador',
        loading: false,
      }));
      return;
    }

    const success = (position: GeolocationPosition) => {
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        error: null,
        loading: false,
      });
    };

    const error = (error: GeolocationPositionError) => {
      let errorMessage = 'Error desconocido al obtener la ubicación';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Permiso denegado para acceder a la ubicación';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'La información de ubicación no está disponible';
          break;
        case error.TIMEOUT:
          errorMessage = 'Tiempo de espera agotado para obtener la ubicación';
          break;
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
  }, []);

  const requestLocation = () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'La geolocalización no está soportada en este navegador',
        loading: false,
      }));
      return;
    }

    const success = (position: GeolocationPosition) => {
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        error: null,
        loading: false,
      });
    };

    const error = (error: GeolocationPositionError) => {
      let errorMessage = 'Error desconocido al obtener la ubicación';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Permiso denegado para acceder a la ubicación';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'La información de ubicación no está disponible';
          break;
        case error.TIMEOUT:
          errorMessage = 'Tiempo de espera agotado para obtener la ubicación';
          break;
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
  };

  return {
    ...state,
    requestLocation,
  };
};

