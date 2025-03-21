#!/bin/bash

# Dubai to Stars Space Travel Booking Platform - Frontend Setup Script
# This script creates the folder structure and empty files for the frontend

echo "Creating frontend structure for Dubai to Stars Space Travel Booking Platform..."

# Create main directory and subdirectories
mkdir -p frontend/public
mkdir -p frontend/src/api
mkdir -p frontend/src/assets/css
mkdir -p frontend/src/components/{common,booking,destinations,accommodations,packages,user}
mkdir -p frontend/src/context
mkdir -p frontend/src/hooks
mkdir -p frontend/src/pages
mkdir -p frontend/src/utils

# Create public files
touch frontend/public/index.html
touch frontend/public/favicon.ico
touch frontend/public/robots.txt

# Create base config files
touch frontend/package.json
touch frontend/Dockerfile
touch frontend/nginx.conf
touch frontend/.gitignore

# Create main application files
touch frontend/src/index.js
touch frontend/src/App.js

# Create API files
touch frontend/src/api/index.js
touch frontend/src/api/auth.js
touch frontend/src/api/destinations.js
touch frontend/src/api/accommodations.js
touch frontend/src/api/packages.js
touch frontend/src/api/bookings.js
touch frontend/src/api/ai.js

# Create CSS files
touch frontend/src/assets/css/index.css
touch frontend/src/assets/css/animations.css
touch frontend/src/assets/css/space-art.css
touch frontend/src/assets/css/cursor.css

# Create common components
touch frontend/src/components/common/Header.js
touch frontend/src/components/common/Footer.js
touch frontend/src/components/common/Navigation.js
touch frontend/src/components/common/Loading.js
touch frontend/src/components/common/StarField.js
touch frontend/src/components/common/BurjKhalifaArt.js
touch frontend/src/components/common/SpaceshipCursor.js
touch frontend/src/components/common/CursorInit.js
touch frontend/src/components/common/ProtectedRoute.js

# Create booking components
touch frontend/src/components/booking/BookingForm.js
touch frontend/src/components/booking/DatePicker.js
touch frontend/src/components/booking/PackageSelection.js
touch frontend/src/components/booking/SeatSelection.js
touch frontend/src/components/booking/BookingSummary.js

# Create destination components
touch frontend/src/components/destinations/DestinationCard.js
touch frontend/src/components/destinations/DestinationDetail.js
touch frontend/src/components/destinations/DestinationList.js

# Create accommodation components
touch frontend/src/components/accommodations/AccommodationCard.js
touch frontend/src/components/accommodations/AccommodationDetail.js
touch frontend/src/components/accommodations/AccommodationList.js

# Create package components
touch frontend/src/components/packages/PackageCard.js
touch frontend/src/components/packages/PackageDetail.js
touch frontend/src/components/packages/PackageComparison.js
touch frontend/src/components/packages/PackageList.js

# Create user components
touch frontend/src/components/user/LoginForm.js
touch frontend/src/components/user/RegisterForm.js
touch frontend/src/components/user/UserProfile.js
touch frontend/src/components/user/BookingHistory.js
touch frontend/src/components/user/CountdownTimer.js

# Create context files
touch frontend/src/context/AuthContext.js
touch frontend/src/context/BookingContext.js

# Create hook files
touch frontend/src/hooks/useAuth.js
touch frontend/src/hooks/useBooking.js
touch frontend/src/hooks/useDestinations.js

# Create page files
touch frontend/src/pages/HomePage.js
touch frontend/src/pages/DestinationsPage.js
touch frontend/src/pages/DestinationDetailPage.js
touch frontend/src/pages/AccommodationsPage.js
touch frontend/src/pages/AccommodationDetailPage.js
touch frontend/src/pages/PackagesPage.js
touch frontend/src/pages/PackageDetailPage.js
touch frontend/src/pages/BookingPage.js
touch frontend/src/pages/LoginPage.js
touch frontend/src/pages/RegisterPage.js
touch frontend/src/pages/UserDashboardPage.js
touch frontend/src/pages/NotFoundPage.js

# Create utility files
touch frontend/src/utils/api.js
touch frontend/src/utils/auth.js
touch frontend/src/utils/dates.js

# Add basic content to .gitignore
cat > frontend/.gitignore << EOL
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
EOL

echo "Frontend structure created successfully!"
echo "To start the development:"
echo "1. cd frontend"
echo "2. npm install"
echo "3. npm start"