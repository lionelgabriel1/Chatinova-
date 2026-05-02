import { useEffect, useState } from 'react';

const SIDEBAR_COLLAPSED_KEY = 'sidebar_collapsed';

export function useSidebarCollapse() {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
  }, [collapsed]);

  return [collapsed, setCollapsed];
}

