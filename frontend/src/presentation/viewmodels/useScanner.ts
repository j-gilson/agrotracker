import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
import { router } from 'expo-router';
import { AppRoutes } from '../../core/routes/AppRoutes';
import { Fazenda } from '../../domain/fazenda/entities/Fazenda';
import { GetFazendas } from '../../domain/fazenda/usecases/GetFazendas';
import { FazendaRepositoryImpl } from '../../data/fazenda/repositories/FazendaRepositoryImpl';
import { AnimalRepositoryImpl } from '../../data/repositories/AnimalRepositoryImpl';
import { GetAnimalByCodigo } from '../../domain/usecases/animal/GetAnimalByCodigo';
import { humanizeError } from '../../core/utils/humanizeError';

export type ScannerStatus =
  | 'aguardando'
  | 'consultando'
  | 'encontrado'
  | 'naoEncontrado'
  | 'erro';

export const useScanner = (initialFazendaId = '') => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [status, setStatus] = useState<ScannerStatus>('aguardando');
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const [selectedFazendaId, setSelectedFazendaIdState] = useState(
    initialFazendaId.trim()
  );
  const [codigoIdentificacao, setCodigoIdentificacao] = useState('');
  const [error, setError] = useState<string | null>(null);
  const scanLockRef = useRef(false);

  const getFazendas = useMemo(
    () => new GetFazendas(new FazendaRepositoryImpl()),
    []
  );
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

  useEffect(() => {
    getFazendas
      .execute()
      .then(setFazendas)
      .catch((err: unknown) => {
        setStatus('erro');
        setError(humanizeError(err, 'Nao foi possivel carregar as fazendas.'));
      });
  }, [getFazendas]);

  const resetScanner = useCallback(() => {
    scanLockRef.current = false;
    setStatus('aguardando');
    setCodigoIdentificacao('');
    setError(null);
  }, []);

  const setSelectedFazendaId = useCallback(
    (fazendaId: string) => {
      setSelectedFazendaIdState(fazendaId);
      resetScanner();
    },
    [resetScanner]
  );

  const handleBarCodeScanned = useCallback(
    async ({ data }: { type: string; data: string }) => {
      if (scanLockRef.current || status !== 'aguardando') return;

      const code = data.trim();
      if (!code) return;
      if (!selectedFazendaId) {
        setStatus('erro');
        setError('Selecione uma fazenda antes de escanear.');
        return;
      }

      scanLockRef.current = true;
      setStatus('consultando');
      setCodigoIdentificacao(code);
      setError(null);

      try {
        const animal = await getAnimalByCodigo.execute(selectedFazendaId, code);

        if (animal) {
          setStatus('encontrado');
          router.push(AppRoutes.ANIMAL_DETAIL(animal.id));
          return;
        }

        setStatus('naoEncontrado');
      } catch (err: unknown) {
        setStatus('erro');
        setError(
          humanizeError(err, 'Nao foi possivel consultar o codigo escaneado.')
        );
      }
    },
    [getAnimalByCodigo, selectedFazendaId, status]
  );

  const openAnimalRegistration = useCallback(() => {
    if (
      status !== 'naoEncontrado' ||
      !selectedFazendaId ||
      !codigoIdentificacao
    ) {
      return;
    }

    router.push(
      AppRoutes.CREATE_ANIMAL_WITH_CODE(
        selectedFazendaId,
        codigoIdentificacao
      )
    );
  }, [codigoIdentificacao, selectedFazendaId, status]);

  return {
    hasPermission,
    requestPermission,
    status,
    isFlashlightOn,
    fazendas,
    selectedFazendaId,
    codigoIdentificacao,
    error,
    setSelectedFazendaId,
    handleBarCodeScanned,
    openAnimalRegistration,
    toggleFlashlight: () => setIsFlashlightOn((current) => !current),
    resetScanner,
  };
};
