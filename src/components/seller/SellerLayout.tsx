/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from 'react';
import SellerNavbar from './SellerNavbar';
import SellerSidebar from './SellerSidebar';

interface SellerLayoutProps {
  children: ReactNode;
}

export default function SellerLayout({ children }: SellerLayoutProps) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <SellerSidebar />
      <div className="flex-1 ml-0 md:ml-72 flex flex-col">
        <SellerNavbar />
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
}
