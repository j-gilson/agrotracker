import React, { useCallback, useRef } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Platform, StatusBar } from 'react-native';
import { CameraView } from 'expo-camera';
import {
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Loading,
} from '../components';
import { useScanner } from '../viewmodels/useScanner';
import { useActiveFarm } from '../contexts/ActiveFarmContext';
import { theme } from '../../core/theme';

const SAFE_TOP = Platform.select({ android: (StatusBar.currentHeight ?? 24), default: 0 });

const { colors, radius, spacing, typography } = theme;

export function ScannerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    fazendaId?: string | string[];
  }>();
  const routeFazendaId = Array.isArray(params.fazendaId)
    ? params.fazendaId[0] ?? ''
    : params.fazendaId ?? '';

  const { farms, activeFarmId, loading: farmsLoading } = useActiveFarm();
  const fazendaId = routeFazendaId || activeFarmId || null;

  const hasFocusedOnce = useRef(false);
  const {
    hasPermission,
    requestPermission,
    status,
    codigoIdentificacao,
    error,
    isFlashlightOn,
    toggleFlashlight,
    handleBarCodeScanned,
    resetScanner,
    openAnimalRegistration,
  } = useScanner(fazendaId);

  useFocusEffect(
    useCallback(() => {
      if (!hasFocusedOnce.current) {
        hasFocusedOnce.current = true;
        return;
      }

      resetScanner();
    }, [resetScanner]),
  );

  if (hasPermission === null) {
    return <Loading text="Verificando permissão da câmera..." />;
  }

  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <EmptyState
          title="Permissão da câmera necessária"
          subtitle="Autorize o uso da câmera para ler o QR Code de identificação do animal."
          buttonText="Permitir acesso"
          onPress={requestPermission}
        />
      </View>
    );
  }

  if (farmsLoading) {
    return <Loading text="Carregando..." />;
  }

  if (!fazendaId) {
    const noFarms = farms.length === 0;
    return (
      <View style={styles.centered}>
        <EmptyState
          title={
            noFarms
              ? 'Nenhuma fazenda disponível'
              : 'Nenhuma fazenda selecionada'
          }
          subtitle={
            noFarms
              ? 'É necessário ter acesso a uma fazenda antes de consultar animais pelo scanner.'
              : 'Selecione uma fazenda na tela inicial para começar a escanear.'
          }
          buttonText="Voltar"
          onPress={() => router.back()}
        />
      </View>
    );
  }

  const canScan = status === 'aguardando';

  return (
    <SafeAreaView style={[styles.safeContainer, { paddingTop: SAFE_TOP }]}>
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Scanner</Text>
          <Text style={styles.subtitle}>
            Leia o código de identificação do animal
          </Text>
        </View>
        <Button
          title={isFlashlightOn ? 'Desligar flash' : 'Ligar flash'}
          variant="secondary"
          onPress={toggleFlashlight}
        />
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          enableTorch={isFlashlightOn}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={canScan ? handleBarCodeScanned : undefined}
        />
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
        </View>
      </View>

      {status === 'aguardando' ? (
        <Card>
          <View style={styles.inlineMessage}>
            <Ionicons
              name="qr-code-outline"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.messageText}>
              Posicione o QR Code dentro da área indicada.
            </Text>
          </View>
        </Card>
      ) : null}

      {status === 'consultando' ? (
        <Loading text="Consultando animal..." />
      ) : null}

      {status === 'encontrado' ? (
        <Loading text="Animal encontrado. Abrindo ficha..." />
      ) : null}

      {status === 'naoEncontrado' ? (
        <Card>
          <View style={styles.result}>
            <Ionicons
              name="alert-circle-outline"
              size={40}
              color={colors.warning}
            />
            <Text style={styles.resultTitle}>Animal não cadastrado</Text>
            <Text style={styles.resultText}>
              Código lido: {codigoIdentificacao}
            </Text>
            <Button
              title="Cadastrar Animal"
              onPress={openAnimalRegistration}
              fullWidth
            />
            <Button
              title="Escanear novamente"
              variant="secondary"
              onPress={resetScanner}
              fullWidth
            />
          </View>
        </Card>
      ) : null}

      {status === 'erro' ? (
        <ErrorState
          message={error ?? 'Não foi possível consultar o animal.'}
          retryText="Escanear novamente"
          onRetry={resetScanner}
        />
      ) : null}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    gap: spacing.lg,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.display,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  cameraContainer: {
    minHeight: 380,
    overflow: 'hidden',
    borderRadius: radius.lg,
    backgroundColor: colors.black,
  },
  camera: {
    flex: 1,
    minHeight: 380,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    width: 230,
    height: 230,
    borderWidth: 3,
    borderColor: colors.white,
    borderRadius: radius.md,
  },
  inlineMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  messageText: {
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
    flex: 1,
  },
  result: {
    alignItems: 'center',
    gap: spacing.md,
  },
  resultTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  resultText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
