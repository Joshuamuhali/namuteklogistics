ALTER TABLE public.quote_requests DROP CONSTRAINT IF EXISTS quote_requests_service_type_check;
ALTER TABLE public.quote_requests ADD CONSTRAINT quote_requests_service_type_check CHECK (service_type IN ('freight','haulage','logistics','construction','civil','plant'));
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS estimate_min NUMERIC;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS estimate_max NUMERIC;