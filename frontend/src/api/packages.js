import api from './index';

// Get all packages with optional filters
export const getPackages = async (classType = null) => {
  const params = {};
  if (classType) {
    params.class_type = classType;
  }
  
  return api.get('/packages', { params });
};

// Get package by ID
export const getPackageById = async (packageId) => {
  return api.get(`/packages/${packageId}`);
};

// Compare multiple packages
export const comparePackages = async (packageIds) => {
  const packageIdsStr = Array.isArray(packageIds) ? packageIds.join(',') : packageIds;
  return api.get(`/packages/compare?package_ids=${packageIdsStr}`);
};

// Calculate package price
export const calculatePackagePrice = async (params) => {
  return api.get('/packages/calculate-price', { params });
};