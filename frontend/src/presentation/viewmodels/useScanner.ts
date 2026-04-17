import { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import { router } from 'expo-router';
import { AppRoutes } from '../../core/routes/AppRoutes';

export const useScanner = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    // Em um cenário real, poderíamos validar se o QR code é de um animal
    // Por enquanto, apenas redirecionamos para a ficha do animal com esse ID
    router.push(AppRoutes.ANIMAL_DETAIL(data));
  };

  const toggleFlashlight = () => {
    setIsFlashlightOn(!isFlashlightOn);
  };

  const resetScanner = () => {
    setScanned(false);
  };

  return {
    hasPermission,
    scanned,
    isFlashlightOn,
    handleBarCodeScanned,
    toggleFlashlight,
    resetScanner,
  };
};
