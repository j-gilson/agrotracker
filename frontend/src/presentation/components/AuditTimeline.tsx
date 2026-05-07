import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AuditLog } from '../../domain/audit/entities/AuditLog';
import { Card } from './Card';
import { theme } from '../../core/theme';
import { formatDate } from '../../core/utils/formatDate';
import { formatWeight } from '../../core/utils/formatWeight';

const actionLabel: Record<string, string> = {
  CREATE: 'Criou',
  UPDATE: 'Atualizou',
  DELETE: 'Removeu',
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  INVITE_USER: 'Convidou',
  ACCEPT_INVITE: 'Aceitou convite',
  CHANGE_ROLE: 'Alterou papel',
  TOGGLE_MEMBER: 'Alterou status',
  REMOVE_MEMBER: 'Removeu membro',
};

const actionColor: Record<string, string> = {
  CREATE: theme.colors.success,
  UPDATE: theme.colors.warning,
  DELETE: theme.colors.danger,
};

const translateField = (field: string): string => {
  const map: Record<string, string> = {
    nome: 'Nome',
    raca: 'Raça',
    idade: 'Idade',
    peso: 'Peso',
    fazendaId: 'Fazenda',
    localizacao: 'Localização',
    description: 'Descrição',
    type: 'Tipo',
    date: 'Data',
  };
  return map[field] ?? field;
};

const formatDateTime = (value: Date): string =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);

const formatChangeValue = (field: string, value: unknown): string => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  if (field === 'peso' && typeof value === 'number') {
    return formatWeight(value);
  }

  if (field === 'idade' && typeof value === 'number') {
    return `${value} meses`;
  }

  if (field === 'date' || field === 'dataNascimento') {
    const date = value instanceof Date ? value : new Date(String(value));
    if (!Number.isNaN(date.getTime())) {
      return formatDateTime(date);
    }
  }

  if (typeof value === 'boolean') {
    return value ? 'Sim' : 'Não';
  }

  return String(value);
};

export const AuditTimeline: React.FC<{ items: AuditLog[] }> = ({ items }) => {
  const grouped = useMemo(() => {
    const groups: Record<string, AuditLog[]> = {};
    for (const item of items) {
      const day = formatDate(item.timestamp);
      if (!groups[day]) groups[day] = [];
      groups[day].push(item);
    }
    return Object.entries(groups);
  }, [items]);

  return (
    <View style={styles.container}>
      {grouped.map(([day, logs]) => (
        <View key={day} style={styles.group}>
          <Text style={styles.groupTitle}>{day}</Text>
          {logs.map((log) => {
            const label = actionLabel[log.action] ?? log.action;
            const badgeColor = actionColor[log.action] ?? theme.colors.borderSoft;

            return (
              <Card key={log.id} marginBottom={theme.spacing.md} shadow={false} style={styles.card}>
                <View style={styles.header}>
                  <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                    <Text style={styles.badgeText}>{label}</Text>
                  </View>
                  <Text style={styles.time}>{formatDateTime(log.timestamp)}</Text>
                </View>

                <Text style={styles.description}>{log.description}</Text>

                <View style={styles.metaRow}>
                  <Text style={styles.meta}>Usuário: {log.userName}</Text>
                  {log.fazendaNome ? <Text style={styles.meta}>Fazenda: {log.fazendaNome}</Text> : null}
                </View>

                {log.changes && log.changes.length > 0 ? (
                  <View style={styles.changes}>
                    <Text style={styles.changesTitle}>Alterações</Text>
                    {log.changes.map((c, idx) => (
                      <View key={`${log.id}-change-${idx}`} style={styles.changeRow}>
                        <Text style={styles.changeField}>{translateField(c.field)}</Text>
                        <Text style={styles.changeValue} numberOfLines={2}>
                          {formatChangeValue(c.field, c.before)} → {formatChangeValue(c.field, c.after)}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </Card>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
  },
  group: {
    marginBottom: theme.spacing.lg,
  },
  groupTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  card: {
    borderColor: theme.colors.borderSoft,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.radius.pill,
  },
  badgeText: {
    color: theme.colors.textInverse,
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: theme.typography.fontSize.xs,
  },
  time: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.fontSize.xs,
  },
  description: {
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  meta: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.xs,
  },
  changes: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
  },
  changesTitle: {
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  changeRow: {
    marginBottom: theme.spacing.xs,
  },
  changeField: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  changeValue: {
    color: theme.colors.textSecondary,
  },
});
