import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { CameraView } from 'expo-camera';
import { useScanner } from '../viewmodels/useScanner';
import { router } from 'expo-router';
import { Button, ErrorState, Loading } from '../components';
import { theme } from '../../core/theme';

export const ScannerScreen: React.FC = () => {
  const {
    hasPermission,
    scanned,
    isFlashlightOn,
    handleBarCodeScanned,
    toggleFlashlight,
    resetScanner,
  } = useScanner();

  if (hasPermission === null) {
    return <Loading text="Solicitando permissão para a câmera..." />;
  }

  if (hasPermission === false) {
    return (
      <ErrorState message="Sem acesso à câmera." onRetry={() => router.back()} retryText="Voltar" />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </Pressable>
        <Text style={styles.title}>Escanear Brinco</Text>
        <Pressable onPress={toggleFlashlight} style={styles.flashButton}>
          <Text style={styles.flashButtonText}>{isFlashlightOn ? '🔦 On' : '🔦 Off'}</Text>
        </Pressable>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          enableTorch={isFlashlightOn}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea} />
            <Text style={styles.scanText}>
              Posicione o QR Code ou Barcode dentro do quadrado
            </Text>
          </View>
        </CameraView>
      </View>

      <View style={styles.footer}>
        {scanned && (
          <Button onPress={resetScanner} style={styles.resetButton} title="Escanear Novamente" />
        )}
        <Text style={styles.footerHint}>
          O scanner identifica automaticamente brincos de identificação animal.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.overlay,
    zIndex: 10,
  },
  title: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  closeButtonText: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.fontSize.xxl,
  },
  flashButton: {
    padding: theme.spacing.xs,
    backgroundColor: theme.colors.overlaySoft,
    borderRadius: theme.radius.sm,
  },
  flashButtonText: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.fontSize.sm,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: theme.sizes.scanArea,
    height: theme.sizes.scanArea,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.transparent,
    borderRadius: theme.radius.md,
  },
  scanText: {
    color: theme.colors.textInverse,
    marginTop: theme.spacing.xl,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xxxl,
    fontSize: theme.typography.fontSize.md,
  },
  footer: {
    padding: theme.spacing.xxl,
    alignItems: 'center',
    backgroundColor: theme.colors.overlay,
  },
  resetButton: {
    marginBottom: theme.spacing.md,
  },
  footerHint: {
    color: theme.colors.textMuted,
    textAlign: 'center',
    fontSize: theme.typography.fontSize.xs,
  },
});
