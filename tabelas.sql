-- Tabela para contagem de visualizações dos congressos
CREATE TABLE public.congress_views (
  congress_slug TEXT PRIMARY KEY,
  view_count BIGINT DEFAULT 1 NOT NULL
);

-- Tabela para contagem de cliques no botão de inscrição
CREATE TABLE public.congress_registration_clicks (
  congress_slug TEXT PRIMARY KEY,
  click_count BIGINT DEFAULT 1 NOT NULL
);

-- Função para incrementar a contagem de visualizações
CREATE OR REPLACE FUNCTION increment_view_count(slug_text TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.congress_views (congress_slug, view_count)
  VALUES (slug_text, 1)
  ON CONFLICT (congress_slug)
  DO UPDATE SET view_count = congress_views.view_count + 1;
END;
$$ LANGUAGE plpgsql;

-- Função para incrementar a contagem de cliques
CREATE OR REPLACE FUNCTION increment_click_count(slug TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.congress_registration_clicks (congress_slug, click_count)
  VALUES (slug, 1)
  ON CONFLICT (congress_slug)
  DO UPDATE SET click_count = congress_registration_clicks.click_count + 1;
END;
$$ LANGUAGE plpgsql;