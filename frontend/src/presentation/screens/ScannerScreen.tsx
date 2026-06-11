import React, { useCallback, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
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
import { theme } from '../../core/theme';

const { colors, radius, spacing, typography } = theme;

export function ScannerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    fazendaId?: string | string[];
  }>();
  const initialFazendaId = Array.isArray(params.fazendaId)
    ? params.fazendaId[0] ?? ''
    : params.fazendaId ?? '';
  const hasFocusedOnce = useRef(false);
  const {
    hasPermission,
    requestPermission,
    status,
    codigoIdentificacao,
    fazendas,
    selectedFazendaId,
    setSelectedFazendaId,
    error,
    isFlashlightOn,
    toggleFlashlight,
    handleBarCodeScanned,
    resetScanner,
    openAnimalRegistration,
  } = useScanner(initialFazendaId);

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

  const hasFazendas = fazendas.length > 0;
  const canScan =
    hasFazendas &&
    Boolean(selectedFazendaId) &&
    status === 'aguardando';

  return (
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
          disabled={!hasFazendas}
        />
      </View>

      {!hasFazendas ? (
        <Card style={styles.emptyCard}>
          <EmptyState
            title="Nenhuma fazenda disponível"
            subtitle="É necessário ter acesso a uma fazenda antes de consultar animais pelo scanner."
            buttonText="Voltar"
            onPress={() => router.back()}
          />
        </Card>
      ) : (
        <>
          <Card>
            <Text style={styles.sectionTitle}>Fazenda atual</Text>
            <Text style={styles.sectionHint}>
              Selecione explicitamente onde o animal será consultado.
            </Text>
            <View style={styles.farmList}>
              {fazendas.map((fazenda) => {
                const fazendaId = fazenda.id;
                if (!fazendaId) return null;

                const selected = selectedFazendaId === fazendaId;

                return (
                  <Button
                    key={fazendaId}
                    title={fazenda.nome}
                    variant={selected ? 'primary' : 'secondary'}
                    onPress={() => setSelectedFazendaId(fazendaId)}
                  />
                );
              })}
            </View>
          </Card>

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

          {!selectedFazendaId && status === 'aguardando' ? (
            <Card>
              <View style={styles.inlineMessage}>
                <Ionicons
                  name="business-outline"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.messageText}>
                  Selecione uma fazenda para iniciar a leitura.
                </Text>
              </View>
            </Card>
          ) : null}

          {selectedFazendaId && status === 'aguardando' ? (
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
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  sectionHint: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  farmList: {
    gap: spacing.sm,
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
  emptyCard: {
    flex: 1,
    justifyContent: 'center',
  },
});
