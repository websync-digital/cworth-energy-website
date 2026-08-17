-- Rebuild the product catalogue from the surviving Cloudinary assets.
-- Prices are provisional amounts in NGN, matching the application's current
-- use of `price_cents` (the UI displays the stored number directly as naira).

create extension if not exists pgcrypto;

create table if not exists public.cworth_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_description text not null default '',
  full_description text not null default '',
  price_cents bigint not null default 0 check (price_cents >= 0),
  image_url text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists cworth_products_created_at_idx
  on public.cworth_products (created_at desc);

alter table public.cworth_products enable row level security;

revoke all on public.cworth_products from anon, authenticated;
grant select on public.cworth_products to anon, authenticated;
grant insert, update, delete on public.cworth_products to authenticated;

drop policy if exists "cworth products are publicly readable" on public.cworth_products;
create policy "cworth products are publicly readable"
  on public.cworth_products
  for select
  to anon, authenticated
  using (true);

drop policy if exists "cworth admins can create products" on public.cworth_products;
create policy "cworth admins can create products"
  on public.cworth_products
  for insert
  to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "cworth admins can update products" on public.cworth_products;
create policy "cworth admins can update products"
  on public.cworth_products
  for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "cworth admins can delete products" on public.cworth_products;
create policy "cworth admins can delete products"
  on public.cworth_products
  for delete
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

insert into public.cworth_products
  (name, short_description, full_description, price_cents, image_url)
values
  ('Cworth Wall-Mounted Home Energy Storage System', 'Compact wall-mounted battery storage for home solar systems.', 'Cworth Energy wall-mounted energy storage unit with an integrated status display. Suitable for residential backup and solar self-consumption systems. Confirm final capacity and price in the admin dashboard.', 1850000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394724/cworth-energy/products/1776999824313-1u6zxg7kkyf_bvwssl.jpg'),
  ('Cworth All-in-One Solar Street Light', 'Integrated solar panel and high-output LED street light.', 'All-in-one outdoor solar street light with an integrated photovoltaic panel, LED array, pole mounting bracket, and weather-resistant housing.', 420000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394727/cworth-energy/products/1769938000277-ii6wphpamz8_mitca1.jpg'),
  ('Cworth Commercial Battery Cabinet', 'High-capacity floor-standing battery bank cabinet.', 'Commercial energy-storage cabinet with digital controls and enclosed battery compartments for larger solar and backup-power installations.', 6500000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394728/cworth-energy/products/1769937729269-gizs9n4q8bk_tmucwd.jpg'),
  ('Cworth Integrated Power Storage Unit', 'Compact enclosed backup-power and storage system.', 'Integrated Cworth Energy power-storage unit with a circular system-status display and enclosed cabinet design.', 1600000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394729/cworth-energy/products/1769937618452-9yyt1z99d38_mco6vo.jpg'),
  ('Cworth Hybrid Solar Inverter', 'Wall-mounted hybrid inverter with LCD system monitor.', 'Hybrid solar inverter for battery charging, utility backup, and photovoltaic power conversion. Final power rating should be confirmed in the admin dashboard.', 750000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394731/cworth-energy/products/1769937522089-k3r9yuvztl_rmscth.jpg'),
  ('Cworth Home Solar Inverter', 'Compact wall-mounted inverter for home solar systems.', 'Cworth Energy home inverter with an LCD status panel and connections for solar, battery, utility, and household loads.', 520000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394732/cworth-energy/products/1769937407656-fm9iv55opv_zohtf1.jpg'),
  ('Cworth Mobile Home Energy Storage System', 'Floor-standing home battery with easy-move castors.', 'Mobile residential energy-storage cabinet with built-in display and castors for convenient installation and servicing.', 2300000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394734/cworth-energy/products/1769937312310-vdrxm3cx148_lg9umb.jpg'),
  ('Cworth Rack Lithium Battery Bank', 'Five-module rack-mounted lithium battery storage bank.', 'Preassembled rack battery bank with five Cworth Energy lithium modules for scalable commercial or residential backup storage.', 7200000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394735/cworth-energy/products/1769937213149-rti8mevrq1i_jk3rjk.jpg'),
  ('Cworth 12V 100Ah Gel Battery', 'Maintenance-friendly 12V deep-cycle gel battery.', 'Cworth Energy G12V100Ah gel battery for solar energy storage, backup power, and deep-cycle applications.', 220000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394737/cworth-energy/products/1769937109005-ynrwioc8sc_llwfao.jpg'),
  ('Cworth 12V 200Ah Gel Battery', 'High-capacity 12V deep-cycle gel battery.', 'Cworth Energy G12V200Ah gel battery for residential solar storage, inverter systems, and backup-power applications.', 390000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394738/cworth-energy/products/1769937027108-wdto429ejfm_kp5uyo.jpg'),
  ('Cworth 6kW Solar Power Kit', 'Complete 6kW solar kit with panels, inverter, battery, protection, and cables.', 'Complete Cworth Energy 6kW solar package including photovoltaic panels, hybrid inverter, lithium storage, distribution protection, and installation cable.', 5800000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394740/cworth-energy/products/1769936916049-v9rxz0aeyxq_zmrgfc.jpg'),
  ('Cworth 6kW Dual-Storage Solar Kit', 'Complete 6kW system with solar panels and two storage units.', 'Complete 6kW solar solution with photovoltaic array, inverter, dual energy-storage units, protection box, and solar cable.', 6900000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394741/cworth-energy/products/1769936586563-zwdud1t3w2h_hnuenm.jpg'),
  ('Cworth High-Capacity Solar Power Kit', 'Large complete solar kit with panel array and mobile storage.', 'High-capacity Cworth solar package with a multi-panel array, inverter, mobile and wall-mounted storage, distribution protection, Wi-Fi monitoring, and cabling.', 12500000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394743/cworth-energy/products/1769936310412-et2c86nn8af_a0hq2t.jpg'),
  ('Cworth 4kW Solar Power Kit', 'Complete 4kW solar kit with panels, inverter, and battery storage.', 'Cworth Energy 4kW photovoltaic package with panels, inverter, lithium storage units, protection box, and installation cable.', 4300000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394745/cworth-energy/products/1769936120933-ufgqstzm95b_kg9lvb.jpg'),
  ('Cworth 1.5kW Solar Power Kit', 'Compact 1.5kW solar package with lithium battery.', 'Entry-level 1.5kW Cworth Energy system with solar panels, hybrid inverter, 12V 100Ah LiFePO4 battery, protection box, and cable.', 1850000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394747/cworth-energy/products/1769935914311-c9d7vlk02z_j3t3e5.jpg'),
  ('Cworth 6kW Premium Solar Power Kit', 'Premium 6kW solar package with mobile energy storage.', 'Complete premium 6kW solar system with photovoltaic array, Wi-Fi monitoring, inverter, mobile battery storage, protection box, and solar cable.', 7500000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394748/cworth-energy/products/1769935716170-uuntctxcun_mq2hju.jpg'),
  ('Cworth Integrated Solar Street Light Panel', 'Integrated solar street-light module with LED array.', 'Slim all-in-one solar street-light module combining a photovoltaic panel, multiple LED lamps, controls, and outdoor housing.', 350000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394750/cworth-energy/products/1769935471390-67da6aeremy_jnqxtq.jpg'),
  ('Cworth 24V 100Ah LiFePO4 Rack Battery', '24V rack-mount lithium iron phosphate battery.', 'Cworth Energy 24V LiFePO4 rack battery with 100Ah-class front-panel controls, display, protection breaker, and communication ports.', 980000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394751/cworth-energy/products/1769935370927-gl8d6d36e3k_b76fcr.jpg'),
  ('Cworth 48V 100Ah LiFePO4 Rack Battery', '48V rack-mount lithium iron phosphate battery.', 'Cworth Energy 48V LiFePO4 rack battery with front-panel display, breaker, heavy-duty terminals, and communication ports.', 1650000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394753/cworth-energy/products/1769935252222-w46bffurr7_zhwepk.jpg'),
  ('Cworth Advanced Hybrid Inverter', 'Wall-mounted hybrid inverter with circular touch controls.', 'Advanced Cworth Energy hybrid inverter for photovoltaic, battery, utility, and household-load integration.', 950000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394754/cworth-energy/products/1769935114442-q3dxf6cv1f_exvdot.jpg'),
  ('Cworth Solar Home Lighting System', 'Compact solar controller with lighting and USB outputs.', 'Portable home solar lighting controller featuring battery status, AC/DC power indicators, USB outputs, 12V connections, and integrated lamp.', 280000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394755/cworth-energy/products/1769934982546-rildn5tumj9_wcx3zf.jpg'),
  ('Cworth Smart Solar Distribution Box', 'Prewired solar AC/DC protection and distribution box.', 'Cworth Energy smart distribution box with circuit protection, surge protection, metering, and labeled solar-system connections.', 260000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394757/cworth-energy/products/1769934859098-i8rxs5pqihb_dfgglo.jpg'),
  ('Cworth Compact Solar Inverter', 'Compact wall-mounted inverter with digital display.', 'Cworth Energy compact solar inverter with a circular LCD interface and bottom power connectors for residential installations.', 680000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394758/cworth-energy/products/1769934750858-f98hnayse2m_ywbpwg.jpg'),
  ('Cworth MPPT Solar Inverter', 'Wall-mounted MPPT inverter for home solar systems.', 'Cworth Energy MPPT solar inverter with system-status display and connections for photovoltaic panels, utility, batteries, and loads.', 560000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394760/cworth-energy/products/1769934537941-22cagn98055_vwqojl.jpg'),
  ('Cworth 12V 200Ah LiFePO4 Battery', '12V 200Ah lithium iron phosphate battery with display.', 'Cworth Energy 12V 200Ah LiFePO4 battery with integrated status display, heavy-duty terminals, long cycle life, and built-in protection.', 780000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394761/cworth-energy/products/1769934349066-ckjlw1h23f8_ts8a0l.jpg'),
  ('Cworth 12V 300Ah LiFePO4 Battery', '12V 300Ah high-capacity lithium iron phosphate battery.', 'Cworth Energy 12V 300Ah LiFePO4 battery with integrated display, heavy-duty terminals, long cycle life, and built-in protection.', 1150000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394763/cworth-energy/products/1769934188915-iosfvwlxsaq_nxkvjo.jpg'),
  ('Cworth CE-H12KL 12kVA Inverter', 'Heavy-duty 12kVA hybrid solar inverter.', 'Cworth Energy CE-H12KL 12kVA inverter for large residential and commercial solar, battery, and backup-power systems.', 2800000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394765/cworth-energy/products/1767641585273-tg91lnzrj48_rmxxyo.jpg'),
  ('Cworth 420W Monocrystalline Solar Panel', '420W high-efficiency monocrystalline photovoltaic panel.', 'Cworth Energy 420W solar module with durable aluminum frame, high-efficiency cells, junction box, and preattached solar connectors.', 155000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394767/cworth-energy/products/1767427975054-8l4txlytyox_sqelhc.jpg'),
  ('Cworth 600W Half-Cell Solar Panel', '600W high-output half-cell photovoltaic module.', 'Cworth Energy 600W half-cell solar panel with a 12-year product warranty and 25-year linear power-output warranty shown on the product artwork.', 245000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394768/cworth-energy/products/1767427571634-gzocastdbz6_veuyul.jpg'),
  ('Cworth Monocrystalline Solar Panel', 'High-efficiency monocrystalline photovoltaic module.', 'Cworth Energy monocrystalline solar panel with durable frame, rear junction box, and preattached solar connectors. Confirm final wattage in the admin dashboard.', 180000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394771/cworth-energy/products/1767427251297-2xo3bg3u0o8_tljlue.jpg'),
  ('Cworth LBC-48200C 10kWh 48V Lithium Battery', '10kWh 48V residential lithium storage battery.', 'Cworth Energy LBC-48200C 10kWh 48V lithium battery with integrated display, communications, and protected power connections.', 3200000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394772/cworth-energy/products/1767360194601-kf7td71gof_gha6md.jpg'),
  ('Cworth Smart Hybrid Solar Inverter', 'Smart wall-mounted inverter with circular control display.', 'Cworth Energy smart hybrid inverter for coordinating solar generation, utility input, battery charging, and household loads.', 820000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394774/cworth-energy/products/1767359894584-8ngs6eri9j_nlmtol.jpg'),
  ('Cworth CE-H1.8KL 1.8kVA Inverter', 'Compact 1.8kVA hybrid solar inverter.', 'Cworth Energy CE-H1.8KL 1.8kVA inverter for small home solar and backup-power installations.', 420000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394775/cworth-energy/products/1767303209581-4qs3sqfi5nb_ifzzuw.jpg'),
  ('Cworth CE-H6KL 6kVA Inverter', 'High-performance 6kVA hybrid solar inverter.', 'Cworth Energy CE-H6KL 6kVA inverter for residential and small-commercial solar, battery, and backup-power systems.', 1350000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394777/cworth-energy/products/1767302840079-fv3y8ag6wf6_rsuuhu.jpg'),
  ('Cworth Mobile Inverter Power System', 'Floor-standing inverter and power system on castors.', 'Mobile Cworth Energy inverter power cabinet with circular system display, ventilated enclosure, and heavy-duty castors.', 2100000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394778/cworth-energy/products/1769933722661-3nuqzrq6loh_u2lmn7.jpg'),
  ('Cworth Mobile Energy Storage Cabinet', 'Compact mobile energy-storage cabinet.', 'Cworth Energy floor-standing battery-storage cabinet with a built-in display, side power connections, and castors.', 1950000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394780/cworth-energy/products/1776999616597-wa7recrie1g_s87arh.jpg'),
  ('Cworth 12V 100Ah LiFePO4 Battery', '12V 100Ah lithium iron phosphate battery with display.', 'Cworth Energy 12V 100Ah LiFePO4 battery with integrated status display, heavy-duty terminals, long cycle life, and built-in protection.', 430000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394782/cworth-energy/products/1769933830573-d9fyju9rym_namb7m.jpg'),
  ('Cworth Slim Wall-Mounted Energy Storage System', 'Slim residential wall-mounted battery storage.', 'Cworth Energy slim wall-mounted home energy-storage unit with an integrated system-status screen and clean indoor enclosure.', 1750000, 'https://res.cloudinary.com/dmemfuadb/image/upload/v1779394783/cworth-energy/products/1769933879725-4y7u70tc9bb_pc9xko.jpg')
on conflict (image_url) do nothing;

comment on column public.cworth_products.price_cents is
  'Legacy column name: values are whole Nigerian naira, as rendered by the current application.';
