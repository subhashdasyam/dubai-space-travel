-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on email
CREATE INDEX users_email_idx ON users (email);

-- Destinations Table
CREATE TABLE destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    distance FLOAT NOT NULL, -- Distance from Earth in kilometers
    travel_time INTEGER NOT NULL, -- Travel time in hours
    description TEXT NOT NULL,
    features JSONB DEFAULT '[]'::jsonb,
    css_style_data JSONB DEFAULT '{}'::jsonb,
    price_factor FLOAT DEFAULT 1.0,
    gravity FLOAT, -- Gravity relative to Earth (Earth = 1.0)
    atmosphere TEXT,
    temperature_range JSONB,
    points_of_interest JSONB DEFAULT '[]'::jsonb,
    safety_rating INTEGER,
    recommended_stay_duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Accommodations Table
CREATE TABLE accommodations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID NOT NULL REFERENCES destinations(id),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    amenities JSONB DEFAULT '[]'::jsonb,
    price_per_night FLOAT NOT NULL,
    capacity INTEGER NOT NULL,
    rating FLOAT DEFAULT 0.0,
    css_style_data JSONB DEFAULT '{}'::jsonb,
    availability JSONB DEFAULT '{}'::jsonb,
    gravity_simulation BOOLEAN DEFAULT false,
    view_type TEXT,
    room_types JSONB DEFAULT '[]'::jsonb,
    special_features JSONB DEFAULT '[]'::jsonb,
    oxygen_quality TEXT,
    construction_year INTEGER,
    last_renovated INTEGER,
    reviews JSONB DEFAULT '[]'::jsonb,
    distance_from_main_attractions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on destination_id
CREATE INDEX accommodations_destination_id_idx ON accommodations (destination_id);

-- Packages Table
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    class_type TEXT NOT NULL,
    price FLOAT NOT NULL,
    features JSONB DEFAULT '[]'::jsonb,
    capacity INTEGER NOT NULL,
    css_style_data JSONB DEFAULT '{}'::jsonb,
    cabin_layout JSONB,
    meal_options JSONB DEFAULT '[]'::jsonb,
    entertainment JSONB DEFAULT '[]'::jsonb,
    amenity_kits JSONB,
    baggage_allowance JSONB,
    special_services JSONB DEFAULT '[]'::jsonb,
    transfer_options JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bookings Table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    departure_date TIMESTAMP WITH TIME ZONE NOT NULL,
    return_date TIMESTAMP WITH TIME ZONE NOT NULL,
    destination_id UUID NOT NULL REFERENCES destinations(id),
    accommodation_id UUID NOT NULL REFERENCES accommodations(id),
    package_id UUID NOT NULL REFERENCES packages(id),
    travelers INTEGER NOT NULL,
    special_requests TEXT,
    total_price FLOAT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Confirmed',
    payment_status TEXT DEFAULT 'Pending',
    boarding_passes JSONB DEFAULT '[]'::jsonb,
    travel_documents JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for bookings
CREATE INDEX bookings_user_id_idx ON bookings (user_id);
CREATE INDEX bookings_destination_id_idx ON bookings (destination_id);
CREATE INDEX bookings_accommodation_id_idx ON bookings (accommodation_id);
CREATE INDEX bookings_package_id_idx ON bookings (package_id);

-- Sample data for destinations
INSERT INTO destinations (name, distance, travel_time, description, features, css_style_data, price_factor, gravity, atmosphere, temperature_range, safety_rating, recommended_stay_duration)
VALUES
    ('Lunar Resort', 384400, 72, 'Experience luxury accommodations on the surface of the Moon with breathtaking Earth views.', 
     '["Low gravity experience", "Earth observation deck", "Crater exploration", "Lunar rover tours"]',
     '{"primaryColor": "#8a9ba8", "secondaryColor": "#c0d1e0", "accentColor": "#e6e6fa"}',
     1.5, 0.165, 'None (artificial habitat environment)', '{"min": 20, "max": 25}', 9, 5),
    
    ('Mars Colony', 225000000, 5040, 'Visit the first human settlement on the Red Planet and experience Martian landscapes.',
     '["Olympus Mons expedition", "Martian sunset viewing", "Phobos and Deimos observation", "Valles Marineris trek"]',
     '{"primaryColor": "#c1440e", "secondaryColor": "#e27b58", "accentColor": "#ffd700"}',
     2.5, 0.38, 'Thin CO2 (artificial habitat environment)', '{"min": 18, "max": 24}', 7, 14),
    
    ('Orbital Luxury Station', 450, 3, 'A premium space hotel in low Earth orbit offering zero-gravity experiences and spectacular views.',
     '["Zero-G swimming", "Space walk", "Earth viewing lounges", "Astronomy sessions"]',
     '{"primaryColor": "#2d3e50", "secondaryColor": "#34495e", "accentColor": "#3498db"}',
     1.2, 0, 'Controlled artificial environment', '{"min": 22, "max": 24}', 10, 3),
    
    ('Venus Cloud City', 41400000, 2880, 'Float above the clouds of Venus in a city suspended in the upper atmosphere.',
     '["Cloud surfing", "Atmospheric science labs", "Venusian sunset viewing", "High-altitude balloon tours"]',
     '{"primaryColor": "#ff9f1c", "secondaryColor": "#ffbf69", "accentColor": "#8338ec"}',
     3.0, 0.9, 'Controlled habitat in upper atmosphere', '{"min": 21, "max": 27}', 6, 7);

-- Sample data for accommodations
INSERT INTO accommodations (destination_id, name, type, description, amenities, price_per_night, capacity, rating, css_style_data)
VALUES
    -- Lunar Resort accommodations
    ((SELECT id FROM destinations WHERE name = 'Lunar Resort'), 'Tranquility Suite', 'Luxury Suite', 
     'Our premier accommodation on the lunar surface with panoramic Earth views and private regolith garden.',
     '["Earth view windows", "Private lunar rover", "Adjustable gravity settings", "Gourmet meal plan", "VR entertainment system"]',
     15000, 4, 4.9,
     '{"primaryColor": "#1a1a2e", "secondaryColor": "#16213e", "accentColor": "#e94560"}'),
    
    ((SELECT id FROM destinations WHERE name = 'Lunar Resort'), 'Crater View Room', 'Standard Room', 
     'Comfortable accommodation with views of lunar craters and access to all resort amenities.',
     '["Crater view window", "Shared lunar rover access", "Standard gravity settings", "Standard meal plan"]',
     8000, 2, 4.5,
     '{"primaryColor": "#393e46", "secondaryColor": "#222831", "accentColor": "#00adb5"}'),
    
    -- Mars Colony accommodations
    ((SELECT id FROM destinations WHERE name = 'Mars Colony'), 'Olympus Penthouse', 'Luxury Suite', 
     'The most luxurious accommodation on Mars with private observation deck and expedition equipment.',
     '["360� Mars view", "Private expedition guide", "Top-tier life support", "Gourmet Martian cuisine", "Science lab access"]',
     25000, 6, 4.8,
     '{"primaryColor": "#6f1d1b", "secondaryColor": "#bb9457", "accentColor": "#432818"}'),
    
    ((SELECT id FROM destinations WHERE name = 'Mars Colony'), 'Red Planet Habitat', 'Standard Room', 
     'Standard Mars accommodation with all necessary amenities for a comfortable Martian stay.',
     '["Mars view ports", "Group expeditions", "Standard life support", "Martian meal plan"]',
     12000, 4, 4.3,
     '{"primaryColor": "#99582a", "secondaryColor": "#ffe6a7", "accentColor": "#6f1d1b"}'),
    
    -- Orbital Luxury Station accommodations
    ((SELECT id FROM destinations WHERE name = 'Orbital Luxury Station'), 'Infinity Suite', 'Luxury Pod', 
     'Premium zero-gravity suite with 270� Earth and space views and private airlock.',
     '["Panoramic Earth views", "Private space walk access", "Zero-G shower", "Gourmet meal plan", "Private communications array"]',
     18000, 2, 5.0,
     '{"primaryColor": "#0b3d91", "secondaryColor": "#1e2761", "accentColor": "#7dcfb6"}'),
    
    ((SELECT id FROM destinations WHERE name = 'Orbital Luxury Station'), 'Earth View Pod', 'Standard Pod', 
     'Comfortable orbital accommodation with Earth views and all station amenities.',
     '["Earth view window", "Scheduled space walks", "Shared facilities", "Standard meal plan"]',
     9000, 2, 4.6,
     '{"primaryColor": "#1b262c", "secondaryColor": "#0f4c75", "accentColor": "#3282b8"}'),
    
    -- Venus Cloud City accommodations
    ((SELECT id FROM destinations WHERE name = 'Venus Cloud City'), 'Cloud Nine Suite', 'Luxury Suite', 
     'Exclusive accommodation floating in the Venusian atmosphere with cloud viewing lounge and private atmosphere craft.',
     '["Panoramic cloud views", "Private atmosphere craft", "Venusian Spa access", "Gourmet cloud cuisine", "Science observatory access"]',
     22000, 4, 4.7,
     '{"primaryColor": "#ff9a00", "secondaryColor": "#f08700", "accentColor": "#650d1b"}'),
    
    ((SELECT id FROM destinations WHERE name = 'Venus Cloud City'), 'Cloudscape Room', 'Standard Room', 
     'Standard accommodation in the Venusian cloud city with beautiful views and amenities.',
     '["Cloud view ports", "Shared atmosphere craft", "Standard facilities", "Venusian meal plan"]',
     11000, 2, 4.2,
     '{"primaryColor": "#f9c80e", "secondaryColor": "#f86624", "accentColor": "#ea3546"}');

-- Sample data for packages
INSERT INTO packages (name, class_type, price, features, capacity, css_style_data)
VALUES
    ('Cosmic Luxury', 'First Class', 50000,
     '["Private cabin", "Personal concierge", "Customized meal plan", "Priority boarding", "Premium spacesuit", "Extended zero-G training", "Unlimited entertainment access"]',
     4,
     '{"primaryColor": "#1a1a2e", "secondaryColor": "#16213e", "accentColor": "#e94560"}'),
    
    ('Stellar Experience', 'Business Class', 25000,
     '["Semi-private cabin", "Dedicated service", "Premium meal selection", "Zero-G training", "Enhanced entertainment package"]',
     6,
     '{"primaryColor": "#2d3e50", "secondaryColor": "#34495e", "accentColor": "#3498db"}'),
    
    ('Orbital Economy', 'Economy Class', 12000,
     '["Shared cabin", "Standard meal plan", "Basic zero-G training", "Standard entertainment package"]',
     12,
     '{"primaryColor": "#393e46", "secondaryColor": "#222831", "accentColor": "#00adb5"}');