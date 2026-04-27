import { supabase } from '@/integrations/supabase/client';

export const BD_ROLE = 'bd';
export const BD_ALLOWED_PATH = '/customers';

export async function getCurrentUserRoles() {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role');

  if (error) {
    console.error('Error loading user roles:', error);
    return [];
  }

  return (data ?? []).map((item) => String(item.role));
}

export function isBdUser(roles: string[]) {
  return roles.includes(BD_ROLE);
}