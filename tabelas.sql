CREATE TABLE public.congresses (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      title text NOT NULL,
      slug text UNIQUE NOT NULL,
      subtitle text,
      date text,
      description text,
      colors jsonb,
      plans jsonb,
      faq jsonb,
      contact jsonb,
      "templateUrls" jsonb,
      "editalSections" jsonb,
      created_at timestamp with time zone DEFAULT now() NOT NULL,
      updated_at timestamp with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE public.congresses ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Enable read access for all users" ON public.congresses FOR SELECT USING (true);
  CREATE POLICY "Enable insert for authenticated users only" ON public.congresses FOR INSERT WITH CHECK
  (auth.role() = 'authenticated');
  CREATE POLICY "Enable update for authenticated users only" ON public.congresses FOR UPDATE USING
  (auth.role() = 'authenticated');
  CREATE POLICY "Enable delete for authenticated users only" ON public.congresses FOR DELETE USING
  (auth.role() = 'authenticated');

  -- Optional: Add a function to increment view count if you want to track page views
  -- This was in the original congress-sales-system but might not be needed for 'resumos'
  
  CREATE OR REPLACE FUNCTION increment_view_count(slug_text text)
  RETURNS void AS $$
  BEGIN
    INSERT INTO public.views (slug, count)
    VALUES (slug_text, 1)
    ON CONFLICT (slug) DO UPDATE
    SET count = views.count + 1;
  END;
  $$ LANGUAGE plpgsql;
  