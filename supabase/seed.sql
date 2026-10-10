-- Dimsum Cemeal Initial Seed Data
-- Execute in Supabase SQL Editor after running 001_cms_schema.sql

-- Insert default categories
INSERT INTO public.product_categories (id, name, slug, sort_order) VALUES
('cat_favorit', 'Favorit', 'favorit', 1),
('cat_spesial', 'Spesial', 'spesial', 2),
('cat_klasik', 'Klasik', 'klasik', 3)
ON CONFLICT (id) DO NOTHING;

-- Insert verified Dimsum Cemeal products
INSERT INTO public.products (id, name, description, price, image, category, available, badge, order_url, sort_order, photo_verified) VALUES
('dimsum-mealted', 'Dimsum Mealted', 'Varian dimsum favorit dengan limpahan keju lumer gurih yang meleleh lembut di setiap gigitan.', NULL, '/images/products/dimsum-mealted.png', 'Favorit', true, 'Best Seller', 'https://gofood.co.id/serang/restaurant/dimsum-cemeal-alfamart-bhayangkara-843af7ca-5e01-4044-8fff-daddfad62706', 1, true),
('dimsum-crispy', 'Dimsum Crispy', 'Kombinasi tekstur luar renyah keemasan berpadu dengan kelembutan olahan daging autentik di dalamnya.', NULL, '/images/products/dimsum-crispy.png', 'Favorit', true, 'Sensasi Renyah', 'https://r.grab.com/g/2-1-6-C6MJAYUYV6DKJA', 2, true),
('dimsum-smoky', 'Dimsum Smoky', 'Dimsum dengan aroma asap panggangan khas yang sedap, gurih, dan memiliki karakter rasa yang mendalam.', NULL, '/images/products/dimsum-smoky.png', 'Favorit', true, 'Aroma Khas', 'https://gofood.co.id/serang/restaurant/dimsum-cemeal-alfamart-bhayangkara-843af7ca-5e01-4044-8fff-daddfad62706', 3, true),
('dimsum-authentic-platter', 'Dimsum Platter Aneka Rasa', 'Sajikan komplit pilihan rasa Dimsum Cemeal dengan aneka topping dan saus lezat, cocok untuk momen berbagi.', NULL, '/images/products/dimsum-authentic-platter.png', 'Spesial', true, 'Porsi Berbagi', 'https://gofood.co.id/serang/restaurant/dimsum-cemeal-alfamart-bhayangkara-843af7ca-5e01-4044-8fff-daddfad62706', 4, true),
('dimsum-original', 'Dimsum Original', 'Dimsum klasik kukus dengan tekstur daging lembut berpadu rasa gurih autentik warisan resep khas Cemeal.', NULL, NULL, 'Klasik', true, 'Menu Klasik', 'https://gofood.co.id/serang/restaurant/dimsum-cemeal-alfamart-bhayangkara-843af7ca-5e01-4044-8fff-daddfad62706', 5, false),
('dimsum-chilli-oil', 'Dimsum Chilli Oil', 'Dimsum kukus hangat disiram minyak cabai (chilli oil) gurih pedas aromatik racikan spesial Dimsum Cemeal.', NULL, NULL, 'Spesial', true, 'Sensasi Pedas', 'https://gofood.co.id/serang/restaurant/dimsum-cemeal-alfamart-bhayangkara-843af7ca-5e01-4044-8fff-daddfad62706', 6, false),
('dimsum-mentai', 'Dimsum Mentai', 'Dimsum lembut berbalut saus mentai gurih-creamy yang dibakar singkat hingga menghasilkan aroma wangi khas.', NULL, NULL, 'Spesial', true, 'Creamy Mentai', 'https://r.grab.com/g/2-1-6-C6MJAYUYV6DKJA', 7, false),
('dimsum-mozarella', 'Dimsum Mozarella', 'Kelezatan dimsum premium dengan balutan keju mozzarella melar yang gurih saat dinikmati hangat.', NULL, NULL, 'Favorit', true, 'Keju Melar', 'https://r.grab.com/g/2-1-6-C6MJAYUYV6DKJA', 8, false)
ON CONFLICT (id) DO NOTHING;

-- Storage Bucket Setup (Run in Storage SQL)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('cms-media', 'cms-media', true) ON CONFLICT (id) DO NOTHING;
