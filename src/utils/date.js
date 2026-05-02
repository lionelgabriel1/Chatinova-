import { format, formatDistanceToNow, isAfter, isBefore, startOfDay, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

export const formatDate = (date) => {
  if (!date) return '---';
  return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
};

export const formatDateTime = (date) => {
  if (!date) return '---';
  return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: ptBR });
};

export const timeAgo = (date) => {
  if (!date) return '---';
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
};

export const isExpired = (date) => {
  if (!date) return false;
  return isBefore(new Date(date), startOfDay(new Date()));
};

export const isExpiringSoon = (date, days = 3) => {
  if (!date) return false;
  const expiryDate = new Date(date);
  const today = startOfDay(new Date());
  const limitDate = addDays(today, days);
  return isAfter(expiryDate, today) && isBefore(expiryDate, limitDate);
};
