/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, Bell, MessageSquare, Info } from 'lucide-react';

export default function SellerNavbar() {
  return (
    <nav className="sticky top-0 w-full z-50 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-12 py-5 ml-0 md:ml-72 transition-all border-b border-surface-container-low">
      <div className="flex items-center gap-4">
        <span className="text-xl font-black text-on-surface">Seller Studio</span>
        <div className="hidden md:flex items-center bg-surface-container-low rounded-full px-4 py-2 w-64 focus-within:bg-surface-container-lowest focus-within:ring-1 focus-within:ring-primary/30 transition-all">
          <Search className="text-on-surface-variant mr-2" size={18} />
          <input 
            className="bg-transparent border-none focus:ring-0 text-sm w-full text-on-surface placeholder:text-on-surface-variant/50 outline-none" 
            placeholder="Search..." 
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="text-primary hover:opacity-70 transition-opacity">
          <Bell size={20} />
        </button>
        <button className="text-on-surface-variant hover:opacity-70 transition-opacity">
          <MessageSquare size={20} />
        </button>
        <button className="text-on-surface-variant hover:opacity-70 transition-opacity">
          <Info size={20} />
        </button>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-surface-container cursor-pointer">
          <img 
            alt="Merchant Profile Avatar" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvDZPsMgvTwsl_ilcBRfNJwPlCutBGeRj1AjIfW6J8ToPnSYa7BjiJmq7Swh-JbdGrgOQJ-DJNJ2ILxVtGcngTR4e5Dt3s2Zu3W74BPSW9TTarP0lZURb2C_R0gMAhuLGLVkwpIlkFKroZo5OJsymd5ZoIyjqEDyFzyrIktiPjtRSxjJnGbU0Lbky6sXPFtFN0Wv69CFQ6R91b1lB4bNax_5iJ7Fo7at59bdifuaDxaynQ4B6acVEnCHAZAVzigK4-TneYsK2lgPQ"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </nav>
  );
}
