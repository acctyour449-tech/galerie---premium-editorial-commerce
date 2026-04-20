/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Ovoid Vase',
    price: 180,
    category: 'Ceramics',
    material: 'Matte white earthenware',
    designer: 'Studio Koto',
    description: 'A masterclass in modern ceramics. The Ovoid Vase features a smooth, matte finish and organic curves inspired by natural forms.',
    shortDescription: 'Matte white earthenware',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCgq2_7NWaiXb8qvrxd1im4HJdc8DLnZGgnvTIpKbkSEFvYKEl9wwFjM5-Q6AvVF5rLNRU4lc20cDVos_KFBjktQwHZNHQOymxgoTeEWirtrF1cWfFdSWctv1htFz2I1Ut_wsR4gcEkFaGchjMfE5CWw6mW1-U0MH9yDTTGbMs-YUTIa5kQQ9cr0y5dTYpFIiI56Uh7KTsFcgjJ60RpFwv_m1cXq04msQHmi5wCUT-QpaWb47upayb6L3AnZEjiFiR_oFNdKDaTdo0'],
    specs: {
      Dimensions: '20cm x 15cm',
      Weight: '1.2kg',
      Origin: 'Japan'
    }
  },
  {
    id: '2',
    name: 'Arc Chair',
    price: 850,
    category: 'Furniture',
    material: 'Solid white oak',
    designer: 'Atelier Blanc',
    description: 'Sculptural wooden dining chair with curved backrest in natural oak finish. A perfect blend of comfort and minimalist design.',
    shortDescription: 'Solid white oak',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAZuxbdGYTesDLfRdvfU8oEkGCLh8Ac4iJKUdhUrb6T_xlCfTEj0xKifo4pYiGBmzDRQtt5Y0WTKnd7BlS4hbi4pc2PqftB4RIgaroEbtkUSARoQhHpPdSusQhpKnlOrqVkVu9YpIBWano7i0cWQI2a1vr5E_NPMQleT56lqAHZpaUvodJWytXnNww18aMv4CjqIUB4mhmEXAeQeYxzYBDPaPElz8S3F0UZlCAimtQ5drGUPYox_WveyDifGN5JCdwSF-04pbl3ZM8'],
    specs: {
      Height: '85cm',
      Width: '50cm',
      Depth: '45cm'
    }
  },
  {
    id: '3',
    name: 'Brass Globe Lamp',
    price: 420,
    category: 'Lighting',
    material: 'Brushed brass, opal glass',
    designer: 'Neri & Hu',
    description: 'Modern minimalist table lamp with brass base and frosted glass globe shade. Creates a soft, atmospheric glow in any room.',
    shortDescription: 'Brushed brass, opal glass',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuD7nU06P6iGJsNIcQDHkyGpz6tmKK8VQlB_XaNcd5cBJedk1FVYTn_mymGFjzEiDers-E3LQQ9Obl4bcInJ_nbHCnz8Rcpe3LYAq6YbGx31Pka6iebPQN65Ms7ucgmqXPi2f6xMOpTHBb9b1QmvESuTYNSO7MWt6qQ2Qil-0IyALX6lLL0tsQ4TI4eJBRUWL0B5jpjnz7HRME0iQYfOw6H9hE0JKr5Da9j0pXch7zLWOmPE1FnpL20TksHbFePQVILbPXMYdTUObM4'],
    specs: {
      Voltage: '220V',
      Base: 'E27',
      Material: 'Brass'
    }
  },
  {
    id: '4',
    name: 'Woven Throw',
    price: 210,
    category: 'Textiles',
    material: '100% Belgian linen',
    designer: 'Frama',
    description: 'Soft, textured handwoven linen throw blanket in natural beige tones. Perfect for adding a layered feel to your living space.',
    shortDescription: '100% Belgian linen',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBB7s3UTbeBi8OUSM8lyRtNwbIFSphkLUHtiyKeYZkOIgCq550xaCF2jf70kOoJWWwIA3sOcf7WMYxyPfB119t73J2JSd1rFbFd3A9ilmnZxdjameOd4PVDf-2oCaDyI84PKiBQrTsW2wm8rfFdby7LfDDTG2671GV2qCqvZZ5NVgqLLj46aQEoLe0jxdTu0PlWw1IFWgycfKjbOapK_SrFiH8IJlpY8VqHLeHmAuAhD7VDGfTyho1WShmbuzAcykvLqSsiTv_GQVI'],
    specs: {
      Size: '150cm x 200cm',
      Material: 'Linen',
      Care: 'Dry clean only'
    }
  }
];
