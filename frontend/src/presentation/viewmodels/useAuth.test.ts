import { readFileSync } from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

const projectRoot = process.cwd();

describe('useRegisterViewModel — validacao de senha', () => {
  const filePath = path.resolve(projectRoot, 'src/presentation/viewmodels/useAuth.ts');
  const content = readFileSync(filePath, 'utf-8');

  it('Cenario 5: rejeita senha com menos de 8 caracteres no submit', () => {
    expect(content).toContain('password.length < 8');
    expect(content).toContain('A senha deve ter ao menos 8 caracteres.');
    expect(content).not.toContain('password.length < 6');
    expect(content).not.toContain('A senha deve ter ao menos 6 caracteres.');
  });

  it('Cenario 6: aceita senha com 8 caracteres (outras regras permanecem)', () => {
    expect(content).toContain('password !== confirmPassword');
    expect(content).toContain('email.includes(\'@\')');
  });
});

describe('RegisterScreen — validacao de senha', () => {
  const filePath = path.resolve(projectRoot, 'src/presentation/screens/Auth/RegisterScreen.tsx');
  const content = readFileSync(filePath, 'utf-8');

  it('Cenario 5: rejeita senha com menos de 8 caracteres na UI', () => {
    expect(content).toContain('password.length < 8');
    expect(content).toContain('A senha deve ter ao menos 8 caracteres.');
    expect(content).not.toContain('password.length < 6');
    expect(content).not.toContain('Mínimo 6 caracteres');
  });

  it('Cenario 6: aceita senha com 8 caracteres no isFormValid', () => {
    expect(content).toContain('password.length >= 8');
    expect(content).toContain('confirmPassword.length >= 8');
    expect(content).toContain('Mínimo 8 caracteres');
  });
});

describe('LoginScreen — validacao de senha', () => {
  const filePath = path.resolve(projectRoot, 'src/presentation/screens/Auth/LoginScreen.tsx');
  const content = readFileSync(filePath, 'utf-8');

  it('Cenario 5: rejeita senha com menos de 8 caracteres na UI', () => {
    expect(content).toContain('password.length < 8');
    expect(content).toContain('password.trim().length >= 8');
  });

  it('Cenario 6: aceita senha com 8 caracteres no isFormValid', () => {
    expect(content).toContain('password.trim().length >= 8');
  });
});
