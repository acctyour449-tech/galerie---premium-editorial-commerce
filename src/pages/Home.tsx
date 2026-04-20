/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

import { Shirt, Watch, Armchair, Headphones } from 'lucide-react';

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-12 md:py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full h-[600px] md:h-[800px] rounded-xl overflow-hidden bg-surface-container-low flex items-center justify-center p-8 text-center"
        >
          <img 
            alt="Minimalist Hero" 
            className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply transition-transform duration-1000 hover:scale-105" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtT22x2Q2RkPBRQhQbAPV8uXXlrmPkS6Ss3E7G4o92oxHdxvMHeoRi-y_bgy9Qj_0zfrMAZVKagqRqcCc3hO_7zzE6kvOuCiPomAYuV85YIZTpPvJd8cyOh6NQbfoKYLHRIarA1kf86OhxLWxS-I_QrwyGq98c3-1gRoD-cA-psgAH2GUusT5wZDEzTvhCyRmgYYBJ3-EiQNyHzsxb6pHQXVwPasaXl0ZkYTJDeZ56w309ZYQrL2JwqkyRpVvZGREdnCIC-sm-V5g" 
            referrerPolicy="no-referrer"
          />
          <div className="relative z-10 max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-8xl font-headline font-semibold text-on-surface leading-tight tracking-tight mb-4"
            >
              The Curated Gallery
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl text-on-surface-variant font-medium mb-8"
            >
              Discover a refined collection of essential pieces, curated for the modern minimalist.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link 
                to="/shop" 
                className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-lg font-medium hover:opacity-90 transition-all shadow-lg active:scale-95"
              >
                Explore Collection
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-16">
        <div className="flex flex-wrap justify-center gap-12 md:gap-24">
          {[
            { label: 'Apparel', icon: <Shirt size={28} /> },
            { label: 'Timepieces', icon: <Watch size={28} /> },
            { label: 'Home', icon: <Armchair size={28} /> },
            { label: 'Audio', icon: <Headphones size={28} /> }
          ].map((cat, idx) => (
            <motion.div 
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="flex flex-col items-center gap-4 cursor-pointer group"
            >
              <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center group-hover:bg-surface-container transition-colors shadow-sm text-on-surface font-light">
                {cat.icon}
              </div>
              <span className="text-xs font-semibold text-on-surface uppercase tracking-widest text-center">{cat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-24">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-3xl font-headline font-semibold text-on-surface tracking-tight">Curated Essentials</h2>
            <p className="text-sm text-on-surface-variant mt-1 font-medium italic">Handpicked for your space</p>
          </div>
          <Link to="/shop" className="text-sm font-semibold text-primary hover:text-primary-container transition-colors hidden md:block uppercase tracking-widest underline underline-offset-4">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[450px]">
          {/* Main Feature */}
          <Link to="/product/1" className="md:col-span-2 bg-surface-container-lowest rounded-xl overflow-hidden relative group cursor-pointer border border-outline-variant/15 shadow-sm">
            <div className="absolute inset-0 p-12 flex items-center justify-center bg-surface-container-low/30">
              <img 
                alt="Feature" 
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBo6ujA9z-SMzmZ1CVYRKU7-_dKz-vr5lwd7xET0FdrV4F_63E0NdwFisx8sIat0GZvWMQS-9EuwesX6HSeSHN7D1eiN1o-HHq_7LaZzws6nq5jZqK-URIEmVToHwkcumznxixTaug8DSiDh-crDzrR_hFGxGCigL6NHOPgSBwqaFNH8KYtdBIedlZObnOeHaMZDQ5tW8lNpagvAqW5swn2bXwTs3DdDo5MDH_zxghx-COhraGu2WnT_KROxV7-2WXNrKVHAGALsHk" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/90 to-transparent">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-on-surface-variant font-bold mb-1 uppercase tracking-[0.2em]">Featured Release</p>
                  <h3 className="text-2xl font-semibold text-on-surface">Chronograph Series 1</h3>
                </div>
                <p className="text-lg font-medium text-on-surface">$299.00</p>
              </div>
            </div>
          </Link>
          
          {/* Secondary Features */}
          <Link to="/product/2" className="bg-surface-container-lowest rounded-xl overflow-hidden relative group cursor-pointer border border-outline-variant/15 shadow-sm">
            <div className="absolute inset-0 p-8 flex items-center justify-center bg-surface-container-low/30">
              <img 
                alt="Product" 
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxbbGEnbfvzNjAkFN2aVlT1dsw2dqS3X7uwzzIho_BGzFYD_qgbdKsTn4y8sATBI3yYi4uPmOFfj3jjcqOPOsg7VgHBDOSmzwieoP9gLSSzlUmx63Me-i67GjXdTYumluOfwF7NWr7cl5e3ju3RTZ59s926pyXmCPXgc8lalBRMGv9lFm7UtTQZl8lr97Zn0I26RY9nQJRWI4r09g-p1R6UKmH-fgg1WuPmTd86RvVrpDNXMqPJT0H6VwORcPJ5PVIF2AJGGFSnAE" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/90 to-transparent">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-on-surface-variant font-bold mb-1 uppercase tracking-[0.2em]">Audio</p>
                  <h3 className="text-xl font-semibold text-on-surface">Acoustic Over-Ear</h3>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/product/3" className="bg-surface-container-lowest rounded-xl overflow-hidden relative group cursor-pointer border border-outline-variant/15 shadow-sm">
            <div className="absolute inset-0 p-8 flex items-center justify-center bg-surface-container-low/30">
              <img 
                alt="Product" 
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2a8q-bZioYNpmfF0c46Z8fHRrHj7aT-HkBQ0Pe80cIoTthHsea-5MznNcxjijvWk5kBm2kE-KFfvzhpStTT_eJwOJwWxDDPYGpBp93JnId0bB3dk25FTfqwW3vmJWNypcZEikRKnja6SMk3bksVupMnn1-A1x_xEkaFB0mGoPsdbWo2FxOksQ__DQhSkqoKm4OjbGIjC4wyRXaV4iXcE9gIhLKhzcEnrvWT-tHO4XdG03cQgMPXzGw4BowIL7JcovMaB6pqJ0Sxk" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/90 to-transparent">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-on-surface-variant font-bold mb-1 uppercase tracking-[0.2em]">Workspace</p>
                  <h3 className="text-xl font-semibold text-on-surface">Alloy Stand</h3>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-stone-100/50 dark:bg-stone-900/50 py-32 px-4 md:px-8">
        <div className="max-w-screen-xl mx-auto text-center">
          <h2 className="text-4xl font-headline font-bold text-on-surface tracking-tight mb-4 italic">The Weekly Editorial</h2>
          <p className="text-on-surface-variant text-lg mb-12 max-w-lg mx-auto">Get design insights, exclusive early access, and curated collections delivered to your inbox.</p>
          <form className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow bg-surface-container-lowest border-none px-6 py-4 rounded-lg focus:ring-1 focus:ring-primary shadow-sm"
            />
            <button className="bg-on-surface text-surface py-4 px-10 rounded-lg font-medium hover:bg-on-surface/90 transition-colors uppercase tracking-widest text-xs">Join</button>
          </form>
        </div>
      </section>
    </div>
  );
}
