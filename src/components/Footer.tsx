/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function Footer() {
  return (
    <footer className="bg-stone-50 dark:bg-stone-950 w-full py-16 px-8 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-stone-200/20">
      <div className="text-lg font-bold text-stone-900 dark:text-stone-100 italic">
        GALERIE
      </div>
      <div className="flex gap-6 font-sans text-xs tracking-wide leading-relaxed">
        <a className="text-stone-500 dark:text-stone-400 hover:text-stone-900 transition-colors" href="#">Sustainability</a>
        <a className="text-stone-500 dark:text-stone-400 hover:text-stone-900 transition-colors" href="#">Shipping</a>
        <a className="text-stone-500 dark:text-stone-400 hover:text-stone-900 transition-colors" href="#">Returns</a>
        <a className="text-stone-500 dark:text-stone-400 hover:text-stone-900 transition-colors" href="#">Privacy</a>
        <a className="text-stone-500 dark:text-stone-400 hover:text-stone-900 transition-colors" href="#">Contact</a>
      </div>
      <div className="text-primary dark:text-primary-container font-sans text-xs tracking-wide leading-relaxed">
        © 2026 Galerie Editorial Commerce. All rights reserved.
      </div>
    </footer>
  );
}
