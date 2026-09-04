export interface Product {
  id: string;
  name: string;
  origin: string;
  region: string;
  process: string;
  roast: 'light' | 'medium' | 'medium-dark' | 'dark';
  flavorProfile: string[];
  price: number; // base price for 250g
  recommendedBrew: 'v60' | 'espresso' | 'french-press';
  description: string;
}

export const DRIFT_COLLECTION: Product[] = [
  {
    id: 'p-01',
    name: 'Guji Natural',
    origin: 'Ethiopia',
    region: 'Guji Zone',
    process: 'Natural',
    roast: 'light',
    flavorProfile: ['Jasmine', 'Blueberry', 'Bergamot'],
    price: 24,
    recommendedBrew: 'v60',
    description: 'A distinctly floral and fruit-forward profile. Sun-dried carefully to preserve the vibrant, complex acidity typical of high-altitude Ethiopian naturals.'
  },
  {
    id: 'p-02',
    name: 'Antigua Volcanic',
    origin: 'Guatemala',
    region: 'Antigua',
    process: 'Washed',
    roast: 'medium',
    flavorProfile: ['Milk Chocolate', 'Orange Zest', 'Caramel'],
    price: 22,
    recommendedBrew: 'v60',
    description: 'Cultivated in mineral-rich volcanic soil. This washed lot delivers a deeply structured, balanced cup with prominent chocolate sweetness and clean citrus acidity.'
  },
  {
    id: 'p-03',
    name: 'Sul de Minas',
    origin: 'Brazil',
    region: 'Minas Gerais',
    process: 'Pulped Natural',
    roast: 'medium-dark',
    flavorProfile: ['Dark Cocoa', 'Roasted Hazelnut', 'Molasses'],
    price: 20,
    recommendedBrew: 'espresso',
    description: 'A classic, full-bodied Brazilian profile. The pulped natural process enhances body and sweetness, making it an exceptional foundation for espresso.'
  }
];
