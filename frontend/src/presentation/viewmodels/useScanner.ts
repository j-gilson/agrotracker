import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
import { router } from 'expo-router';
import { AppRoutes } from '../../core/routes/AppRoutes';
import { AnimalRepositoryImpl } from '../../data/repositories/AnimalRepositoryImpl';
import { GetAnimalByCodigo } from '../../domain/usecases/animal/GetAnimalByCodigo';
import { humanizeError } from '../../core/utils/humanizeError';

export type ScannerStatus =
  | 'aguardando'
  | 'consultando'
  | 'encontrado'
  | 'naoEncontrado'
  | 'erro';

export const useScanner = (fazendaId: string | null) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [status, setStatus] = useState<ScannerStatus>('aguardando');
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [codigoIdentificacao, setCodigoIdentificacao] = useState('');
  const [error, setError] = useState<string | null>(null);
  const scanLockRef = useRef(false);

  const getAnimalByCodigo = useMemo(
    () => new GetAnimalByCodigo(new AnimalRepositoryImpl()),
    []
  );

  const requestPermission = useCallback(() => {
    return Camera.requestCameraPermissionsAsync()
      .then(({ status: permissionStatus }) => {
        setHasPermission(permissionStatus === 'granted');
      })
      .catch(() => {
        setHasPermission(false);
      });
  }, []);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const resetScanner = useCallback(() => {
    scanLockRef.current = false;
    setStatus('aguardando');
    setCodigoIdentificacao('');
    setError(null);
  }, []);

  const identifyAnimalByCode = useCallback(
    async (rawCode: string) => {
      const code = rawCode.trim();
      if (!code) return;

      if (!fazendaId) {
        setStatus('erro');
        setError('Selecione uma fazenda antes de identificar o animal.');
        return;
      }

      scanLockRef.current = true;
      setStatus('consultando');
      setCodigoIdentificacao(code);
      setError(null);

      try {
        const animal = await getAnimalByCodigo.execute(fazendaId, code);

        if (animal) {
          setStatus('encontrado');
          router.push(AppRoutes.ANIMAL_DETAIL(animal.id));
          return;
        }

        setStatus('naoEncontrado');
      } catch (err: unknown) {
        setStatus('erro');
        setError(
          humanizeError(err, 'Não foi possível consultar o número identificador informado.')
        );
      }
    },
    [fazendaId, getAnimalByCodigo]
  );

  const handleBarCodeScanned = useCallback(
    async ({ data }: { type: string; data: string }) => {
      if (scanLockRef.current || status !== 'aguardando') return;

      await identifyAnimalByCode(data);
    },
    [identifyAnimalByCode, status]
  );

  const searchByIdentifier = useCallback(
    async (code: string) => {
      if (status === 'consultando' || status === 'encontrado') return;

      scanLockRef.current = false;
      await identifyAnimalByCode(code);
    },
    [identifyAnimalByCode, status]
  );

  const openAnimalRegistration = useCallback(() => {
    if (status !== 'naoEncontrado' || !fazendaId || !codigoIdentificacao) {
      return;
    }

    router.push(
      AppRoutes.CREATE_ANIMAL_WITH_CODE(fazendaId, codigoIdentificacao)
    );
  }, [codigoIdentificacao, fazendaId, status]);

  return {
    hasPermission,
    requestPermission,
    status,
    isFlashlightOn,
    codigoIdentificacao,
    error,
    handleBarCodeScanned,
    searchByIdentifier,
    openAnimalRegistration,
    toggleFlashlight: () => setIsFlashlightOn((current) => !current),
    resetScanner,
  };
};
