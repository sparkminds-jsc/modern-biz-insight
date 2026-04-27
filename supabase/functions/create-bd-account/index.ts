import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: 'Missing Supabase service configuration' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const email = 'bd1@sparkminds.net';
  const password = 'bd1@123456';

  const { data: existingUsers, error: listError } = await admin.auth.admin.listUsers();
  if (listError) {
    return new Response(JSON.stringify({ error: listError.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const existingUser = existingUsers.users.find((user) => user.email === email);
  const userResult = existingUser
    ? await admin.auth.admin.updateUserById(existingUser.id, { password, email_confirm: true })
    : await admin.auth.admin.createUser({ email, password, email_confirm: true });

  if (userResult.error || !userResult.data.user) {
    return new Response(JSON.stringify({ error: userResult.error?.message ?? 'Unable to create user' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const userId = userResult.data.user.id;

  const { error: profileError } = await admin
    .from('profiles')
    .upsert({ id: userId, email, full_name: 'BD 1' }, { onConflict: 'id' });

  if (profileError) {
    return new Response(JSON.stringify({ error: profileError.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { error: roleError } = await admin
    .from('user_roles')
    .upsert({ user_id: userId, role: 'bd' }, { onConflict: 'user_id,role' });

  if (roleError) {
    return new Response(JSON.stringify({ error: roleError.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true, email, role: 'bd' }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
