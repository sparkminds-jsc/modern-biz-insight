ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'bd';

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.email)
  );

  IF new.email = 'hr@sparkminds.net' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'admin');
  ELSIF new.email = 'bd1@sparkminds.net' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'bd');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'employee');
  END IF;

  RETURN new;
END;
$function$;