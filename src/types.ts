/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  material: string;
  designer: string;
  description: string;
  shortDescription: string;
  images: string[];
  specs: { [key: string]: string };
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller';
  memberSince: string;
  tier: 'Standard' | 'Premium';
  avatar?: string;
}
