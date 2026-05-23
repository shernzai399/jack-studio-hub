insert into public.stores (code, name, is_service_center)
values
  ('ABT', 'Aeon Bukit Tinggi', false),
  ('PDM', 'Paradigm Mall', false),
  ('MNP', 'Main Place', false),
  ('APJ', 'Aeon Permas Jaya', false),
  ('AS2', 'Aeon Seremban 2', false),
  ('ABI', 'Aeon Bukit Indah', false),
  ('AWM', 'Aeon Wangsa Maju', false),
  ('AKJ', 'Aeon Kulaijaya', false),
  ('BTS', 'Berjaya Time Square', false),
  ('ALM', 'Alamanda Shopping', false),
  ('SYC', 'Sunway Carnival', false),
  ('MYG', 'Mayang Mall', false),
  ('ECM', 'East Coast Mall', false)
on conflict (code) do update
set
  name = excluded.name,
  is_service_center = excluded.is_service_center;
