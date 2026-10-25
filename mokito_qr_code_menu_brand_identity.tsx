import React, { useState, useMemo, useEffect } from 'react';

// ============================================================================
// TYPES & DATA CONTRACTS
// ============================================================================

export type ProteinChoice = 'poulet' | 'viande';

export type DietaryTag = 'spicy' | 'chef' | 'bestseller' | 'veggie' | 'cheese' | 'sweet';

export type Allergen = 'gluten' | 'lactose' | 'nuts' | 'eggs' | 'fish';

export type DishType =
  | 'bread-bowl'
  | 'bread-bowl-gourmet'
  | 'bread-wich'
  | 'salade'
  | 'pasta'
  | 'dessert'
  | 'boisson'
  | 'supplement';

export interface Supplement {
  id: string;
  name: string;
  detail?: string;
  price: number;
}

export interface MenuItem {
  id: string;
  dishType: DishType;
  name: string;
  description: string;
  hasProteinChoice: boolean;
  prices?: {
    poulet: number;
    viande: number;
  };
  price?: number;
  spicy?: boolean;
  tags?: DietaryTag[];
  allergens?: Allergen[];
  isDessert?: boolean;
  isDrink?: boolean;
  suggestedPairingId?: string;
}

export interface MenuCategory {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  heroIllustration: React.ComponentType<{ className?: string; stroke?: string }>;
  items: MenuItem[];
}

export interface CartItem {
  cartId: string;
  itemId: string;
  dishType: DishType;
  name: string;
  protein: string | null;
  supplements: Supplement[];
  unitPrice: number;
  quantity: number;
  notes: string;
}

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'bell';
}

// ============================================================================
// BESPOKE ARTISANAL MONOLINE SVG SYSTEM
// (Artisanal French editorial monoline engraving system matching MOKiTO print menu)
// ============================================================================

export const MokitoWordmarkSVG: React.FC<{ className?: string; color?: string }> = ({
  className = 'h-20 sm:h-28 w-auto',
  color = 'currentColor'
}) => (
  <svg viewBox="0 0 380 125" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="MOKiTO - Cuisine Sincère">
    {/* M */}
    <path d="M28 84V14L54 64L80 14V84" stroke={color} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* O */}
    <rect x="104" y="14" width="42" height="70" rx="10" stroke={color} strokeWidth="5.5" />
    <line x1="125" y1="68" x2="125" y2="74" stroke={color} strokeWidth="4" strokeLinecap="round" />
    {/* K */}
    <path d="M172 14V84M172 50L208 14M183 39L210 84" stroke={color} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* i */}
    <circle cx="236" cy="20" r="4.5" fill={color} />
    <path d="M236 36V84" stroke={color} strokeWidth="5.5" strokeLinecap="round" />
    {/* T */}
    <path d="M258 14H302M280 14V84" stroke={color} strokeWidth="5.5" strokeLinecap="round" />
    {/* O */}
    <rect x="320" y="14" width="42" height="70" rx="10" stroke={color} strokeWidth="5.5" />
    <line x1="341" y1="68" x2="341" y2="74" stroke={color} strokeWidth="4" strokeLinecap="round" />
    {/* Subtitle: CUISINE SINCÈRE */}
    <text
      x="363"
      y="112"
      textAnchor="end"
      fill={color}
      style={{
        fontFamily: "'Oswald', sans-serif",
        fontSize: '15.5px',
        fontWeight: 500,
        letterSpacing: '0.26em'
      }}
    >
      CUISINE SINCÈRE
    </text>
  </svg>
);

export const PillarBreadIcon: React.FC<{ className?: string; stroke?: string }> = ({
  className = 'w-4 h-4',
  stroke = 'currentColor'
}) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 11C4 7 7.5 5 12 5C16.5 5 20 7 20 11V15C20 18 16.5 19 12 19C7.5 19 4 18 4 15V11Z" />
    <path d="M8 9C9.5 10 11 10 12 9" />
    <path d="M12 9C13 10 14.5 10 16 9" />
  </svg>
);

export const PillarCheeseIcon: React.FC<{ className?: string; stroke?: string }> = ({
  className = 'w-4 h-4',
  stroke = 'currentColor'
}) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 13L21 9L19 19H5L3 13Z" />
    <path d="M3 13C3 11 7 8 13 8C19 8 21 10 21 11" />
    <circle cx="8" cy="14" r="1.2" fill={stroke} />
    <circle cx="14" cy="13" r="1.5" fill={stroke} />
    <circle cx="11" cy="16.5" r="1" fill={stroke} />
  </svg>
);

export const PillarPotatoIcon: React.FC<{ className?: string; stroke?: string }> = ({
  className = 'w-4 h-4',
  stroke = 'currentColor'
}) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <ellipse cx="12" cy="12" rx="9" ry="6" transform="rotate(-15 12 12)" />
    <path d="M8 10h.01M15 11h.01M11 14h.01M16 14h.01" />
  </svg>
);

export const RunningServerIllustration: React.FC<{ className?: string; stroke?: string }> = ({
  className = 'w-64 h-64',
  stroke = '#1E1D1B'
}) => (
  <svg viewBox="0 0 280 230" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path d="M36 185C24 140 42 74 92 42C142 10 212 22 244 76" stroke={stroke} strokeWidth="1.2" strokeDasharray="4 5" opacity="0.35" />
    <path d="M142 26C131 23 121 31 118 43C115 55 111 62 106 66C116 69 125 67 130 62" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M139 26C150 26 157 35 157 47C157 59 160 66 165 70C155 71 148 67 146 62" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="137" cy="44" r="12" stroke={stroke} strokeWidth="2.4" />
    <path d="M132 41C133.5 39.8 135.5 39.8 137 41" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M141 41C142.5 39.8 144.5 39.8 146 41" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M133 48.5C136 51 141 51 143.5 47.5" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />

    {/* Torso & Jacket */}
    <path d="M123 66L102 112L125 121L136 84L146 119L166 111L151 66" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M130 67L136 77L143 67" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M126 105L145 104" stroke={stroke} strokeWidth="2" strokeLinecap="round" />

    {/* Left Arm with Steaming Bread Bowl */}
    <path d="M122 68L84 79L58 76" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M118 81L87 90L55 85" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M24 64C24 76 34 84 47 84C60 84 70 76 70 64H24Z" fill={stroke} stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M27 64C29 56 37 52 47 52C57 52 65 56 67 64" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M32 61C36 57 42 62 47 58C52 55 58 60 62 59" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M39 46C38 41 42 39 41 34" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" />
    <path d="M49 45C48 40 52 38 51 33" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" />
    <path d="M58 47C57 43 60 41 59 37" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" />

    {/* Right Arm with Fresh Salad Bowl */}
    <path d="M152 67L188 73L216 65" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M156 80L190 84L222 72" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M202 52C205 65 215 71 228 71C241 71 251 65 254 52H202Z" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" />
    <path d="M206 57H250" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M206 51C205 44 212 40 217 45C220 38 229 38 232 45C238 40 247 44 246 51" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="222" cy="48" r="2.5" fill={stroke} />
    <circle cx="236" cy="48" r="2.5" fill={stroke} />

    {/* Legs & Movement */}
    <path d="M114 116L106 158L81 162L81 176L120 173L131 124" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M138 122L160 161L141 187L151 197L181 164L155 115" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M69 159V183H80V159H69Z" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" />
    <line x1="73" y1="166" x2="79" y2="166" stroke={stroke} strokeWidth="1.6" />
    <line x1="73" y1="172" x2="79" y2="172" stroke={stroke} strokeWidth="1.6" />
    <path d="M136 189L155 208L163 200L144 181L136 189Z" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" />
    <line x1="48" y1="192" x2="95" y2="192" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" opacity="0.45" />
    <line x1="115" y1="214" x2="178" y2="214" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" opacity="0.45" />
  </svg>
);

export const ArtisanalSealBadgeSVG: React.FC<{ className?: string; stroke?: string }> = ({
  className = 'w-24 h-24',
  stroke = '#1E1D1B'
}) => (
  <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <circle cx="70" cy="70" r="64" stroke={stroke} strokeWidth="2.2" strokeDasharray="3 3" />
    <circle cx="70" cy="70" r="56" stroke={stroke} strokeWidth="1.4" />
    <path id="sealCirclePath" d="M70 20 A50 50 0 1 1 69.9 20" fill="none" />
    <text fill={stroke} style={{ fontFamily: "'Oswald', sans-serif", fontSize: '9px', fontWeight: 600, letterSpacing: '0.22em' }}>
      <textPath href="#sealCirclePath" startOffset="50%" textAnchor="middle">
        MOKiTO • CUISINE SINCÈRE • MENZAH 1
      </textPath>
    </text>
    <circle cx="70" cy="70" r="28" stroke={stroke} strokeWidth="1.5" />
    <text
      x="70"
      y="66"
      textAnchor="middle"
      fill={stroke}
      style={{ fontFamily: "'Oswald', sans-serif", fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em' }}
    >
      100%
    </text>
    <text
      x="70"
      y="79"
      textAnchor="middle"
      fill={stroke}
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em' }}
    >
      FAIT MAISON
    </text>
  </svg>
);

// ============================================================================
// 10/10 BESPOKE GOURMET SVG ARTWORK SYSTEM
// (Award-winning culinary vector illustrations with rich artisanal gradients,
// molten cheese flows, toasted sourdough crusts, fresh greens, and French bistro charm)
// ============================================================================

// --- 1. BREAD BOWLS CLASSIC HERO (viewBox 0 0 280 180) ---
export const BreadBowlArtisanalIllustration: React.FC<{ className?: string; stroke?: string }> = ({
  className = 'w-44 h-32',
  stroke = '#1E1D1B'
}) => (
  <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Bread Bowl Classic Artisanal">
    <defs>
      <linearGradient id="bb-hero-crust" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="45%" stopColor="#92400E" />
        <stop offset="100%" stopColor="#58290C" />
      </linearGradient>
      <linearGradient id="bb-hero-rim" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="50%" stopColor="#FDE68A" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="bb-hero-fondue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="35%" stopColor="#FBBF24" />
        <stop offset="85%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <radialGradient id="bb-hero-tomato" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#F87171" />
        <stop offset="55%" stopColor="#DC2626" />
        <stop offset="100%" stopColor="#7F1D1D" />
      </radialGradient>
      <linearGradient id="bb-hero-herb" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4ADE80" />
        <stop offset="70%" stopColor="#15803D" />
        <stop offset="100%" stopColor="#14532D" />
      </linearGradient>
      <linearGradient id="bb-hero-potato" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="65%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
      <filter id="bb-soft-shadow" x="-10%" y="-10%" width="120%" height="130%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Ground Tabletop Drop Shadow */}
    <ellipse cx="140" cy="162" rx="108" ry="12" fill={stroke} opacity="0.16" />

    {/* Roasted Golden Potato Wedges on the side */}
    <g transform="translate(14, 114)">
      <path d="M6 24C4 10 22 2 34 10C40 22 24 34 10 30Z" fill="url(#bb-hero-potato)" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 14C18 8 26 12 30 18" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="22" cy="18" r="1" fill="#FEF08A" />
      <line x1="16" y1="24" x2="20" y2="20" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" />
    </g>
    <g transform="translate(26, 134)">
      <path d="M4 18C2 6 18 0 28 6C34 16 20 26 8 22Z" fill="url(#bb-hero-potato)" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="16" cy="12" r="0.9" fill="#FEF08A" />
    </g>

    {/* Sourdough Round Boule Loaf Body */}
    <path
      d="M52 102C50 142 96 156 140 156C184 156 230 142 228 102C226 78 204 68 140 68C76 68 54 78 52 102Z"
      fill="url(#bb-hero-crust)"
      stroke={stroke}
      strokeWidth="2.8"
      strokeLinejoin="round"
    />

    {/* Baker's Score Marks on the Crust */}
    <path d="M66 116C76 128 92 136 108 140" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
    <path d="M64 117C74 129 90 137 106 141" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M214 116C204 128 188 136 172 140" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
    <path d="M216 117C206 129 190 137 174 141" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M140 134V152" stroke={stroke} strokeWidth="2" strokeLinecap="round" />

    {/* Hollowed Crust Rim with Toasted Edge */}
    <ellipse cx="140" cy="80" rx="82" ry="22" fill="url(#bb-hero-rim)" stroke={stroke} strokeWidth="2.8" />

    {/* Bubbling Molten Cheese Fondue Pool */}
    <ellipse cx="140" cy="82" rx="76" ry="19" fill="url(#bb-hero-fondue)" stroke={stroke} strokeWidth="1.8" />

    {/* Rich Cascading Cheese Drips Oozing over the Loaf Rim */}
    <path
      d="M68 84C72 104 82 118 90 108C94 102 92 90 94 84C102 96 114 114 122 106C128 98 124 88 130 84C136 94 146 122 154 114C160 106 156 90 162 84C170 96 182 118 190 108C196 100 192 88 204 84C212 92 218 88 220 82"
      fill="url(#bb-hero-fondue)"
      stroke={stroke}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Cheese Specular Highlights (Glistening Melted Sheen) */}
    <path d="M84 94C86 106 90 110 92 104" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.75" />
    <path d="M148 94C152 110 154 112 156 106" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.75" />
    <path d="M184 94C186 106 188 110 190 104" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.75" />
    <ellipse cx="132" cy="79" rx="18" ry="4" fill="#FFFFFF" opacity="0.3" />

    {/* Confit Aubergines & Courgettes Cubes nestled in fondue */}
    <rect x="104" y="72" width="13" height="12" rx="3" fill="#3B0764" stroke={stroke} strokeWidth="1.6" transform="rotate(-12 104 72)" />
    <rect x="106" y="74" width="9" height="3" fill="#C084FC" opacity="0.6" transform="rotate(-12 104 72)" />
    <rect x="156" y="74" width="12" height="11" rx="3" fill="#14532D" stroke={stroke} strokeWidth="1.6" transform="rotate(16 156 74)" />
    <rect x="158" y="76" width="8" height="3" fill="#86EFAC" opacity="0.6" transform="rotate(16 156 74)" />

    {/* Ripe Glossy Cherry Tomatoes */}
    <circle cx="126" cy="74" r="8.5" fill="url(#bb-hero-tomato)" stroke={stroke} strokeWidth="1.8" />
    <path d="M123 70C125 68 128 68 129 70" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
    <circle cx="180" cy="76" r="7.5" fill="url(#bb-hero-tomato)" stroke={stroke} strokeWidth="1.8" />
    <path d="M178 73C179 71 182 71 183 73" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" opacity="0.8" />

    {/* Fresh Wild Roquette & Basil Leaves Sprouting from Bowl */}
    <path
      d="M136 66C128 50 138 38 144 48C152 34 164 40 158 56C168 44 176 54 166 66Z"
      fill="url(#bb-hero-herb)"
      stroke={stroke}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M144 54L150 64" stroke="#86EFAC" strokeWidth="1.3" strokeLinecap="round" />

    {/* Rising Scent Steam Wisps */}
    <path d="M116 42C112 28 124 20 120 6" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" opacity="0.45" />
    <path d="M140 38C136 24 148 18 144 4" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" opacity="0.45" />
    <path d="M164 42C160 28 172 20 168 6" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" opacity="0.45" />
  </svg>
);

// --- 2. BREAD BOWLS GOURMETS HERO (viewBox 0 0 280 180) ---
export const BreadBowlGourmetArtisanalIllustration: React.FC<{ className?: string; stroke?: string }> = ({
  className = 'w-44 h-32',
  stroke = '#1E1D1B'
}) => (
  <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Bread Bowl Gourmet Artisanal">
    <defs>
      <linearGradient id="bbg-crust" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="45%" stopColor="#92400E" />
        <stop offset="100%" stopColor="#451A03" />
      </linearGradient>
      <linearGradient id="bbg-fondue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FEF9C3" />
        <stop offset="40%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#CA8A04" />
      </linearGradient>
      <linearGradient id="bbg-salmon" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FDBA74" />
        <stop offset="50%" stopColor="#FB923C" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
      <linearGradient id="bbg-gold" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="50%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#CA8A04" />
      </linearGradient>
    </defs>

    {/* Ground Shadow */}
    <ellipse cx="140" cy="162" rx="108" ry="12" fill={stroke} opacity="0.16" />

    {/* Sourdough Boule Base */}
    <path
      d="M52 102C50 142 96 156 140 156C184 156 230 142 228 102C226 78 204 68 140 68C76 68 54 78 52 102Z"
      fill="url(#bbg-crust)"
      stroke={stroke}
      strokeWidth="2.8"
      strokeLinejoin="round"
    />
    <path d="M66 116C76 128 92 136 108 140" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M214 116C204 128 188 136 172 140" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />

    {/* Truffle Infused Fondue Rim & Flow */}
    <ellipse cx="140" cy="80" rx="82" ry="22" fill="#FDE68A" stroke={stroke} strokeWidth="2.8" />
    <ellipse cx="140" cy="82" rx="76" ry="19" fill="url(#bbg-fondue)" stroke={stroke} strokeWidth="1.8" />

    {/* Flowing Fondue Drips */}
    <path
      d="M74 84C76 106 86 118 92 108C98 98 96 88 100 84C106 96 116 116 124 108C130 100 126 88 134 84C140 96 150 120 158 112C164 104 160 88 170 84C178 96 188 116 196 106C200 98 196 88 206 84"
      fill="url(#bbg-fondue)"
      stroke={stroke}
      strokeWidth="2.4"
      strokeLinecap="round"
    />

    {/* Smoked Salmon Rosette Ribbons */}
    <g transform="translate(100, 60)">
      <path
        d="M12 24C6 14 16 4 28 8C36 12 34 22 28 26C22 30 16 30 12 24Z"
        fill="url(#bbg-salmon)"
        stroke={stroke}
        strokeWidth="2"
      />
      <path d="M16 16C20 12 26 14 28 18" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
    </g>
    <g transform="translate(138, 58)">
      <path
        d="M10 24C4 16 14 6 26 10C34 14 32 24 26 28C20 32 14 30 10 24Z"
        fill="url(#bbg-salmon)"
        stroke={stroke}
        strokeWidth="2"
      />
      <path d="M14 16C18 12 24 14 26 18" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
    </g>

    {/* Shaved Black Truffle Flakes */}
    <path d="M86 78C82 72 88 66 94 68C98 72 96 78 90 80Z" fill="#1C1917" stroke={stroke} strokeWidth="1.5" />
    <path d="M174 76C170 70 178 64 184 66C188 70 186 78 180 80Z" fill="#1C1917" stroke={stroke} strokeWidth="1.5" />

    {/* Shaved Grana Padano Cheese Flakes */}
    <polygon points="160,68 174,62 170,72" fill="#FEF9C3" stroke={stroke} strokeWidth="1.6" />
    <polygon points="126,82 138,78 134,86" fill="#FEF9C3" stroke={stroke} strokeWidth="1.6" />

    {/* Whole Roasted Walnut Halves */}
    <ellipse cx="84" cy="90" rx="9" ry="7" fill="#78350F" stroke={stroke} strokeWidth="1.8" transform="rotate(-15 84 90)" />
    <path d="M78 90C82 86 86 94 90 90" stroke="#FDE68A" strokeWidth="1.3" strokeLinecap="round" />

    {/* Golden Royal Chef's Crown Suspended in Rising Aroma */}
    <g transform="translate(122, 12)">
      <path d="M0 24L8 10L18 20L28 10L36 24H0Z" fill="url(#bbg-gold)" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="2.8" fill="#FDE047" stroke={stroke} strokeWidth="1.6" />
      <circle cx="18" cy="4" r="3.2" fill="#FDE047" stroke={stroke} strokeWidth="1.6" />
      <circle cx="28" cy="8" r="2.8" fill="#FDE047" stroke={stroke} strokeWidth="1.6" />
      <circle cx="18" cy="18" r="2" fill="#C83E2B" />
    </g>

    {/* Scent Swirls */}
    <path d="M102 46C98 34 108 26 104 16" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
    <path d="M176 46C172 34 182 26 178 16" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
  </svg>
);

// --- 3. BREAD-WICH HERO (viewBox 0 0 280 180) ---
export const BreadWichArtisanalIllustration: React.FC<{ className?: string; stroke?: string }> = ({
  className = 'w-44 h-32',
  stroke = '#1E1D1B'
}) => (
  <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Bread-Wich Artisanal">
    <defs>
      <linearGradient id="bw-baguette-top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="30%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#854D0E" />
      </linearGradient>
      <linearGradient id="bw-baguette-bot" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#58290C" />
      </linearGradient>
      <linearGradient id="bw-cheese" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="bw-merguez" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#DC2626" />
        <stop offset="50%" stopColor="#991B1B" />
        <stop offset="100%" stopColor="#450A0A" />
      </linearGradient>
    </defs>

    {/* Ground Shadow */}
    <ellipse cx="140" cy="162" rx="108" ry="12" fill={stroke} opacity="0.16" />

    {/* Bottom Baguette Foundation */}
    <path
      d="M44 104L124 142C134 146 146 144 154 138L236 98C244 94 246 84 238 78L216 70L40 94C38 100 40 102 44 104Z"
      fill="url(#bw-baguette-bot)"
      stroke={stroke}
      strokeWidth="2.8"
      strokeLinejoin="round"
    />

    {/* Melted Cheese & Sautéed Fillings Layer */}
    <path
      d="M40 88C52 98 70 104 84 94C96 86 112 108 126 98C140 88 156 108 174 96C188 88 204 104 220 92C230 84 238 90 242 86"
      fill="url(#bw-cheese)"
      stroke={stroke}
      strokeWidth="2.4"
      strokeLinecap="round"
    />

    {/* Sizzling Grilled Merguez / Chorizo Rounds */}
    <ellipse cx="68" cy="98" rx="11" ry="8" fill="url(#bw-merguez)" stroke={stroke} strokeWidth="2" transform="rotate(-15 68 98)" />
    <circle cx="68" cy="98" r="2" fill="#FEF08A" opacity="0.7" />
    <ellipse cx="120" cy="106" rx="12" ry="9" fill="url(#bw-merguez)" stroke={stroke} strokeWidth="2" transform="rotate(10 120 106)" />
    <circle cx="120" cy="106" r="2.2" fill="#FEF08A" opacity="0.7" />
    <ellipse cx="178" cy="100" rx="11" ry="8" fill="url(#bw-merguez)" stroke={stroke} strokeWidth="2" transform="rotate(-8 178 100)" />

    {/* Caramelized Golden Onions */}
    <path d="M96 98C90 108 102 116 108 108" stroke="#CA8A04" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M148 102C144 114 156 118 160 110" stroke="#CA8A04" strokeWidth="2.2" strokeLinecap="round" />

    {/* Dramatic Molten Cheese Pull Stretching Downwards */}
    <path d="M84 96C84 124 96 136 102 122C106 112 102 98 100 94" fill="url(#bw-cheese)" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M142 98C144 132 158 140 166 124C170 114 164 98 162 92" fill="url(#bw-cheese)" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
    <line x1="88" y1="104" x2="90" y2="124" stroke="#FFF" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
    <line x1="148" y1="106" x2="152" y2="128" stroke="#FFF" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />

    {/* Top Golden Panini-Pressed Baguette Half */}
    <path
      d="M36 78C46 56 154 30 220 54C232 58 238 70 228 80L154 118C142 124 128 122 118 114L36 78Z"
      fill="url(#bw-baguette-top)"
      stroke={stroke}
      strokeWidth="2.8"
      strokeLinejoin="round"
    />

    {/* Panini Press Diagonal Char Marks */}
    <line x1="74" y1="68" x2="96" y2="82" stroke="#451A03" strokeWidth="3.2" strokeLinecap="round" />
    <line x1="106" y1="60" x2="130" y2="76" stroke="#451A03" strokeWidth="3.2" strokeLinecap="round" />
    <line x1="138" y1="54" x2="164" y2="72" stroke="#451A03" strokeWidth="3.2" strokeLinecap="round" />
    <line x1="172" y1="52" x2="198" y2="70" stroke="#451A03" strokeWidth="3.2" strokeLinecap="round" />

    {/* Spicy Pepper Accent */}
    <g transform="translate(228, 90)">
      <path
        d="M6 2C12 2 16 10 12 18C10 22 4 22 2 16C0 10 2 2 6 2Z"
        fill="#DC2626"
        stroke="#7F1D1D"
        strokeWidth="1.5"
      />
      <path d="M12 4C14 0 18 0 18 2" stroke="#15803D" strokeWidth="1.8" strokeLinecap="round" />
    </g>

    {/* Sizzle Steam */}
    <path d="M100 36C96 24 106 18 102 6" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" opacity="0.45" />
    <path d="M150 32C146 20 156 14 152 4" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" opacity="0.45" />
  </svg>
);

// --- 4. SALADES REPAS HERO (viewBox 0 0 280 180) ---
export const SaladesArtisanalIllustration: React.FC<{ className?: string; stroke?: string }> = ({
  className = 'w-44 h-32',
  stroke = '#1E1D1B'
}) => (
  <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Salades Repas Artisanal">
    <defs>
      <linearGradient id="sal-bowl" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F8F3EA" />
        <stop offset="100%" stopColor="#DFD2C0" />
      </linearGradient>
      <linearGradient id="sal-greens" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4ADE80" />
        <stop offset="60%" stopColor="#16A34A" />
        <stop offset="100%" stopColor="#14532D" />
      </linearGradient>
      <radialGradient id="sal-yolk" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="45%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </radialGradient>
      <linearGradient id="sal-chicken" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="60%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#854D0E" />
      </linearGradient>
      <linearGradient id="sal-crouton" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="70%" stopColor="#CA8A04" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
    </defs>

    {/* Ground Shadow */}
    <ellipse cx="140" cy="162" rx="108" ry="12" fill={stroke} opacity="0.16" />

    {/* Rustic Ceramic Bowl Body */}
    <path
      d="M38 90C48 144 94 158 140 158C186 158 232 144 242 90H38Z"
      fill="url(#sal-bowl)"
      stroke={stroke}
      strokeWidth="2.8"
      strokeLinejoin="round"
    />
    <path d="M30 90H250" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
    <path d="M106 158V164H174V158" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" />

    {/* Heaping Bed of Fresh Curly Salad Greens & Roquette */}
    <path
      d="M50 88C44 68 58 54 72 64C80 46 102 48 106 64C120 44 146 44 152 62C166 46 190 50 194 68C208 58 226 66 226 88Z"
      fill="url(#sal-greens)"
      stroke={stroke}
      strokeWidth="2.4"
      strokeLinejoin="round"
    />

    {/* Halved Oeuf Mollet (Soft-Boiled Egg with Glorious Runny Yolk) */}
    <g transform="translate(74, 58)">
      <ellipse cx="24" cy="20" rx="22" ry="17" fill="#FFFFFF" stroke={stroke} strokeWidth="2.2" transform="rotate(-15 24 20)" />
      <circle cx="24" cy="20" r="10.5" fill="url(#sal-yolk)" stroke={stroke} strokeWidth="1.8" />
      <path d="M20 16C22 14 26 14 27 16" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
      {/* Liquid Yolk Drip */}
      <path d="M22 28C24 34 28 34 28 28" fill="#F59E0B" />
    </g>

    {/* Grilled Golden Chicken Breast Strips with Char Stripes */}
    <g transform="translate(142, 60)">
      <rect x="0" y="0" width="46" height="15" rx="5" fill="url(#sal-chicken)" stroke={stroke} strokeWidth="2" transform="rotate(12 0 0)" />
      <line x1="8" y1="2" x2="12" y2="13" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="4" x2="24" y2="15" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="6" x2="36" y2="17" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
    </g>

    {/* Crispy Golden Croutons Maison */}
    <rect x="180" y="68" width="14" height="14" rx="3" fill="url(#sal-crouton)" stroke={stroke} strokeWidth="1.8" transform="rotate(22 180 68)" />
    <rect x="134" y="80" width="13" height="13" rx="3" fill="url(#sal-crouton)" stroke={stroke} strokeWidth="1.8" transform="rotate(-14 134 80)" />

    {/* Ripe Glossy Cherry Tomatoes */}
    <circle cx="62" cy="80" r="9" fill="#DC2626" stroke={stroke} strokeWidth="1.8" />
    <path d="M59 76C61 74 64 74 65 76" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
    <circle cx="218" cy="80" r="8.5" fill="#DC2626" stroke={stroke} strokeWidth="1.8" />
    <path d="M216 76C218 74 220 74 221 76" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />

    {/* Caesar / Pesto Dressing Drizzle Swirls */}
    <path d="M78 52C102 44 136 54 162 46C186 38 206 50 220 46" stroke="#FEF08A" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="6 4" />
  </svg>
);

// --- 5. PASTA COQUILLETTES HERO (viewBox 0 0 280 180) ---
export const PastaCoquillettesArtisanalIllustration: React.FC<{ className?: string; stroke?: string }> = ({
  className = 'w-44 h-32',
  stroke = '#1E1D1B'
}) => (
  <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Pasta Coquillettes Artisanal">
    <defs>
      <linearGradient id="pas-skillet" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#44403C" />
        <stop offset="50%" stopColor="#292524" />
        <stop offset="100%" stopColor="#1C1917" />
      </linearGradient>
      <linearGradient id="pas-cheese" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <linearGradient id="pas-noodle" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="70%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#EAB308" />
      </linearGradient>
    </defs>

    {/* Ground Shadow */}
    <ellipse cx="130" cy="162" rx="100" ry="12" fill={stroke} opacity="0.16" />

    {/* Cast Iron Skillet Body with Helper Handle */}
    <path
      d="M48 108C48 138 84 154 132 154C180 154 216 138 216 108"
      fill="url(#pas-skillet)"
      stroke={stroke}
      strokeWidth="2.8"
    />
    <ellipse cx="132" cy="108" rx="84" ry="30" fill="url(#pas-skillet)" stroke={stroke} strokeWidth="2.8" />
    {/* Skillet Sturdy Long Handle */}
    <path d="M216 106L256 96C262 94 266 98 264 103L258 112L214 122" fill="url(#pas-skillet)" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" />

    {/* Melted Cheese Fondue Sauce Foundation */}
    <ellipse cx="132" cy="108" rx="76" ry="24" fill="url(#pas-cheese)" stroke={stroke} strokeWidth="1.8" />

    {/* Golden Curved Coquillettes Elbows */}
    <g stroke={stroke} strokeWidth="2" strokeLinecap="round">
      <path d="M80 106C74 94 88 84 100 88C104 96 96 104 88 102" fill="url(#pas-noodle)" />
      <path d="M110 110C106 98 120 90 132 94C136 102 126 110 118 106" fill="url(#pas-noodle)" />
      <path d="M144 108C140 96 154 88 166 92C170 100 160 108 152 104" fill="url(#pas-noodle)" />
      <path d="M168 114C164 104 178 96 188 100C192 108 182 116 174 112" fill="url(#pas-noodle)" />
      <path d="M92 124C86 114 98 106 108 110" fill="url(#pas-noodle)" />
      <path d="M128 126C122 116 134 108 144 112" fill="url(#pas-noodle)" />
      <path d="M156 126C150 116 162 108 172 112" fill="url(#pas-noodle)" />
    </g>

    {/* Sliced Brown Button Mushroom */}
    <path d="M68 116C68 108 76 104 84 105C86 109 86 114 84 116H68Z" fill="#78350F" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" />

    {/* Silver Fork Lifting an Epic Stretchy String of Cheese */}
    <path
      d="M130 90C128 64 136 48 132 30"
      fill="none"
      stroke="url(#pas-cheese)"
      strokeWidth="4.5"
      strokeLinecap="round"
    />
    <path d="M130 90C128 64 136 48 132 30" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M122 88C124 66 128 50 130 30" fill="none" stroke="#FEF08A" strokeWidth="2" strokeLinecap="round" />
    <path d="M138 88C136 66 134 50 134 30" fill="none" stroke="#FEF08A" strokeWidth="2" strokeLinecap="round" />

    {/* Fork Head */}
    <g transform="translate(120, 2)">
      <path d="M2 28H22V18C22 10 2 10 2 18V28Z" fill="#E2E8F0" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" />
      <line x1="12" y1="10" x2="12" y2="0" stroke={stroke} strokeWidth="2.8" strokeLinecap="round" />
    </g>

    {/* Rising Scent Steam */}
    <path d="M104 70C100 58 108 50 106 38" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" opacity="0.45" />
    <path d="M162 70C158 58 166 50 164 38" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" opacity="0.45" />
  </svg>
);

// --- 6. DESSERTS EN BOCAL HERO (viewBox 0 0 280 180) ---
export const DessertsJarArtisanalIllustration: React.FC<{ className?: string; stroke?: string }> = ({
  className = 'w-44 h-32',
  stroke = '#1E1D1B'
}) => (
  <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Desserts en Bocal Artisanal">
    <defs>
      <linearGradient id="des-glass" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.4" />
        <stop offset="50%" stopColor="#BAE6FD" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0.4" />
      </linearGradient>
      <linearGradient id="des-nutella" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#451A03" />
        <stop offset="100%" stopColor="#291508" />
      </linearGradient>
      <linearGradient id="des-cream" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="100%" stopColor="#FEF3C7" />
      </linearGradient>
      <linearGradient id="des-speculoos" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="50%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
    </defs>

    {/* Ground Shadow */}
    <ellipse cx="140" cy="162" rx="90" ry="12" fill={stroke} opacity="0.16" />

    {/* Tilted French "Le Parfait" Mason Jar */}
    <g transform="rotate(10 120 90)">
      {/* Jar Glass Body */}
      <path
        d="M86 48L80 126C80 138 96 146 120 146C144 146 160 138 160 126L154 48H86Z"
        fill="url(#des-glass)"
        stroke={stroke}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Layer 1 (Bottom): Spiced Cinnamon Spéculoos Crunch */}
      <path
        d="M81 112L80 126C80 138 96 146 120 146C144 146 160 138 160 126L159 112C148 116 132 110 120 114C108 118 92 110 81 112Z"
        fill="url(#des-speculoos)"
        stroke={stroke}
        strokeWidth="1.8"
      />
      <circle cx="102" cy="130" r="1.8" fill="#FDE68A" />
      <circle cx="120" cy="134" r="1.8" fill="#FDE68A" />
      <circle cx="138" cy="128" r="1.8" fill="#FDE68A" />

      {/* Layer 2 (Middle): Fluffy Whipped Mascarpone Cream */}
      <path
        d="M83 82L81 112C92 110 108 118 120 114C132 110 148 116 159 112L157 82C146 88 132 80 120 84C108 88 94 80 83 82Z"
        fill="url(#des-cream)"
        stroke={stroke}
        strokeWidth="1.8"
      />

      {/* Layer 3 (Top): Decadent Nutella Chocolate Swirl */}
      <path
        d="M85 54L83 82C94 80 108 88 120 84C132 80 146 88 157 82L155 54C144 60 132 52 120 56C108 60 96 52 85 54Z"
        fill="url(#des-nutella)"
        stroke={stroke}
        strokeWidth="1.8"
      />

      {/* Glass Jar Threaded Rim & Mechanical Wire Clamp */}
      <ellipse cx="120" cy="46" rx="35" ry="9" fill="#E0F2FE" stroke={stroke} strokeWidth="2.6" />
      <path d="M85 46V54C85 59 100 62 120 62C140 62 155 59 155 54V46" stroke={stroke} strokeWidth="2.2" />
      <path d="M80 48H74V56H82" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      <path d="M160 48H166V56H158" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />

      {/* Glass Specular Reflection Glint Lines */}
      <line x1="92" y1="58" x2="88" y2="128" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.65" />
      <line x1="98" y1="60" x2="94" y2="126" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.45" />
    </g>

    {/* Artisan Silver Dessert Spoon Resting Beside Jar */}
    <g transform="rotate(22 186 90)">
      <path
        d="M182 30C176 30 174 34 175 42L180 94C170 98 166 110 168 120C171 130 180 136 188 135C196 134 201 125 200 114C198 104 192 96 186 94L186 42C186 34 184 30 182 30Z"
        fill="#E2E8F0"
        stroke={stroke}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="184" cy="144" r="2.8" fill={stroke} />
    </g>
  </svg>
);

// --- 7. BOISSONS HERO (viewBox 0 0 280 180) ---
export const BoissonsArtisanalIllustration: React.FC<{ className?: string; stroke?: string }> = ({
  className = 'w-44 h-32',
  stroke = '#1E1D1B'
}) => (
  <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Boissons Fraîches Artisanal">
    <defs>
      <linearGradient id="boi-drink" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#BEF264" />
        <stop offset="50%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#EAB308" />
      </linearGradient>
      <linearGradient id="boi-glass" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.2" />
      </linearGradient>
      <linearGradient id="boi-crema" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#B45309" />
        <stop offset="50%" stopColor="#78350F" />
        <stop offset="100%" stopColor="#451A03" />
      </linearGradient>
    </defs>

    {/* Ground Shadow */}
    <ellipse cx="140" cy="162" rx="100" ry="12" fill={stroke} opacity="0.16" />

    {/* Tall Faceted Iced Citronnade / Mojito Glass */}
    <path
      d="M74 58L84 144C85 150 96 154 110 154C124 154 135 150 136 144L146 58H74Z"
      fill="url(#boi-glass)"
      stroke={stroke}
      strokeWidth="2.8"
      strokeLinejoin="round"
    />
    <path
      d="M77 70L85 142C86 146 95 150 110 150C125 150 134 146 135 142L143 70H77Z"
      fill="url(#boi-drink)"
      stroke={stroke}
      strokeWidth="1.6"
    />
    <ellipse cx="110" cy="58" rx="36" ry="8" fill="#E0F2FE" stroke={stroke} strokeWidth="2.6" />

    {/* Striped Paper Straw */}
    <line x1="120" y1="58" x2="144" y2="16" stroke="#C83E2B" strokeWidth="4.5" strokeLinecap="round" />
    <line x1="120" y1="58" x2="144" y2="16" stroke="#FFFFFF" strokeWidth="4.5" strokeDasharray="4 4" strokeLinecap="round" />
    <line x1="120" y1="58" x2="144" y2="16" stroke={stroke} strokeWidth="4.5" strokeLinecap="round" opacity="0.25" />

    {/* Sliced Fresh Citrus Wheel on Rim */}
    <g transform="translate(74, 52)">
      <circle cx="0" cy="0" r="18" fill="#FACC15" stroke={stroke} strokeWidth="2.4" />
      <circle cx="0" cy="0" r="13" fill="#FEF08A" stroke={stroke} strokeWidth="1.6" />
      <line x1="0" y1="-13" x2="0" y2="13" stroke="#CA8A04" strokeWidth="1.4" />
      <line x1="-13" y1="0" x2="13" y2="0" stroke="#CA8A04" strokeWidth="1.4" />
      <line x1="-9" y1="-9" x2="9" y2="9" stroke="#CA8A04" strokeWidth="1.4" />
      <line x1="-9" y1="9" x2="9" y2="-9" stroke="#CA8A04" strokeWidth="1.4" />
    </g>

    {/* Translucent Ice Cubes Inside Glass */}
    <rect x="94" y="78" width="16" height="15" rx="3" fill="#FFFFFF" opacity="0.65" stroke={stroke} strokeWidth="1.8" transform="rotate(14 94 78)" />
    <rect x="106" y="106" width="17" height="16" rx="3" fill="#FFFFFF" opacity="0.65" stroke={stroke} strokeWidth="1.8" transform="rotate(-15 106 106)" />

    {/* Fresh Emerald Mint Leaves */}
    <path d="M124 64C134 54 144 58 140 68C132 72 126 70 124 64Z" fill="#15803D" stroke={stroke} strokeWidth="1.8" />
    <circle cx="96" cy="128" r="2.2" fill="#FFFFFF" opacity="0.75" />
    <circle cx="124" cy="98" r="2.2" fill="#FFFFFF" opacity="0.75" />

    {/* Porcelain Espresso Cup & Saucer */}
    <g transform="translate(186, 114)">
      <ellipse cx="24" cy="28" rx="32" ry="8" fill="#F8F3EA" stroke={stroke} strokeWidth="2.4" />
      <path d="M4 4V18C4 26 12 28 24 28C36 28 44 26 44 18V4H4Z" fill="#F8F3EA" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" />
      <ellipse cx="24" cy="6" rx="20" ry="5" fill="url(#boi-crema)" stroke={stroke} strokeWidth="1.8" />
      <path d="M44 8C52 8 54 16 44 18" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" />
      {/* Espresso Steam Swirls */}
      <path d="M20 -4C18 -14 26 -18 24 -26" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
      <path d="M30 -4C28 -14 36 -18 34 -26" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
    </g>
  </svg>
);

// --- 8. SUPPLÉMENTS HERO (viewBox 0 0 280 180) ---
export const SupplementsArtisanalIllustration: React.FC<{ className?: string; stroke?: string }> = ({
  className = 'w-44 h-32',
  stroke = '#1E1D1B'
}) => (
  <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Suppléments & Camembert Rôti">
    <defs>
      <linearGradient id="sup-pan" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#44403C" />
        <stop offset="100%" stopColor="#1C1917" />
      </linearGradient>
      <linearGradient id="sup-camembert" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FEF9C3" />
        <stop offset="45%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#CA8A04" />
      </linearGradient>
      <linearGradient id="sup-honey" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>

    {/* Ground Shadow */}
    <ellipse cx="140" cy="162" rx="104" ry="12" fill={stroke} opacity="0.16" />

    {/* Cast Iron Cocotte with Loop Handles */}
    <path d="M54 104C54 134 88 150 140 150C192 150 226 134 226 104" fill="url(#sup-pan)" stroke={stroke} strokeWidth="2.8" />
    <ellipse cx="140" cy="104" rx="86" ry="28" fill="url(#sup-pan)" stroke={stroke} strokeWidth="2.8" />
    <path d="M42 102C42 96 54 96 54 102" stroke={stroke} strokeWidth="2.8" strokeLinecap="round" />
    <path d="M226 102C226 96 238 96 238 102" stroke={stroke} strokeWidth="2.8" strokeLinecap="round" />

    {/* Whole Roasted Camembert Round in Center with Scored Bloomy Rind */}
    <ellipse cx="140" cy="98" rx="52" ry="19" fill="#FFFBEB" stroke={stroke} strokeWidth="2.4" />
    <ellipse cx="140" cy="98" rx="46" ry="16" fill="url(#sup-camembert)" stroke={stroke} strokeWidth="1.8" />

    {/* Diamond Cross-Hatch Crust Incisions */}
    <line x1="110" y1="94" x2="170" y2="102" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
    <line x1="114" y1="102" x2="166" y2="94" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />

    {/* Wild Mountain Honey Dripping from Camembert */}
    <path d="M124 104C124 122 134 130 140 120" fill="url(#sup-honey)" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M152 104C154 118 162 124 166 116" fill="url(#sup-honey)" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />

    {/* Fresh Rosemary Sprig */}
    <path d="M116 90C128 92 152 86 164 90" stroke="#15803D" strokeWidth="2.4" strokeLinecap="round" />
    <line x1="128" y1="91" x2="126" y2="84" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
    <line x1="142" y1="90" x2="144" y2="82" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
    <line x1="154" y1="90" x2="158" y2="84" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />

    {/* Halved Oeuf Mollet on Rim */}
    <g transform="translate(68, 86)">
      <ellipse cx="14" cy="12" rx="14" ry="10" fill="#FFFFFF" stroke={stroke} strokeWidth="2" transform="rotate(-18 14 12)" />
      <circle cx="14" cy="12" r="6" fill="#F59E0B" stroke={stroke} strokeWidth="1.5" />
    </g>

    {/* Roasted Country Potato Wedge on Rim */}
    <path d="M194 88C200 80 214 84 216 94C208 100 196 98 194 88Z" fill="#F59E0B" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />

    {/* Scent Wisps */}
    <path d="M128 72C124 60 134 54 130 42" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
    <path d="M152 72C148 60 158 54 154 42" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
  </svg>
);

// ============================================================================
// DEDICATED INDIVIDUAL DISH ILLUSTRATIONS (viewBox 0 0 100 100)
// (Crisp, mouthwatering vector miniatures displayed on each dish card & modal)
// ============================================================================

export const DishBreadBowlClassicSVG: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="BB Classic">
    <ellipse cx="50" cy="88" rx="40" ry="6" fill="#1E1D1B" opacity="0.14" />
    {/* Loaf */}
    <path d="M16 54C14 76 34 86 50 86C66 86 86 76 84 54C82 42 74 36 50 36C26 36 18 42 16 54Z" fill="#92400E" stroke="#1E1D1B" strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M24 64C30 72 40 76 50 78" stroke="#1E1D1B" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M76 64C70 72 60 76 50 78" stroke="#1E1D1B" strokeWidth="1.6" strokeLinecap="round" />
    {/* Fondue Rim & Melt */}
    <ellipse cx="50" cy="44" rx="32" ry="11" fill="#FEF08A" stroke="#1E1D1B" strokeWidth="2.2" />
    <ellipse cx="50" cy="45" rx="28" ry="9" fill="#F59E0B" />
    {/* Cheese Drips */}
    <path d="M26 46C28 58 34 66 38 60C42 54 40 48 42 46C46 54 52 68 56 62C60 56 58 48 62 46C66 54 72 64 76 58" fill="#F59E0B" stroke="#1E1D1B" strokeWidth="1.8" strokeLinecap="round" />
    {/* Tomato & Veggie */}
    <circle cx="44" cy="42" r="5" fill="#DC2626" stroke="#1E1D1B" strokeWidth="1.4" />
    <circle cx="42" cy="40" r="1.2" fill="#FFFFFF" />
    <rect x="54" y="39" width="7" height="6" rx="1.5" fill="#3B0764" stroke="#1E1D1B" strokeWidth="1.2" />
    <path d="M48 38C44 28 52 24 54 30C58 24 64 26 62 34" fill="#16A34A" stroke="#1E1D1B" strokeWidth="1.4" />
  </svg>
);

export const DishBreadBowlItalienSVG: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="BB Italien">
    <ellipse cx="50" cy="88" rx="40" ry="6" fill="#1E1D1B" opacity="0.14" />
    <path d="M16 54C14 76 34 86 50 86C66 86 86 76 84 54C82 42 74 36 50 36C26 36 18 42 16 54Z" fill="#92400E" stroke="#1E1D1B" strokeWidth="2.2" strokeLinejoin="round" />
    <ellipse cx="50" cy="44" rx="32" ry="11" fill="#FEF08A" stroke="#1E1D1B" strokeWidth="2.2" />
    <ellipse cx="50" cy="45" rx="28" ry="9" fill="#F59E0B" />
    {/* Bresaola Rosettes */}
    <path d="M36 40C32 34 40 28 46 32C50 36 48 44 42 44C38 44 36 42 36 40Z" fill="#991B1B" stroke="#1E1D1B" strokeWidth="1.5" />
    <path d="M52 38C48 32 56 26 62 30C66 34 64 42 58 42C54 42 52 40 52 38Z" fill="#991B1B" stroke="#1E1D1B" strokeWidth="1.5" />
    {/* Grana Flakes & Basil Oil */}
    <polygon points="46,38 54,34 52,42" fill="#FEF9C3" stroke="#1E1D1B" strokeWidth="1.2" />
    <path d="M38 48C44 50 56 46 64 48" stroke="#15803D" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const DishBreadBowlMexicainSVG: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="BB Mexicain">
    <ellipse cx="50" cy="88" rx="40" ry="6" fill="#1E1D1B" opacity="0.14" />
    <path d="M16 54C14 76 34 86 50 86C66 86 86 76 84 54C82 42 74 36 50 36C26 36 18 42 16 54Z" fill="#92400E" stroke="#1E1D1B" strokeWidth="2.2" strokeLinejoin="round" />
    <ellipse cx="50" cy="44" rx="32" ry="11" fill="#FEF08A" stroke="#1E1D1B" strokeWidth="2.2" />
    <ellipse cx="50" cy="45" rx="28" ry="9" fill="#EA580C" />
    {/* Chorizo Slices */}
    <circle cx="38" cy="42" r="5.5" fill="#B91C1C" stroke="#1E1D1B" strokeWidth="1.4" />
    <circle cx="38" cy="42" r="1.5" fill="#FDE047" />
    <circle cx="58" cy="42" r="5.5" fill="#B91C1C" stroke="#1E1D1B" strokeWidth="1.4" />
    <circle cx="58" cy="42" r="1.5" fill="#FDE047" />
    {/* Red Chili Pepper */}
    <path d="M46 36C50 30 58 32 54 40C52 44 48 44 46 40Z" fill="#DC2626" stroke="#1E1D1B" strokeWidth="1.4" />
    <path d="M52 30C54 26 58 26 58 28" stroke="#15803D" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const DishBreadBowlTruffeeSVG: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="BB Truffée">
    <ellipse cx="50" cy="88" rx="40" ry="6" fill="#1E1D1B" opacity="0.14" />
    <path d="M16 54C14 76 34 86 50 86C66 86 86 76 84 54C82 42 74 36 50 36C26 36 18 42 16 54Z" fill="#92400E" stroke="#1E1D1B" strokeWidth="2.2" strokeLinejoin="round" />
    <ellipse cx="50" cy="44" rx="32" ry="11" fill="#FEF08A" stroke="#1E1D1B" strokeWidth="2.2" />
    <ellipse cx="50" cy="45" rx="28" ry="9" fill="#58290C" />
    {/* Black Truffle Shavings */}
    <path d="M40 40C38 36 44 32 48 34C50 36 48 42 44 42Z" fill="#1C1917" stroke="#1E1D1B" strokeWidth="1.2" />
    <path d="M56 38C54 34 60 30 64 32C66 34 64 40 60 40Z" fill="#1C1917" stroke="#1E1D1B" strokeWidth="1.2" />
    {/* Walnut Half */}
    <ellipse cx="48" cy="48" rx="6" ry="4.5" fill="#78350F" stroke="#1E1D1B" strokeWidth="1.4" />
    <path d="M44 48C46 46 50 50 52 48" stroke="#FDE68A" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export const DishBreadBowlCremeuxSVG: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="BB Crémeux">
    <ellipse cx="50" cy="88" rx="40" ry="6" fill="#1E1D1B" opacity="0.14" />
    <path d="M16 54C14 76 34 86 50 86C66 86 86 76 84 54C82 42 74 36 50 36C26 36 18 42 16 54Z" fill="#92400E" stroke="#1E1D1B" strokeWidth="2.2" strokeLinejoin="round" />
    {/* Triple Cheese Melts */}
    <ellipse cx="50" cy="44" rx="32" ry="11" fill="#FFFBEB" stroke="#1E1D1B" strokeWidth="2.2" />
    <ellipse cx="50" cy="45" rx="28" ry="9" fill="#FDE047" />
    <path d="M28 46C30 60 38 72 44 64C48 56 46 48 48 46C52 58 60 72 66 62C70 54 68 46 72 46" fill="#FDE047" stroke="#1E1D1B" strokeWidth="1.8" />
    {/* Camembert Wedge */}
    <polygon points="44,38 56,32 54,44" fill="#FEF9C3" stroke="#1E1D1B" strokeWidth="1.4" />
  </svg>
);

export const DishBreadBowlAmericanSVG: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="BB American">
    <ellipse cx="50" cy="88" rx="40" ry="6" fill="#1E1D1B" opacity="0.14" />
    <path d="M16 54C14 76 34 86 50 86C66 86 86 76 84 54C82 42 74 36 50 36C26 36 18 42 16 54Z" fill="#92400E" stroke="#1E1D1B" strokeWidth="2.2" strokeLinejoin="round" />
    <ellipse cx="50" cy="44" rx="32" ry="11" fill="#FEF08A" stroke="#1E1D1B" strokeWidth="2.2" />
    {/* Bacon Strip */}
    <path d="M30 40C34 38 38 42 42 40C46 38 50 42 54 40" stroke="#991B1B" strokeWidth="3" strokeLinecap="round" />
    <path d="M30 40C34 38 38 42 42 40C46 38 50 42 54 40" stroke="#FDE68A" strokeWidth="1" strokeLinecap="round" />
    {/* Sunny Side Egg */}
    <ellipse cx="58" cy="42" rx="10" ry="8" fill="#FFFFFF" stroke="#1E1D1B" strokeWidth="1.5" />
    <circle cx="58" cy="42" r="4.5" fill="#F59E0B" />
  </svg>
);

export const DishBreadBowlNorvegienSVG: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="BB Norvégien">
    <ellipse cx="50" cy="88" rx="40" ry="6" fill="#1E1D1B" opacity="0.14" />
    <path d="M16 54C14 76 34 86 50 86C66 86 86 76 84 54C82 42 74 36 50 36C26 36 18 42 16 54Z" fill="#92400E" stroke="#1E1D1B" strokeWidth="2.2" strokeLinejoin="round" />
    <ellipse cx="50" cy="44" rx="32" ry="11" fill="#FEF08A" stroke="#1E1D1B" strokeWidth="2.2" />
    {/* Salmon Ribbon */}
    <path d="M36 40C30 32 40 24 48 28C54 32 52 42 46 44C40 46 36 44 36 40Z" fill="#FB923C" stroke="#1E1D1B" strokeWidth="1.5" />
    <path d="M40 32C44 30 48 32 50 34" stroke="#FFF" strokeWidth="1.2" strokeLinecap="round" />
    {/* Lemon Slice */}
    <circle cx="62" cy="40" r="6" fill="#FACC15" stroke="#1E1D1B" strokeWidth="1.4" />
    <circle cx="62" cy="40" r="4" fill="#FEF08A" />
  </svg>
);

export const DishBreadWichGrilledSVG: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Bread-Wich Grilled">
    <ellipse cx="50" cy="88" rx="40" ry="6" fill="#1E1D1B" opacity="0.14" />
    {/* Bottom Baguette */}
    <path d="M16 58L46 76C50 78 54 78 58 74L86 54C90 52 90 46 86 44L78 40L14 52C14 56 14 56 16 58Z" fill="#78350F" stroke="#1E1D1B" strokeWidth="2" strokeLinejoin="round" />
    {/* Cheese Pull & Fillings */}
    <path d="M16 50C22 56 30 60 38 54C44 50 52 64 60 56C68 50 74 60 82 52" fill="#FBBF24" stroke="#1E1D1B" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M34 54C34 68 40 74 44 66" fill="#FBBF24" stroke="#1E1D1B" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="32" cy="54" r="3.5" fill="#DC2626" />
    {/* Upper Crust with Grill Marks */}
    <path d="M14 44C18 32 54 18 80 30C86 32 88 38 84 44L56 62C52 66 46 64 42 60L14 44Z" fill="#D97706" stroke="#1E1D1B" strokeWidth="2.2" strokeLinejoin="round" />
    <line x1="28" y1="38" x2="38" y2="46" stroke="#451A03" strokeWidth="2.4" strokeLinecap="round" />
    <line x1="42" y1="34" x2="52" y2="42" stroke="#451A03" strokeWidth="2.4" strokeLinecap="round" />
    <line x1="56" y1="30" x2="66" y2="38" stroke="#451A03" strokeWidth="2.4" strokeLinecap="round" />
    <line x1="70" y1="28" x2="80" y2="36" stroke="#451A03" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

export const DishSaladeCesarSVG: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Salade César">
    <ellipse cx="50" cy="88" rx="40" ry="6" fill="#1E1D1B" opacity="0.14" />
    {/* Bowl */}
    <path d="M16 52C22 80 46 86 50 86C54 86 78 80 84 52H16Z" fill="#F8F3EA" stroke="#1E1D1B" strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M12 52H88" stroke="#1E1D1B" strokeWidth="2.2" strokeLinecap="round" />
    {/* Greens */}
    <path d="M22 50C18 38 28 30 36 36C40 26 52 26 54 36C62 26 76 28 76 40C82 34 86 42 84 50Z" fill="#16A34A" stroke="#1E1D1B" strokeWidth="1.8" />
    {/* Egg */}
    <ellipse cx="38" cy="44" rx="10" ry="8" fill="#FFFFFF" stroke="#1E1D1B" strokeWidth="1.4" />
    <circle cx="38" cy="44" r="4.5" fill="#F59E0B" />
    {/* Grilled Chicken */}
    <rect x="52" y="38" width="18" height="7" rx="2" fill="#D97706" stroke="#1E1D1B" strokeWidth="1.4" transform="rotate(15 52 38)" />
    <line x1="56" y1="39" x2="58" y2="45" stroke="#451A03" strokeWidth="1.2" />
    <line x1="62" y1="41" x2="64" y2="47" stroke="#451A03" strokeWidth="1.2" />
    {/* Crouton & Tomato */}
    <rect x="66" y="44" width="6" height="6" rx="1.5" fill="#CA8A04" stroke="#1E1D1B" strokeWidth="1.2" />
    <circle cx="28" cy="48" r="4.5" fill="#DC2626" stroke="#1E1D1B" strokeWidth="1.2" />
  </svg>
);

export const DishSaladeGourmetSVG: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Salade Gourmet">
    <ellipse cx="50" cy="88" rx="40" ry="6" fill="#1E1D1B" opacity="0.14" />
    <path d="M16 52C22 80 46 86 50 86C54 86 78 80 84 52H16Z" fill="#F8F3EA" stroke="#1E1D1B" strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M12 52H88" stroke="#1E1D1B" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M22 50C18 38 28 30 36 36C40 26 52 26 54 36C62 26 76 28 76 40C82 34 86 42 84 50Z" fill="#15803D" stroke="#1E1D1B" strokeWidth="1.8" />
    {/* Sliced Avocado */}
    <path d="M34 44C34 36 40 32 46 36C46 42 42 46 34 44Z" fill="#84CC16" stroke="#1E1D1B" strokeWidth="1.4" />
    <path d="M42 44C42 36 48 32 54 36C54 42 50 46 42 44Z" fill="#84CC16" stroke="#1E1D1B" strokeWidth="1.4" />
    {/* Walnut & Tomatoes */}
    <ellipse cx="62" cy="44" rx="5" ry="4" fill="#78350F" stroke="#1E1D1B" strokeWidth="1.2" />
    <circle cx="28" cy="46" r="4.5" fill="#DC2626" stroke="#1E1D1B" strokeWidth="1.2" />
    <circle cx="72" cy="46" r="4.5" fill="#DC2626" stroke="#1E1D1B" strokeWidth="1.2" />
  </svg>
);

export const DishSaladeNorvegienneSVG: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Salade Norvégienne">
    <ellipse cx="50" cy="88" rx="40" ry="6" fill="#1E1D1B" opacity="0.14" />
    <path d="M16 52C22 80 46 86 50 86C54 86 78 80 84 52H16Z" fill="#F8F3EA" stroke="#1E1D1B" strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M12 52H88" stroke="#1E1D1B" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M22 50C18 38 28 30 36 36C40 26 52 26 54 36C62 26 76 28 76 40C82 34 86 42 84 50Z" fill="#16A34A" stroke="#1E1D1B" strokeWidth="1.8" />
    {/* Smoked Salmon Rosette */}
    <path d="M38 42C34 34 42 28 48 32C52 36 50 44 44 46C40 48 38 46 38 42Z" fill="#FB923C" stroke="#1E1D1B" strokeWidth="1.5" />
    <path d="M52 40C48 32 56 26 62 30C66 34 64 42 58 44C54 46 52 44 52 40Z" fill="#FB923C" stroke="#1E1D1B" strokeWidth="1.5" />
    {/* Mozzarella Cherry Pearl */}
    <circle cx="68" cy="46" r="5" fill="#FFFFFF" stroke="#1E1D1B" strokeWidth="1.3" />
  </svg>
);

export const DishPastaCoquillettesSkilletSVG: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Coquillettes Skillet">
    <ellipse cx="50" cy="88" rx="40" ry="6" fill="#1E1D1B" opacity="0.14" />
    {/* Skillet */}
    <ellipse cx="48" cy="62" rx="36" ry="16" fill="#292524" stroke="#1E1D1B" strokeWidth="2" />
    <path d="M12 62C12 78 30 84 48 84C66 84 84 78 84 62" fill="#292524" stroke="#1E1D1B" strokeWidth="2" />
    <path d="M84 60L96 56L98 62L82 66" fill="#292524" stroke="#1E1D1B" strokeWidth="1.8" strokeLinejoin="round" />
    {/* Melted Cheese Fondue */}
    <ellipse cx="48" cy="62" rx="30" ry="12" fill="#FBBF24" />
    {/* Macaroni Elbows */}
    <path d="M30 62C28 56 34 50 40 52C42 56 38 60 34 58" fill="#FDE047" stroke="#1E1D1B" strokeWidth="1.4" />
    <path d="M46 64C44 58 50 52 56 54C58 58 54 62 50 60" fill="#FDE047" stroke="#1E1D1B" strokeWidth="1.4" />
    <path d="M60 62C58 56 64 50 70 52" fill="#FDE047" stroke="#1E1D1B" strokeWidth="1.4" />
    {/* Fork Cheese Pull */}
    <path d="M48 54C46 38 52 28 50 16" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
    <path d="M48 54C46 38 52 28 50 16" stroke="#1E1D1B" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M44 16H56V10C56 6 44 6 44 10V16Z" fill="#E2E8F0" stroke="#1E1D1B" strokeWidth="1.4" />
  </svg>
);

export const DishPastaCoquillettesMexicaineSVG: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Coquillettes Mexicaine">
    <ellipse cx="50" cy="88" rx="40" ry="6" fill="#1E1D1B" opacity="0.14" />
    <ellipse cx="48" cy="62" rx="36" ry="16" fill="#292524" stroke="#1E1D1B" strokeWidth="2" />
    <path d="M12 62C12 78 30 84 48 84C66 84 84 78 84 62" fill="#292524" stroke="#1E1D1B" strokeWidth="2" />
    <path d="M84 60L96 56L98 62L82 66" fill="#292524" stroke="#1E1D1B" strokeWidth="1.8" />
    <ellipse cx="48" cy="62" rx="30" ry="12" fill="#EA580C" />
    <circle cx="34" cy="62" r="3" fill="#DC2626" />
    <circle cx="58" cy="62" r="3" fill="#DC2626" />
    <circle cx="46" cy="64" r="2.5" fill="#15803D" />
    <path d="M48 54C46 38 52 28 50 16" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
    <path d="M48 54C46 38 52 28 50 16" stroke="#1E1D1B" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M44 16H56V10C56 6 44 6 44 10V16Z" fill="#E2E8F0" stroke="#1E1D1B" strokeWidth="1.4" />
  </svg>
);

export const DishDessertBocalJarSVG: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Dessert en Bocal">
    <ellipse cx="50" cy="88" rx="36" ry="6" fill="#1E1D1B" opacity="0.14" />
    {/* Glass Jar */}
    <path d="M30 30L26 78C26 84 36 88 50 88C64 88 74 84 74 78L70 30H30Z" fill="#E0F2FE" fillOpacity="0.3" stroke="#1E1D1B" strokeWidth="2.2" strokeLinejoin="round" />
    {/* Spéculoos Crunch */}
    <path d="M26 68L26 78C26 84 36 88 50 88C64 88 74 84 74 78L74 68C66 70 58 66 50 68C42 70 34 66 26 68Z" fill="#B45309" stroke="#1E1D1B" strokeWidth="1.4" />
    {/* Mascarpone Cream */}
    <path d="M27 48L26 68C34 66 42 70 50 68C58 66 66 70 74 68L73 48C66 52 58 46 50 50C42 54 34 46 27 48Z" fill="#FFFBEB" stroke="#1E1D1B" strokeWidth="1.4" />
    {/* Nutella Swirl */}
    <path d="M29 32L27 48C34 46 42 54 50 50C58 46 66 52 73 48L71 32H29Z" fill="#451A03" stroke="#1E1D1B" strokeWidth="1.4" />
    {/* Rim & Clamp */}
    <ellipse cx="50" cy="28" rx="22" ry="6" fill="#E0F2FE" stroke="#1E1D1B" strokeWidth="2.2" />
    <path d="M28 28V33C28 36 38 38 50 38C62 38 72 36 72 33V28" stroke="#1E1D1B" strokeWidth="1.8" />
    {/* Spoon */}
    <path d="M78 20L72 58C68 60 66 68 68 74C70 80 76 82 80 80C84 78 86 72 84 66L80 20H78Z" fill="#E2E8F0" stroke="#1E1D1B" strokeWidth="1.5" />
  </svg>
);

export const DishDessertCheesecakeSVG: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Cheesecake">
    <ellipse cx="50" cy="88" rx="36" ry="6" fill="#1E1D1B" opacity="0.14" />
    {/* Graham Crust Base */}
    <path d="M18 64L50 82L82 64L82 72L50 90L18 72V64Z" fill="#B45309" stroke="#1E1D1B" strokeWidth="1.8" strokeLinejoin="round" />
    {/* Creamy Cheese Layer */}
    <path d="M18 42L50 60L82 42L82 64L50 82L18 64V42Z" fill="#FFFBEB" stroke="#1E1D1B" strokeWidth="2" strokeLinejoin="round" />
    {/* Top Caramel / Fruit Coulis */}
    <path d="M18 42L50 60L82 42L50 24L18 42Z" fill="#D97706" stroke="#1E1D1B" strokeWidth="2" strokeLinejoin="round" />
    <path d="M28 48C30 54 34 56 38 52" fill="#D97706" />
    <path d="M56 64C58 70 62 72 66 68" fill="#D97706" />
  </svg>
);

export const DishBoissonIcedCitrusSVG: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Boisson Iced">
    <ellipse cx="50" cy="88" rx="32" ry="5" fill="#1E1D1B" opacity="0.14" />
    {/* Tumbler */}
    <path d="M30 30L36 82C37 86 42 88 50 88C58 88 63 86 64 82L70 30H30Z" fill="#E0F2FE" fillOpacity="0.3" stroke="#1E1D1B" strokeWidth="2" strokeLinejoin="round" />
    <path d="M32 38L37 80C38 83 42 85 50 85C58 85 62 83 63 80L68 38H32Z" fill="#FACC15" stroke="#1E1D1B" strokeWidth="1.2" />
    <ellipse cx="50" cy="30" rx="20" ry="5" fill="#E0F2FE" stroke="#1E1D1B" strokeWidth="2" />
    {/* Straw */}
    <line x1="56" y1="30" x2="68" y2="8" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
    {/* Lemon Wheel */}
    <circle cx="30" cy="28" r="10" fill="#FACC15" stroke="#1E1D1B" strokeWidth="1.5" />
    <circle cx="30" cy="28" r="7" fill="#FEF08A" />
    {/* Ice Cubes */}
    <rect x="42" y="44" width="9" height="9" rx="2" fill="#FFFFFF" opacity="0.75" stroke="#1E1D1B" strokeWidth="1" transform="rotate(12 42 44)" />
    <rect x="48" y="60" width="9" height="9" rx="2" fill="#FFFFFF" opacity="0.75" stroke="#1E1D1B" strokeWidth="1" transform="rotate(-15 48 60)" />
  </svg>
);

export const DishBoissonEspressoSVG: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Café Espresso">
    <ellipse cx="50" cy="88" rx="36" ry="6" fill="#1E1D1B" opacity="0.14" />
    {/* Saucer */}
    <ellipse cx="50" cy="74" rx="34" ry="9" fill="#F8F3EA" stroke="#1E1D1B" strokeWidth="2.2" />
    {/* Cup */}
    <path d="M28 46V62C28 72 38 74 50 74C62 74 72 72 72 62V46H28Z" fill="#F8F3EA" stroke="#1E1D1B" strokeWidth="2.2" strokeLinejoin="round" />
    <ellipse cx="50" cy="48" rx="22" ry="6" fill="#78350F" stroke="#1E1D1B" strokeWidth="1.8" />
    {/* Handle */}
    <path d="M72 50C80 50 82 58 72 60" stroke="#1E1D1B" strokeWidth="2.2" strokeLinecap="round" />
    {/* Steam */}
    <path d="M46 38C44 28 52 24 50 16" stroke="#1E1D1B" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
    <path d="M54 38C52 28 60 24 58 16" stroke="#1E1D1B" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
  </svg>
);

export const DishBoissonWaterBottleSVG: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Eau Minérale">
    <ellipse cx="50" cy="88" rx="30" ry="5" fill="#1E1D1B" opacity="0.14" />
    {/* Bottle Body */}
    <rect x="42" y="14" width="16" height="8" rx="2" fill="#0284C7" stroke="#1E1D1B" strokeWidth="1.8" />
    <path d="M44 22L36 36V80C36 84 42 86 50 86C58 86 64 84 64 80V36L56 22H44Z" fill="#BAE6FD" fillOpacity="0.5" stroke="#1E1D1B" strokeWidth="2" strokeLinejoin="round" />
    {/* Blue Label */}
    <rect x="36" y="50" width="28" height="18" fill="#0284C7" stroke="#1E1D1B" strokeWidth="1.5" />
    <line x1="40" y1="58" x2="60" y2="58" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    {/* Water reflection */}
    <line x1="40" y1="38" x2="40" y2="76" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
  </svg>
);

export const DishBoissonSodaCanSVG: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Boisson Gazeuse">
    <ellipse cx="50" cy="88" rx="30" ry="5" fill="#1E1D1B" opacity="0.14" />
    {/* Can Body */}
    <rect x="36" y="24" width="28" height="58" rx="6" fill="#DC2626" stroke="#1E1D1B" strokeWidth="2.2" />
    <ellipse cx="50" cy="24" rx="14" ry="4" fill="#E2E8F0" stroke="#1E1D1B" strokeWidth="1.8" />
    {/* Dynamic Wave Branding */}
    <path d="M36 46C42 42 50 56 64 48V62C54 66 42 56 36 60V46Z" fill="#FFFFFF" />
    {/* Pull Tab */}
    <circle cx="50" cy="23" r="2.5" stroke="#1E1D1B" strokeWidth="1.2" />
  </svg>
);

export const DishCamembertRotiSupplementsSVG: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Camembert Rôti">
    <ellipse cx="50" cy="88" rx="36" ry="6" fill="#1E1D1B" opacity="0.14" />
    {/* Pan */}
    <ellipse cx="50" cy="64" rx="34" ry="14" fill="#292524" stroke="#1E1D1B" strokeWidth="2" />
    <path d="M16 64C16 78 30 84 50 84C70 84 84 78 84 64" fill="#292524" stroke="#1E1D1B" strokeWidth="2" />
    {/* Scored Camembert with Honey */}
    <ellipse cx="50" cy="62" rx="26" ry="10" fill="#FFFBEB" stroke="#1E1D1B" strokeWidth="1.8" />
    <ellipse cx="50" cy="62" rx="22" ry="8" fill="#FDE047" />
    <line x1="36" y1="60" x2="64" y2="64" stroke="#78350F" strokeWidth="1.4" />
    <line x1="38" y1="64" x2="62" y2="60" stroke="#78350F" strokeWidth="1.4" />
    {/* Rosemary */}
    <path d="M38 56C44 58 56 54 62 56" stroke="#15803D" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const DishPotatoesRustiquesSVG: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Potatoes Rustiques">
    <ellipse cx="50" cy="88" rx="36" ry="6" fill="#1E1D1B" opacity="0.14" />
    {/* Wedges */}
    <path d="M22 66C20 48 40 40 54 50C62 64 42 78 26 74Z" fill="#F59E0B" stroke="#1E1D1B" strokeWidth="2" strokeLinejoin="round" />
    <path d="M46 72C44 56 64 46 76 56C82 68 64 82 50 78Z" fill="#D97706" stroke="#1E1D1B" strokeWidth="2" strokeLinejoin="round" />
    <path d="M32 50C34 36 50 30 60 38C66 48 50 60 38 56Z" fill="#FBBF24" stroke="#1E1D1B" strokeWidth="2" strokeLinejoin="round" />
    {/* Rosemary flecks */}
    <line x1="34" y1="60" x2="40" y2="56" stroke="#15803D" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="56" y1="64" x2="62" y2="60" stroke="#15803D" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const DishOeufMolletSupplementSVG: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Œuf Mollet">
    <ellipse cx="50" cy="88" rx="30" ry="5" fill="#1E1D1B" opacity="0.14" />
    <ellipse cx="50" cy="54" rx="28" ry="22" fill="#FFFFFF" stroke="#1E1D1B" strokeWidth="2.2" />
    <circle cx="50" cy="54" r="13" fill="#F59E0B" stroke="#1E1D1B" strokeWidth="1.8" />
    <path d="M45 48C47 45 52 45 54 48" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
    {/* Yolk drip */}
    <path d="M48 64C50 72 54 72 54 64" fill="#F59E0B" />
  </svg>
);

// --- Master Dish Illustration Dispatcher ---
export const getDishIllustration = (item: MenuItem): React.FC<{ className?: string }> => {
  switch (item.id) {
    case 'bb-classic':
      return DishBreadBowlClassicSVG;
    case 'bb-italien':
      return DishBreadBowlItalienSVG;
    case 'bb-mexicain':
      return DishBreadBowlMexicainSVG;
    case 'bb-truffee':
      return DishBreadBowlTruffeeSVG;
    case 'bb-cremeux':
      return DishBreadBowlCremeuxSVG;
    case 'bb-american':
    case 'bb-carnivore':
      return DishBreadBowlAmericanSVG;
    case 'bb-perigourdin':
      return DishBreadBowlTruffeeSVG;
    case 'bb-norvegien':
      return DishBreadBowlNorvegienSVG;
    case 'bw-tunisien':
    case 'bw-romano':
    case 'bw-manhaten':
    case 'bw-cremoso':
      return DishBreadWichGrilledSVG;
    case 'sal-cesar':
      return DishSaladeCesarSVG;
    case 'sal-sapori':
    case 'sal-normande':
    case 'sal-pesto':
      return DishSaladeGourmetSVG;
    case 'sal-indienne':
      return DishSaladeCesarSVG;
    case 'sal-norvegienne':
      return DishSaladeNorvegienneSVG;
    case 'pas-poulet':
    case 'pas-boeuf':
      return DishPastaCoquillettesSkilletSVG;
    case 'pas-mexicaine':
      return DishPastaCoquillettesMexicaineSVG;
    case 'des-cheesecake':
      return DishDessertCheesecakeSVG;
    case 'des-tiramisu':
      return DishDessertBocalJarSVG;
    case 'boi-eau-05':
    case 'boi-grande-eau':
    case 'boi-eau-gazeuse':
      return DishBoissonWaterBottleSVG;
    case 'boi-gazeuses':
      return DishBoissonSodaCanSVG;
    case 'boi-jus':
      return DishBoissonIcedCitrusSVG;
    case 'boi-cafe':
      return DishBoissonEspressoSVG;
    default:
      if (item.dishType === 'bread-bowl' || item.dishType === 'bread-bowl-gourmet') return DishBreadBowlClassicSVG;
      if (item.dishType === 'bread-wich') return DishBreadWichGrilledSVG;
      if (item.dishType === 'salade') return DishSaladeCesarSVG;
      if (item.dishType === 'pasta') return DishPastaCoquillettesSkilletSVG;
      if (item.dishType === 'dessert') return DishDessertBocalJarSVG;
      if (item.dishType === 'boisson') return DishBoissonIcedCitrusSVG;
      return DishBreadBowlClassicSVG;
  }
};

// ============================================================================
// CLEAN MINIMALIST MONOLINE CATEGORY ICONS
// ============================================================================

export const BreadBowlIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 13C4 19.5 8.5 23 14 23C19.5 23 24 19.5 24 13H4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M5.5 13C6.5 9 9.8 7 14 7C18.2 7 21.5 9 22.5 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 10.5C11.5 12 16.5 12 18 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const BreadBowlGourmetIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 14C4 20 8.5 23 14 23C19.5 23 24 20 24 14H4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M5.5 14C6.5 10 9.8 8 14 8C18.2 8 21.5 10 22.5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 5L12 2L14 4L16 2L18 5H10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

export const BreadWichIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 15C4 10.5 8.5 8 14 8C19.5 8 24 10.5 24 15H4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M3.5 17.5C5.5 16 7.5 19 9.5 17.5C11.5 16 13.5 19 15.5 17.5C17.5 16 19.5 19 21.5 17.5C23 16.5 24 17.5 24.5 17.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M5 20H23C23 21.8 20.5 23 14 23C7.5 23 5 21.8 5 20Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <line x1="9" y1="10" x2="11" y2="13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="14" y1="9.5" x2="16" y2="12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const SaladBowlIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 14C4.8 20 9 23 14 23C19 23 23.2 20 24 14H4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M6.5 13.5C6 9.5 9.5 7.5 12 10.5C13.5 7 17.5 7 18.5 10.5C21 8.5 23 10.5 22 13.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PastaShellIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6 18C5 10 11 5 18 6C20.5 6.5 21.5 8.5 20.5 10.5C19.5 12.5 17.5 13 15.5 12.5C12 11.8 10.5 14 11 17.5C11.2 19.5 9.5 21 7.8 21C6.5 21 6 19.5 6 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 13C10.5 9.5 13.5 8 17 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const DessertJarIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="7" y="8" width="14" height="16" rx="3.5" stroke="currentColor" strokeWidth="2" />
    <path d="M8.5 5H19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M7 13C10 11.5 14 14.5 17 12.5C19 11.5 20 12.5 21 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const BoissonsIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M8 8L10 23H18L20 8H8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <line x1="7" y1="8" x2="21" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="16" y1="8" x2="20" y2="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const SupplementsIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="14" cy="16" rx="9" ry="5.5" stroke="currentColor" strokeWidth="2" />
    <path d="M5 16C5 20.5 9 22.5 14 22.5C19 22.5 23 20.5 23 16" stroke="currentColor" strokeWidth="2" />
    <path d="M12 9C12 7 14 6 15 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

// General UI Icons
export const ChiliPepperSVG: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 inline-block' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Piquant">
    <path
      d="M17.8 4.8C19.6 6.6 19.8 10.6 16.4 15.2C13 19.8 7.6 21.6 3.5 20.6C7 18.8 10.2 15.8 11.8 11.6C13.4 7.4 14.8 4.4 17.8 4.8Z"
      fill="#C83E2B"
      stroke="#C83E2B"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M17.5 5C18.5 3.2 20.2 2.4 21.5 3" stroke="#1E1D1B" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const DiamondSVG: React.FC<{ className?: string }> = ({ className = 'w-2.5 h-2.5 inline-block' }) => (
  <svg viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path d="M6 0.8L11.2 6L6 11.2L0.8 6L6 0.8Z" />
  </svg>
);

export const DiamondDivider: React.FC<{ className?: string; color?: string }> = ({
  className = 'my-3',
  color = 'currentColor'
}) => (
  <div className={`flex items-center justify-center ${className}`}>
    <div className="h-[1.2px] opacity-40 flex-1 max-w-[120px]" style={{ backgroundColor: color }} />
    <DiamondSVG className="w-2.5 h-2.5 mx-3 shrink-0" />
    <div className="h-[1.2px] opacity-40 flex-1 max-w-[120px]" style={{ backgroundColor: color }} />
  </div>
);

export const PhoneSVG: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export const PinSVG: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const SearchSVG: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const CloseSVG: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export const PlusSVG: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export const MinusSVG: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" />
  </svg>
);

export const CheckSVG: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const HeartSVG: React.FC<{ className?: string; filled?: boolean }> = ({
  className = 'w-4 h-4',
  filled = false
}) => (
  <svg viewBox="0 0 24 24" fill={filled ? '#C83E2B' : 'none'} stroke={filled ? '#C83E2B' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

export const CartSVG: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

export const BellSVG: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

export const ReceiptSVG: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
    <path d="M16 8h-8" />
    <path d="M16 12h-8" />
    <path d="M10 16h-2" />
  </svg>
);

export const UsersSVG: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const WhatsAppSVG: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.57 20.15 9.12 19.75 7.85 19L7.55 18.82L4.43 19.64L5.26 16.59L5.07 16.29C4.24 14.97 3.81 13.46 3.81 11.91C3.81 7.37 7.5 3.69 12.05 3.69C14.25 3.69 16.32 4.55 17.88 6.11C19.43 7.67 20.29 9.74 20.29 11.93C20.28 16.48 16.59 20.15 12.05 20.15ZM16.57 14.33C16.32 14.21 15.1 13.61 14.88 13.53C14.65 13.45 14.48 13.41 14.32 13.65C14.15 13.9 13.67 14.47 13.52 14.64C13.38 14.8 13.23 14.82 12.98 14.7C12.73 14.58 11.93 14.31 10.98 13.46C10.23 12.79 9.73 11.97 9.58 11.72C9.43 11.47 9.57 11.34 9.69 11.22C9.8 11.11 9.94 10.93 10.06 10.78C10.19 10.64 10.23 10.53 10.31 10.37C10.39 10.2 10.35 10.06 10.29 9.94C10.23 9.81 9.74 8.61 9.53 8.12C9.33 7.64 9.13 7.71 8.97 7.7C8.83 7.69 8.66 7.69 8.49 7.69C8.33 7.69 8.06 7.75 7.83 8C7.6 8.25 6.96 8.85 6.96 10.07C6.96 11.29 7.85 12.47 7.97 12.63C8.1 12.8 9.71 15.28 12.18 16.35C12.77 16.6 13.22 16.76 13.58 16.87C14.17 17.06 14.7 17.03 15.13 16.97C15.61 16.9 16.6 16.37 16.81 15.79C17.02 15.2 17.02 14.7 16.95 14.58C16.88 14.47 16.73 14.41 16.57 14.33Z" />
  </svg>
);

export const SunMoonSVG: React.FC<{ className?: string; isDark?: boolean }> = ({
  className = 'w-4 h-4',
  isDark = false
}) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {isDark ? (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </>
    ) : (
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    )}
  </svg>
);

export const SparklesSVG: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
  </svg>
);

export const TrashSVG: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

export const PrintSVG: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect width="12" height="8" x="6" y="14" />
  </svg>
);

export const ShareSVG: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

export const InstagramSVG: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const FacebookSVG: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

// ============================================================================
// AUTHENTIC DELIVERY PARTNERS VECTOR LOGOS (GLOVO, YASSIR, KOOL TUNISIA)
// ============================================================================

export const GlovoOfficialLogoSVG: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full shadow-sm select-none transition-transform hover:scale-105 ${className}`}
    style={{ backgroundColor: '#FFC244', color: '#00A082' }}
    title="Commander sur Glovo Tunisie"
  >
    <svg viewBox="0 0 24 24" fill="#00A082" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
      <path d="M12.012 0C7.847 0 4.459 3.388 4.459 7.553c0 1.576.494 3.106 1.412 4.4l.211.281 3.93 5.555s.47.775 1.529.775h.941c1.036 0 1.53-.775 1.53-.775l3.93-5.555.187-.28a7.43 7.43 0 0 0 1.412-4.401C19.564 3.388 16.176 0 12.011 0Zm0 3.693a3.837 3.837 0 0 1 3.836 3.836c0 .824-.26 1.578-.73 2.237l-.212.28-2.894 4.095-2.895-4.07-.21-.305a3.848 3.848 0 0 1-.731-2.237 3.837 3.837 0 0 1 3.836-3.836zm-2.117 18.26c0 1.106.893 2.023 2.07 2.047 1.223 0 2.117-.917 2.117-2.059 0-1.14-.894-2.058-2.094-2.058-1.2 0-2.093.917-2.093 2.07z" />
    </svg>
    <span className="font-extrabold text-[12px] tracking-tight leading-none text-[#00A082] font-sans">
      glovo
    </span>
  </div>
);

export const YassirOfficialLogoSVG: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full shadow-sm select-none transition-transform hover:scale-105 ${className}`}
    style={{ backgroundColor: '#E60028', color: '#FFFFFF' }}
    title="Commander sur Yassir Express"
  >
    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.2" />
      <path d="M7 8L11 13V17M17 8L11 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span className="font-black text-[12px] tracking-tight lowercase leading-none text-white font-sans">
      yassir
    </span>
    <span className="text-[8px] font-bold tracking-widest uppercase bg-black/25 px-1 py-0.2 rounded text-white/90">
      express
    </span>
  </div>
);

export const KoolOfficialLogoSVG: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full shadow-sm select-none transition-transform hover:scale-105 ${className}`}
    style={{ backgroundColor: '#FFD500', color: '#1A1A1A' }}
    title="Commander sur KooL Delivery Tunisie"
  >
    <span className="font-black text-[12px] tracking-tight lowercase leading-none text-[#1A1A1A] font-sans">
      kool
    </span>
    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6E00] shrink-0" />
    <span className="text-[8px] font-bold tracking-wider uppercase text-[#1A1A1A]/80 leading-none">
      delivery
    </span>
  </div>
);

// ============================================================================
// COMPLETE AUTHENTIC MENU DATA (MOKiTO TUNIS)
// ============================================================================

export const SUPPLEMENTS_LIST: Supplement[] = [
  { id: 'sup-oeuf', name: 'ŒUF MOLLET OU À LA PLANCHA', price: 2 },
  { id: 'sup-fondue', name: 'FONDUE DE FROMAGE', price: 3.5 },
  {
    id: 'sup-legumes',
    name: 'LÉGUMES AU CHOIX',
    detail: 'Légumes confits, légumes mexicaines, roquette, champignons, légumes à l’indienne',
    price: 3.5
  },
  {
    id: 'sup-vinaigrette',
    name: 'VINAIGRETTE AU CHOIX',
    detail: 'César - Indienne - Moutarde & Miel - Citron Gingembre Caramélisé',
    price: 3.5
  },
  {
    id: 'sup-fruits-secs',
    name: 'FRUITS SECS AU CHOIX',
    detail: 'Amandes Effilées / Noix, Figues & Abricots',
    price: 5
  },
  {
    id: 'sup-fromage',
    name: 'FROMAGE AU CHOIX',
    detail: 'Mozzarella - Camembert - Grana',
    price: 5
  },
  {
    id: 'sup-potatoes',
    name: 'POTATOES',
    detail: 'Servies avec Mayonnaise & Ketchup',
    price: 5
  },
  { id: 'sup-proteine', name: 'POULET OU VIANDE', price: 5 },
  {
    id: 'sup-charcuterie',
    name: 'CHARCUTERIE AU CHOIX',
    detail: 'Bacon - Bresaola - Chorizo - Saucisse',
    price: 7
  },
  { id: 'sup-camembert-roti', name: 'CAMEMBERT RÔTI AU MIEL', price: 25 }
];

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: 'bread-bowls',
    title: 'BREAD BOWLS',
    subtitle: 'Poulet ou viande hachée au choix. Servis avec potatoes. Du pain creusé, bien garni, bien doré.',
    icon: BreadBowlIcon,
    heroIllustration: BreadBowlArtisanalIllustration,
    items: [
      {
        id: 'bb-classic',
        dishType: 'bread-bowl',
        name: 'BB CLASSIC',
        description: 'Légumes confits, fondue de fromage, roquette, tomates.',
        hasProteinChoice: true,
        prices: { poulet: 16, viande: 17 },
        spicy: false,
        tags: ['bestseller', 'cheese'],
        allergens: ['gluten', 'lactose'],
        suggestedPairingId: 'des-tiramisu'
      },
      {
        id: 'bb-italien',
        dishType: 'bread-bowl',
        name: 'BB ITALIEN',
        description: 'Légumes confits, fondue de fromage, roquette, tomates, bresaola, Grana Padano, huile de basilic.',
        hasProteinChoice: true,
        prices: { poulet: 19, viande: 20 },
        spicy: false,
        tags: ['chef', 'cheese'],
        allergens: ['gluten', 'lactose'],
        suggestedPairingId: 'boi-eau-gazeuse'
      },
      {
        id: 'bb-mexicain',
        dishType: 'bread-bowl',
        name: 'BB MEXICAIN',
        description: 'Légumes confits, fondue de fromage, roquette, tomates, chorizo, piments, piments de Cayenne, épices mexicaines.',
        hasProteinChoice: true,
        prices: { poulet: 19, viande: 20 },
        spicy: true,
        tags: ['spicy', 'bestseller'],
        allergens: ['gluten', 'lactose'],
        suggestedPairingId: 'boi-gazeuses'
      },
      {
        id: 'bb-truffee',
        dishType: 'bread-bowl',
        name: 'BB TRUFFÉE',
        description: 'Légumes confits, fondue de fromage, roquette, tomates, crème de truffe, noix.',
        hasProteinChoice: true,
        prices: { poulet: 19, viande: 20 },
        spicy: false,
        tags: ['chef', 'bestseller'],
        allergens: ['gluten', 'lactose', 'nuts'],
        suggestedPairingId: 'des-cheesecake'
      },
      {
        id: 'bb-cremeux',
        dishType: 'bread-bowl',
        name: 'BB CRÉMEUX',
        description: 'Légumes confits, fondue de fromage, roquette, tomates, mozzarella, Grana Padano, camembert.',
        hasProteinChoice: true,
        prices: { poulet: 20, viande: 21 },
        spicy: false,
        tags: ['cheese'],
        allergens: ['gluten', 'lactose'],
        suggestedPairingId: 'des-tiramisu'
      },
      {
        id: 'bb-american',
        dishType: 'bread-bowl',
        name: 'BB AMERICAN',
        description: 'Légumes confits, fondue de fromage, roquette, tomates, bacon de bœuf, champignons, œuf à la plancha.',
        hasProteinChoice: true,
        prices: { poulet: 20, viande: 21 },
        spicy: false,
        tags: ['bestseller'],
        allergens: ['gluten', 'lactose', 'eggs'],
        suggestedPairingId: 'boi-jus'
      }
    ]
  },
  {
    id: 'bread-bowls-gourmets',
    title: 'BREAD BOWLS GOURMETS',
    subtitle: 'Servis avec potatoes. Du pain creusé, bien garni, bien doré.',
    icon: BreadBowlGourmetIcon,
    heroIllustration: BreadBowlGourmetArtisanalIllustration,
    items: [
      {
        id: 'bb-carnivore',
        dishType: 'bread-bowl-gourmet',
        name: 'BB CARNIVORE',
        description: 'Légumes confits, fondue de fromage, roquette, tomate, viande hachée, bacon, chorizo, saucisse, noix.',
        hasProteinChoice: false,
        price: 23,
        spicy: false,
        tags: ['chef'],
        allergens: ['gluten', 'lactose', 'nuts'],
        suggestedPairingId: 'boi-eau-gazeuse'
      },
      {
        id: 'bb-perigourdin',
        dishType: 'bread-bowl-gourmet',
        name: 'BB PERIGOURDIN',
        description: 'Légumes confits, fondue de fromage, roquette, tomate, viandes effiloché de bœuf, crème de truffe, champignons, noix.',
        hasProteinChoice: false,
        price: 24,
        spicy: false,
        tags: ['chef', 'bestseller'],
        allergens: ['gluten', 'lactose', 'nuts'],
        suggestedPairingId: 'des-tiramisu'
      },
      {
        id: 'bb-norvegien',
        dishType: 'bread-bowl-gourmet',
        name: 'BB NORVÉGIEN',
        description: 'Légumes confits, fondue de fromage, roquette, tomates, saumon fumé, mozzarella cerise, amandes effilées et abricots secs.',
        hasProteinChoice: false,
        price: 25,
        spicy: false,
        tags: ['chef'],
        allergens: ['gluten', 'lactose', 'fish', 'nuts'],
        suggestedPairingId: 'boi-eau-gazeuse'
      }
    ]
  },
  {
    id: 'bread-wich',
    title: 'BREAD-WICH',
    subtitle: 'Légumes sautés, oignons caramélisés, fromages fondants et sauce piquante.',
    icon: BreadWichIcon,
    heroIllustration: BreadWichArtisanalIllustration,
    items: [
      {
        id: 'bw-tunisien',
        dishType: 'bread-wich',
        name: 'LE TUNISIEN',
        description: 'Légumes sautés, laitue, tomates, oignons caramélisés, gruyère, merguez, sauce piquante.',
        hasProteinChoice: false,
        price: 14,
        spicy: true,
        tags: ['spicy', 'bestseller'],
        allergens: ['gluten', 'lactose'],
        suggestedPairingId: 'boi-gazeuses'
      },
      {
        id: 'bw-romano',
        dishType: 'bread-wich',
        name: 'ROMANO',
        description: 'Légumes sautés, laitue, oignons caramélisés, gruyère, bresaola, poulet ou viande hachée, sauce piquante.',
        hasProteinChoice: true,
        prices: { poulet: 14, viande: 14 },
        spicy: true,
        tags: ['spicy'],
        allergens: ['gluten', 'lactose'],
        suggestedPairingId: 'boi-gazeuses'
      },
      {
        id: 'bw-manhaten',
        dishType: 'bread-wich',
        name: 'MANHATEN',
        description: 'Légumes sautés, laitue, oignons caramélisés, tomates, gruyère, bacon, œuf, poulet ou viande hachée, sauce piquante.',
        hasProteinChoice: true,
        prices: { poulet: 14, viande: 14 },
        spicy: true,
        tags: ['spicy', 'bestseller'],
        allergens: ['gluten', 'lactose', 'eggs'],
        suggestedPairingId: 'boi-gazeuses'
      },
      {
        id: 'bw-cremoso',
        dishType: 'bread-wich',
        name: 'CRÉMOSO',
        description: 'Légumes sautés, laitue, oignons caramélisés, tomate, camembert, gruyère, mozzarella, poulet ou viande hachée, sauce piquante.',
        hasProteinChoice: true,
        prices: { poulet: 14, viande: 14 },
        spicy: true,
        tags: ['spicy', 'cheese'],
        allergens: ['gluten', 'lactose'],
        suggestedPairingId: 'des-tiramisu'
      }
    ]
  },
  {
    id: 'salades',
    title: 'SALADES',
    subtitle: 'Servies avec croûtons maison. Ce ne sont pas des à-côtés. Ce sont des plats entiers. Et si vous avez encore des doutes... goûtez.',
    icon: SaladBowlIcon,
    heroIllustration: SaladesArtisanalIllustration,
    items: [
      {
        id: 'sal-cesar',
        dishType: 'salade',
        name: 'AVEC CESAR',
        description: 'Mélange de salade, légumes confits, tomate cerise, œuf mollet, grana padano, poulet grillé, vinaigrette césar.',
        hasProteinChoice: false,
        price: 19,
        spicy: false,
        tags: ['bestseller'],
        allergens: ['gluten', 'lactose', 'eggs'],
        suggestedPairingId: 'boi-eau-gazeuse'
      },
      {
        id: 'sal-sapori',
        dishType: 'salade',
        name: 'SAPORI DI TERRA',
        description: 'Mélange de salade, légumes confits, tomate cerise, champignons, borghol, quinoa, grana padano, œuf mollet, pomme, vinaigrette citron, gingembre caramélisé.',
        hasProteinChoice: false,
        price: 21,
        spicy: false,
        tags: ['veggie'],
        allergens: ['lactose', 'eggs'],
        suggestedPairingId: 'boi-jus'
      },
      {
        id: 'sal-indienne',
        dishType: 'salade',
        name: 'INDIENNE',
        description: 'Mélange de salade, légumes confits, tomate, blanc de poulet grillé, légumes à l’indienne, grana padano, œuf, pomme, raisins secs, amandes blanches, vinaigrette au curry, pommes.',
        hasProteinChoice: false,
        price: 24,
        spicy: false,
        tags: ['chef'],
        allergens: ['lactose', 'eggs', 'nuts'],
        suggestedPairingId: 'boi-eau-gazeuse'
      },
      {
        id: 'sal-pesto',
        dishType: 'salade',
        name: 'CROQUANTE PESTO',
        description: 'Mélange de salade, légumes confits, tomate cerise, bresaola, amandes effilées, grana padano, vinaigrette au pesto.',
        hasProteinChoice: false,
        price: 27,
        spicy: false,
        tags: ['chef'],
        allergens: ['lactose', 'nuts'],
        suggestedPairingId: 'boi-eau-gazeuse'
      },
      {
        id: 'sal-normande',
        dishType: 'salade',
        name: 'NORMANDE',
        description: 'Mélange de salade, légumes confits, tomate cerise, raisins secs, figues séchées, noix, camembert rôti au miel, vinaigrette miel et moutarde.',
        hasProteinChoice: false,
        price: 28,
        spicy: false,
        tags: ['veggie', 'cheese'],
        allergens: ['lactose', 'nuts'],
        suggestedPairingId: 'boi-jus'
      },
      {
        id: 'sal-norvegienne',
        dishType: 'salade',
        name: 'NORVÉGIENNE',
        description: 'Mélange de salade, légumes confits, tomates, fruits de saison, mozzarella cerise, saumon fumé, amandes effilées, abricots séchés, vinaigrette aux fruits rouges.',
        hasProteinChoice: false,
        price: 30,
        spicy: false,
        tags: ['chef', 'bestseller'],
        allergens: ['lactose', 'fish', 'nuts'],
        suggestedPairingId: 'boi-eau-gazeuse'
      }
    ]
  },
  {
    id: 'pasta',
    title: 'PASTA',
    subtitle: 'COQUILLETTES',
    icon: PastaShellIcon,
    heroIllustration: PastaCoquillettesArtisanalIllustration,
    items: [
      {
        id: 'pas-poulet',
        dishType: 'pasta',
        name: 'POULET CHAMPIGNONS',
        description: 'Légumes confits, fondue de fromage, blanc de poulet grillé, champignons, grana padano, amandes effilées.',
        hasProteinChoice: false,
        price: 23,
        spicy: false,
        tags: ['bestseller'],
        allergens: ['gluten', 'lactose', 'nuts'],
        suggestedPairingId: 'des-tiramisu'
      },
      {
        id: 'pas-mexicaine',
        dishType: 'pasta',
        name: 'CRÉMEUSE MEXICAINE',
        description: 'Légumes confits, légumes mexicaines, fondue de fromage, viande hachée, piment de Cayenne.',
        hasProteinChoice: false,
        price: 24,
        spicy: true,
        tags: ['spicy', 'cheese'],
        allergens: ['gluten', 'lactose'],
        suggestedPairingId: 'boi-gazeuses'
      },
      {
        id: 'pas-boeuf',
        dishType: 'pasta',
        name: 'EFFILOCHÉ DE BŒUF & NOIX',
        description: 'Légumes confits, fondue de fromage, effiloché de bœuf, grana padano, noix.',
        hasProteinChoice: false,
        price: 25,
        spicy: false,
        tags: ['chef'],
        allergens: ['gluten', 'lactose', 'nuts'],
        suggestedPairingId: 'des-cheesecake'
      }
    ]
  },
  {
    id: 'desserts',
    title: 'DESSERTS',
    subtitle: 'Nos douceurs maison préparées en bocal.',
    icon: DessertJarIcon,
    heroIllustration: DessertsJarArtisanalIllustration,
    items: [
      {
        id: 'des-cheesecake',
        dishType: 'dessert',
        name: 'CHEESECAKE CARAMEL SPÉCULOOS',
        description: 'Base croquante aux spéculoos, crème cheesecake onctueuse et caramel fondant.',
        hasProteinChoice: false,
        price: 12,
        spicy: false,
        tags: ['sweet', 'bestseller'],
        allergens: ['gluten', 'lactose'],
        isDessert: true,
        suggestedPairingId: 'boi-cafe'
      },
      {
        id: 'des-tiramisu',
        dishType: 'dessert',
        name: 'TIRAMISU NUTELLA SPÉCULOOS',
        description: 'La même base... avec une couche de Nutella en plus. On ne discute pas. On ferme les yeux.',
        hasProteinChoice: false,
        price: 12,
        spicy: false,
        tags: ['sweet', 'chef', 'bestseller'],
        allergens: ['gluten', 'lactose', 'nuts'],
        isDessert: true,
        suggestedPairingId: 'boi-cafe'
      }
    ]
  },
  {
    id: 'boissons',
    title: 'BOISSONS',
    subtitle: 'Pour accompagner votre plat en toute simplicité.',
    icon: BoissonsIcon,
    heroIllustration: BoissonsArtisanalIllustration,
    items: [
      {
        id: 'boi-eau-05',
        dishType: 'boisson',
        name: 'EAU 0.5L',
        description: 'Eau minérale naturelle fraîche.',
        hasProteinChoice: false,
        price: 1.5,
        spicy: false,
        isDrink: true
      },
      {
        id: 'boi-grande-eau',
        dishType: 'boisson',
        name: 'GRANDE EAU',
        description: 'Grande bouteille d’eau minérale fraîche.',
        hasProteinChoice: false,
        price: 3,
        spicy: false,
        isDrink: true
      },
      {
        id: 'boi-eau-gazeuse',
        dishType: 'boisson',
        name: 'EAU GAZEUSE',
        description: 'La pause neutre qui rafraîchit sans voler la vedette au plat.',
        hasProteinChoice: false,
        price: 3,
        spicy: false,
        isDrink: true
      },
      {
        id: 'boi-gazeuses',
        dishType: 'boisson',
        name: 'BOISSONS GAZEUSES',
        description: 'Le classique qui marche à tous les coups.',
        hasProteinChoice: false,
        price: 3.5,
        spicy: false,
        isDrink: true
      },
      {
        id: 'boi-jus',
        dishType: 'boisson',
        name: 'JUS NATUREL',
        description: 'Pressé du jour selon arrivage de fruits frais.',
        hasProteinChoice: false,
        price: 5,
        spicy: false,
        isDrink: true
      },
      {
        id: 'boi-cafe',
        dishType: 'boisson',
        name: 'CAFÉ SENSEO',
        description: 'Un expresso rond pour terminer votre repas.',
        hasProteinChoice: false,
        price: 3.5,
        spicy: false,
        isDrink: true
      }
    ]
  }
];

// Flat items dictionary for instant lookup
const ALL_ITEMS_MAP: Record<string, MenuItem> = {};
MENU_CATEGORIES.forEach((cat) => {
  cat.items.forEach((item) => {
    ALL_ITEMS_MAP[item.id] = item;
  });
});

// Helper for allergen labels
const ALLERGEN_LABELS: Record<Allergen, string> = {
  gluten: 'Gluten',
  lactose: 'Lait & Fromage',
  nuts: 'Fruits à coque',
  eggs: 'Œufs',
  fish: 'Poisson'
};

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

export default function MokitoMenuApp() {
  // Navigation & Filtering
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDietFilter, setActiveDietFilter] = useState<'all' | 'spicy' | 'chef' | 'veggie' | 'favorites'>('all');

  // Evening / Day Ambience Theme Toggle
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Table Assignment
  // Favorites (persisted in localStorage)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mokito_favorites');
      return saved ? JSON.parse(saved) : ['bb-truffee', 'des-tiramisu'];
    } catch {
      return ['bb-truffee', 'des-tiramisu'];
    }
  });

  // Selected dish & in-card protein choices
  const [cardProteins, setCardProteins] = useState<Record<string, ProteinChoice>>({});
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [modalProtein, setModalProtein] = useState<ProteinChoice>('poulet');
  const [modalSupplements, setModalSupplements] = useState<Supplement[]>([]);
  const [modalQuantity, setModalQuantity] = useState<number>(1);
  const [modalNotes, setModalNotes] = useState<string>('');

  // Cart / Table Selection State (persisted in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mokito_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Bill Splitting Tool State
  const [guestSplitCount, setGuestSplitCount] = useState<number>(2);

  // Floating Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist cart & favorites
  useEffect(() => {
    try {
      localStorage.setItem('mokito_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('mokito_favorites', JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  const addToast = (text: string, type: ToastMessage['type'] = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const toggleFavorite = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const exists = prev.includes(itemId);
      const next = exists ? prev.filter((id) => id !== itemId) : [...prev, itemId];
      addToast(
        exists ? 'Retiré de vos favoris' : 'Ajouté à vos favoris MOKiTO !',
        'info'
      );
      return next;
    });
  };

  const getCardProtein = (itemId: string): ProteinChoice => {
    return cardProteins[itemId] || 'poulet';
  };

  const handleCardProteinToggle = (itemId: string, choice: ProteinChoice, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardProteins((prev) => ({ ...prev, [itemId]: choice }));
  };

  const openDishModal = (item: MenuItem) => {
    setSelectedDish(item);
    setModalProtein(getCardProtein(item.id));
    setModalSupplements([]);
    setModalQuantity(1);
    setModalNotes('');
  };

  const toggleSupplement = (sup: Supplement) => {
    setModalSupplements((prev) =>
      prev.some((s) => s.id === sup.id)
        ? prev.filter((s) => s.id !== sup.id)
        : [...prev, sup]
    );
  };

  const handleAddToSelection = () => {
    if (!selectedDish) return;
    const basePrice = selectedDish.hasProteinChoice && selectedDish.prices
      ? selectedDish.prices[modalProtein]
      : selectedDish.price || 0;
    const supTotal = modalSupplements.reduce((acc, s) => acc + s.price, 0);
    const unitPrice = basePrice + supTotal;

    const newEntry: CartItem = {
      cartId: `${selectedDish.id}-${Date.now()}`,
      itemId: selectedDish.id,
      dishType: selectedDish.dishType,
      name: selectedDish.name,
      protein: selectedDish.hasProteinChoice
        ? modalProtein === 'poulet'
          ? 'Blanc de Poulet'
          : 'Viande Hachée'
        : null,
      supplements: modalSupplements,
      unitPrice,
      quantity: modalQuantity,
      notes: modalNotes.trim()
    };

    setCart((prev) => [...prev, newEntry]);
    addToast(`${modalQuantity}x ${selectedDish.name} ajouté à votre sélection !`);
    setSelectedDish(null);
  };

  const handleAddPairingDirectly = (pairingItem: MenuItem) => {
    const unitPrice = pairingItem.hasProteinChoice && pairingItem.prices
      ? pairingItem.prices.poulet
      : pairingItem.price || 0;

    const newEntry: CartItem = {
      cartId: `${pairingItem.id}-${Date.now()}`,
      itemId: pairingItem.id,
      dishType: pairingItem.dishType,
      name: pairingItem.name,
      protein: pairingItem.hasProteinChoice ? 'Blanc de Poulet' : null,
      supplements: [],
      unitPrice,
      quantity: 1,
      notes: 'Suggestion du chef'
    };

    setCart((prev) => [...prev, newEntry]);
    addToast(`+ ${pairingItem.name} ajouté !`);
  };

  // Filtered categories and dishes
  const filteredCategories = useMemo(() => {
    return MENU_CATEGORIES.map((cat) => {
      if (activeCategory !== 'all' && cat.id !== activeCategory) {
        return { ...cat, items: [] };
      }

      const items = cat.items.filter((item) => {
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !query ||
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query);

        let matchesDiet = true;
        if (activeDietFilter === 'spicy') matchesDiet = !!item.spicy;
        if (activeDietFilter === 'chef') matchesDiet = item.tags?.includes('chef') || false;
        if (activeDietFilter === 'veggie') matchesDiet = item.tags?.includes('veggie') || false;
        if (activeDietFilter === 'favorites') matchesDiet = favorites.includes(item.id);

        return matchesSearch && matchesDiet;
      });

      return { ...cat, items };
    }).filter((cat) => cat.items.length > 0);
  }, [activeCategory, searchQuery, activeDietFilter, favorites]);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const splitPricePerPerson = (totalCartPrice / guestSplitCount).toFixed(2);

  // Generate WhatsApp Order Text
  const generateWhatsAppOrderUrl = () => {
    if (cart.length === 0) return '';
    let msg = `Bonjour MOKiTO !\nVoici notre commande :\n\n`;
    cart.forEach((item, index) => {
      msg += `${index + 1}. *${item.quantity}x ${item.name}*`;
      if (item.protein) msg += ` (${item.protein})`;
      msg += ` — ${(item.unitPrice * item.quantity).toFixed(1)} DT\n`;
      if (item.supplements.length > 0) {
        msg += `   └ Suppléments : ${item.supplements.map((s) => s.name).join(', ')}\n`;
      }
      if (item.notes) {
        msg += `   └ Note : ${item.notes}\n`;
      }
    });
    msg += `\n*TOTAL : ${totalCartPrice.toFixed(1)} DT*`;
    msg += `\nMerci et bon courage à toute l'équipe !`;
    return `https://wa.me/21629300029?text=${encodeURIComponent(msg)}`;
  };

  const handleCallWaiter = (reason: 'waiter' | 'bill_cash' | 'bill_card') => {
    if (reason === 'waiter') {
      addToast('Serveur appelé !', 'bell');
    } else if (reason === 'bill_cash') {
      addToast("Demande d'addition en Espèces envoyée", 'bell');
    } else {
      addToast('Demande de TPE Carte Bancaire envoyée', 'bell');
    }
  };

  const handleShareMenu = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'MOKiTO - Cuisine Sincère',
        text: 'Découvrez la carte digitale officielle de MOKiTO Menzah 1 !',
        url
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      addToast('Lien du menu copié dans le presse-papier !');
    }
  };

  // Color tokens depending on theme
  const theme = {
    bg: isDarkMode ? '#171614' : '#D6BE9B',
    panelBg: isDarkMode ? 'rgba(38, 35, 31, 0.75)' : 'rgba(238, 223, 198, 0.62)',
    panelHover: isDarkMode ? 'rgba(50, 46, 40, 0.95)' : 'rgba(245, 234, 214, 0.90)',
    text: isDarkMode ? '#F5EAD6' : '#1E1D1B',
    textMuted: isDarkMode ? 'rgba(245, 234, 214, 0.72)' : 'rgba(30, 29, 27, 0.78)',
    border: isDarkMode ? 'rgba(245, 234, 214, 0.22)' : 'rgba(30, 29, 27, 0.28)',
    borderSolid: isDarkMode ? '#EAD6B9' : '#1E1D1B',
    accentRed: '#C83E2B',
    accentGold: '#E4B875',
    cardInner: isDarkMode ? '#24211D' : '#EFE2CA',
    headerBg: isDarkMode ? '#100F0E' : '#1E1D1B',
    headerText: '#E8D6B9'
  };

  return (
    <div
      className="min-h-screen relative transition-colors duration-300 selection:bg-[#1E1D1B] selection:text-[#DFC9A8]"
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        backgroundImage: isDarkMode
          ? `
            radial-gradient(at 15% 15%, rgba(60, 52, 42, 0.35) 0px, transparent 55%),
            radial-gradient(at 85% 45%, rgba(30, 28, 25, 0.40) 0px, transparent 60%),
            repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.015) 0px, rgba(255, 255, 255, 0.015) 1px, transparent 1px, transparent 3px),
            repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.01) 0px, rgba(255, 255, 255, 0.01) 1px, transparent 1px, transparent 4px)
          `
          : `
            radial-gradient(at 15% 15%, rgba(255, 248, 235, 0.32) 0px, transparent 55%),
            radial-gradient(at 85% 45%, rgba(152, 120, 82, 0.24) 0px, transparent 60%),
            radial-gradient(at 50% 85%, rgba(248, 237, 218, 0.28) 0px, transparent 55%),
            repeating-linear-gradient(0deg, rgba(30, 29, 27, 0.02) 0px, rgba(30, 29, 27, 0.02) 1px, transparent 1px, transparent 3px),
            repeating-linear-gradient(90deg, rgba(30, 29, 27, 0.012) 0px, rgba(30, 29, 27, 0.012) 1px, transparent 1px, transparent 4px)
          `,
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      {/* Dynamic Font & Print Stylesheet */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap');

        .mokito-heading {
          font-family: 'Oswald', sans-serif;
          letter-spacing: 0.04em;
        }
        .kraft-panel {
          background: ${theme.panelBg};
          backdrop-filter: blur(5px);
          border: 1.5px solid ${theme.border};
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .kraft-panel:hover {
          background: ${theme.panelHover};
          border-color: ${theme.borderSolid};
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @media print {
          nav, footer, .floating-actions, .no-print {
            display: none !important;
          }
          body, .min-h-screen {
            background: white !important;
            color: black !important;
          }
          .kraft-panel {
            background: transparent !important;
            border: 1px solid #333 !important;
            break-inside: avoid;
          }
        }
      `}</style>

      {/* ====================================================================
          SUBTLE TOP INFORMATION BAR
         ==================================================================== */}
      <div style={{ backgroundColor: theme.headerBg, color: theme.headerText }} className="border-b border-[#3A2E25] no-print">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <PinSVG className="w-3.5 h-3.5 text-[#D6BE9B]" />
            <span>3, Rue El Mourouj, Menzah 1, Tunis</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">


            <a
              href="tel:29300029"
              className="flex items-center gap-1 font-bold text-[#E8D6B9] hover:text-white transition"
            >
              <PhoneSVG className="w-3.5 h-3.5 text-[#D6BE9B]" />
              <span>29 300 029</span>
            </a>

            <span className="hidden md:inline opacity-30">|</span>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="flex items-center gap-1 hover:text-white transition text-[11px]"
              title={isDarkMode ? 'Passer en Ambiance Jour' : 'Passer en Ambiance Soirée'}
            >
              <SunMoonSVG className="w-3.5 h-3.5" isDark={isDarkMode} />
              <span className="hidden sm:inline">{isDarkMode ? 'Soirée' : 'Jour'}</span>
            </button>

            <button
              onClick={handleShareMenu}
              className="hover:text-white transition flex items-center gap-1"
              title="Partager la carte"
            >
              <ShareSVG className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================================
          EDITORIAL KRAFT-PAPER HERO SECTION
         ==================================================================== */}
      <header className="relative border-b-2 overflow-hidden" style={{ borderColor: theme.borderSolid }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <div
            className="relative border-2 rounded-3xl p-6 sm:p-10 shadow-sm"
            style={{
              borderColor: theme.borderSolid,
              backgroundColor: isDarkMode ? 'rgba(32, 29, 25, 0.75)' : 'rgba(223, 201, 168, 0.55)'
            }}
          >
            {/* Vintage French Corner Accents */}
            <div className="hidden sm:block absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: theme.borderSolid }} />
            <div className="hidden sm:block absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: theme.borderSolid }} />
            <div className="hidden sm:block absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: theme.borderSolid }} />
            <div className="hidden sm:block absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: theme.borderSolid }} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Brand, Business Concept Headline, Caption & Pillars */}
              <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
                {/* Concept Overline Badge */}
                <div
                  className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-[11px] font-bold uppercase tracking-widest mb-3"
                  style={{
                    borderColor: theme.border,
                    backgroundColor: isDarkMode ? '#282420' : '#EFE2CA'
                  }}
                >
                  <DiamondSVG className="w-2 h-2 text-[#C83E2B]" />
                  <span>MENZAH 1, TUNIS • PIONNIER DU BREAD BOWL</span>
                  <DiamondSVG className="w-2 h-2 text-[#C83E2B]" />
                </div>

                <MokitoWordmarkSVG className="h-16 sm:h-24 w-auto" color={theme.text} />

                {/* Decorative Diamond Divider */}
                <div className="w-full max-w-md my-3.5">
                  <div className="flex items-center justify-center lg:justify-start gap-3">
                    <div className="h-[1.5px] w-16" style={{ backgroundColor: theme.borderSolid }} />
                    <DiamondSVG className="w-2.5 h-2.5" />
                    <div className="h-[1.5px] flex-1 max-w-[180px]" style={{ backgroundColor: theme.borderSolid }} />
                  </div>
                </div>

                {/* Core Business Concept Headline */}
                <h1
                  className="mokito-heading text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wide leading-tight"
                  style={{ color: theme.text }}
                >
                  Du pain creusé, bien doré, garni de fondue de fromage maison & de légumes confits.
                </h1>

                {/* Business Explanation Caption */}
                <p
                  className="mt-3 text-xs sm:text-sm font-medium leading-relaxed max-w-xl"
                  style={{ color: theme.textMuted }}
                >
                  Pourquoi manger dans une assiette ordinaire quand on peut dévorer son plat jusqu'à la croûte ? Chez <strong className="font-bold">MOKiTO</strong>, chaque repas signature est préparé dans une boule de pain artisanal évidée à la main, toastée au four, puis généreusement nappée de fondue de fromage fondante, de légumes confits méditerranéens et de viandes grillées. Un plat complet, réconfortant et 100% fait maison, toujours servi chaud avec ses potatoes croustillantes.
                </p>

                {/* 3 Business Pillars Grid */}
                <div
                  className="mt-6 pt-5 border-t w-full grid grid-cols-1 sm:grid-cols-3 gap-3 text-left"
                  style={{ borderColor: theme.border }}
                >
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl" style={{ backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.25)' }}>
                    <div className="w-7 h-7 rounded-lg bg-[#C83E2B]/10 flex items-center justify-center shrink-0 text-[#C83E2B]">
                      <PillarBreadIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="mokito-heading text-xs sm:text-sm font-bold uppercase tracking-wider">
                        Assiette Comestible
                      </div>
                      <div className="text-[11px] leading-tight mt-0.5" style={{ color: theme.textMuted }}>
                        Boule au levain croustillante évidée à la main
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl" style={{ backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.25)' }}>
                    <div className="w-7 h-7 rounded-lg bg-[#C83E2B]/10 flex items-center justify-center shrink-0 text-[#C83E2B]">
                      <PillarCheeseIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="mokito-heading text-xs sm:text-sm font-bold uppercase tracking-wider">
                        Fondue & Confit
                      </div>
                      <div className="text-[11px] leading-tight mt-0.5" style={{ color: theme.textMuted }}>
                        Fromages fondants et aubergines/courgettes mijotées
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl" style={{ backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.25)' }}>
                    <div className="w-7 h-7 rounded-lg bg-[#C83E2B]/10 flex items-center justify-center shrink-0 text-[#C83E2B]">
                      <PillarPotatoIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="mokito-heading text-xs sm:text-sm font-bold uppercase tracking-wider">
                        Potatoes Incluses
                      </div>
                      <div className="text-[11px] leading-tight mt-0.5" style={{ color: theme.textMuted }}>
                        Servies avec chaque Bread Bowl & sauces maison
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fast Action Links */}
                <div className="mt-5 flex items-center gap-3 flex-wrap justify-center lg:justify-start">
                  <a
                    href="#bread-bowls"
                    className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm flex items-center gap-1.5 hover:bg-[#C83E2B] hover:text-white"
                    style={{
                      backgroundColor: isDarkMode ? '#F4E8D3' : '#1E1D1B',
                      color: isDarkMode ? '#1E1D1B' : '#EFE2CA'
                    }}
                  >
                    <span>Découvrir la carte</span>
                    <span>↓</span>
                  </a>

                  <a
                    href="tel:29300029"
                    className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition flex items-center gap-1.5 hover:bg-black/10"
                    style={{
                      borderColor: theme.borderSolid,
                      color: theme.text
                    }}
                  >
                    <PhoneSVG className="w-3.5 h-3.5" />
                    <span>29 300 029</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Visual Concept Showcase with Masterpiece French Bistro Mascot */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
                <div
                  className="relative p-6 rounded-3xl border shadow-xl flex flex-col items-center justify-center w-full max-w-sm overflow-hidden"
                  style={{
                    backgroundColor: isDarkMode ? 'rgba(38, 34, 30, 0.90)' : 'rgba(247, 238, 223, 0.92)',
                    borderColor: theme.borderSolid
                  }}
                >
                  {/* Subtle Decorative Vintage Corner Accents */}
                  <div className="absolute top-3.5 left-3.5 opacity-30">
                    <DiamondSVG className="w-2.5 h-2.5" />
                  </div>
                  <div className="absolute top-3.5 right-3.5 opacity-30">
                    <DiamondSVG className="w-2.5 h-2.5" />
                  </div>

                  {/* Masterpiece French Bistro Server Mascot (Cloche Service) */}
                  <div className="relative z-10 w-full flex flex-col items-center justify-center py-2">
                    <RunningServerIllustration
                      className="w-56 h-48 sm:w-64 sm:h-56 filter drop-shadow-md"
                      stroke={theme.borderSolid}
                    />
                  </div>

                  {/* Floating Artisanal Quality Seal */}
                  <div className="absolute -bottom-3 -right-3 hidden sm:block z-20">
                    <ArtisanalSealBadgeSVG className="w-20 h-20 filter drop-shadow-md" stroke={theme.borderSolid} />
                  </div>
                </div>

                {/* Authentic Delivery Partners Bar with Real Official Logos */}
                <div
                  className="mt-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-bold shadow-sm flex-wrap justify-center"
                  style={{
                    borderColor: theme.border,
                    backgroundColor: isDarkMode ? '#24201C' : '#EFE2CA'
                  }}
                >
                  <span className="opacity-75 uppercase tracking-wider text-[10px] px-1">Livraison rapide :</span>
                  <GlovoOfficialLogoSVG />
                  <YassirOfficialLogoSVG />
                  <KoolOfficialLogoSVG />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ====================================================================
          PREMIUM BISTRO STICKY NAVIGATION BAR
         ==================================================================== */}
      <nav
        id="menu-categories"
        className="sticky top-0 z-30 backdrop-blur-md border-b-2 shadow-md transition-all duration-200 no-print"
        style={{
          backgroundColor: isDarkMode ? 'rgba(23, 21, 19, 0.95)' : 'rgba(239, 226, 202, 0.95)',
          borderColor: theme.borderSolid
        }}
      >
        <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2 space-y-2">
          {/* Tier 1: Brand Anchor + Search Bar + Filter Controls + Cart Trigger */}
          <div className="flex items-center justify-between gap-2.5 flex-wrap sm:flex-nowrap">
            {/* Brand Logo & Back to Top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 text-left group shrink-0"
              title="Retour en haut"
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center p-1 shadow-sm border transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: isDarkMode ? '#F4E8D3' : '#1E1D1B',
                  borderColor: theme.borderSolid
                }}
              >
                <RunningServerIllustration
                  className="w-full h-full object-contain"
                  stroke={isDarkMode ? '#1E1D1B' : '#EFE2CA'}
                />
              </div>
              <div className="hidden xs:block">
                <span className="mokito-heading text-sm font-black tracking-wider uppercase block leading-none">
                  MOKiTO
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest opacity-60 leading-none">
                  Menzah 1
                </span>
              </div>
            </button>

            {/* Smart Search Input with Clear Button */}
            <div className="relative flex-1 min-w-[170px] sm:min-w-[240px]">
              <SearchSVG className="w-3.5 h-3.5 opacity-60 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher (truffe, spicy, saumon...)"
                className="w-full pl-8 pr-7 py-1.5 rounded-xl text-xs sm:text-sm border focus:outline-none transition"
                style={{
                  backgroundColor: theme.cardInner,
                  borderColor: theme.border,
                  color: theme.text
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 p-0.5"
                  aria-label="Effacer la recherche"
                >
                  <CloseSVG className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Actions: Dietary Filters, Day/Night & Cart Trigger */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Spicy Filter */}
              <button
                onClick={() => setActiveDietFilter(activeDietFilter === 'spicy' ? 'all' : 'spicy')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition ${
                  activeDietFilter === 'spicy'
                    ? 'bg-[#C83E2B] text-white border-[#C83E2B]'
                    : 'border-opacity-40 hover:border-opacity-100'
                }`}
                style={{
                  backgroundColor: activeDietFilter === 'spicy' ? '#C83E2B' : theme.cardInner,
                  borderColor: activeDietFilter === 'spicy' ? '#C83E2B' : theme.borderSolid,
                  color: activeDietFilter === 'spicy' ? '#FFFFFF' : theme.text
                }}
                title="Filtrer les plats piquants"
              >
                <ChiliPepperSVG className="w-3 h-3" />
                <span className="hidden md:inline">Piquant</span>
              </button>

              {/* Favorites Filter */}
              <button
                onClick={() => setActiveDietFilter(activeDietFilter === 'favorites' ? 'all' : 'favorites')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition ${
                  activeDietFilter === 'favorites'
                    ? 'bg-[#C83E2B] text-white border-[#C83E2B]'
                    : 'border-opacity-40 hover:border-opacity-100'
                }`}
                style={{
                  backgroundColor: activeDietFilter === 'favorites' ? '#C83E2B' : theme.cardInner,
                  borderColor: activeDietFilter === 'favorites' ? '#C83E2B' : theme.borderSolid,
                  color: activeDietFilter === 'favorites' ? '#FFFFFF' : theme.text
                }}
                title="Voir mes favoris"
              >
                <HeartSVG className="w-3 h-3" filled={activeDietFilter === 'favorites'} />
                <span className="hidden md:inline">Favoris</span>
                {favorites.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-bold">
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* Day / Night Ambiance Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-1.5 rounded-xl border transition flex items-center justify-center hover:bg-black/10"
                style={{
                  backgroundColor: theme.cardInner,
                  borderColor: theme.borderSolid,
                  color: theme.text
                }}
                title={isDarkMode ? 'Passer en Ambiance Jour' : 'Passer en Ambiance Soirée'}
                aria-label="Basculer le mode sombre/clair"
              >
                <SunMoonSVG className="w-3.5 h-3.5" isDark={isDarkMode} />
              </button>

              {/* Cart / Selection Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: '#C83E2B',
                  color: '#FFFFFF'
                }}
                title="Afficher ma sélection"
              >
                <CartSVG className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Panier</span>
                <span className="w-4 h-4 rounded-full bg-white text-[#C83E2B] text-[10px] font-black flex items-center justify-center">
                  {totalCartItems}
                </span>
                {totalCartPrice > 0 && (
                  <span className="hidden lg:inline text-[11px] font-extrabold border-l border-white/30 pl-1.5">
                    {totalCartPrice.toFixed(1).replace('.0', '')} DT
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Tier 2: Category Jump Ribbon with Vector Icons & Item Counts */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 pb-0.5 border-t border-black/5 dark:border-white/5">
            <button
              onClick={() => setActiveCategory('all')}
              className={`mokito-heading tracking-wider uppercase px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
                activeCategory === 'all' ? 'shadow-sm' : 'hover:bg-black/10'
              }`}
              style={{
                backgroundColor: activeCategory === 'all' ? (isDarkMode ? '#F4E8D3' : '#1E1D1B') : 'transparent',
                color: activeCategory === 'all' ? (isDarkMode ? '#1E1D1B' : '#EFE2CA') : theme.text
              }}
            >
              <span>TOUTE LA CARTE</span>
              <span
                className="text-[10px] px-1.5 py-0.2 rounded-full font-bold opacity-80"
                style={{
                  backgroundColor: activeCategory === 'all' ? (isDarkMode ? 'rgba(30,29,27,0.15)' : 'rgba(239, 226, 202, 0.25)') : 'rgba(0,0,0,0.08)'
                }}
              >
                22
              </span>
            </button>

            {MENU_CATEGORIES.map((cat) => {
              const IconComponent = cat.icon;
              const isActive = activeCategory === cat.id;
              const count = cat.items.length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`mokito-heading tracking-wider uppercase px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
                    isActive ? 'shadow-sm' : 'hover:bg-black/10'
                  }`}
                  style={{
                    backgroundColor: isActive ? (isDarkMode ? '#F4E8D3' : '#1E1D1B') : 'transparent',
                    color: isActive ? (isDarkMode ? '#1E1D1B' : '#EFE2CA') : theme.text
                  }}
                >
                  <IconComponent className="w-3.5 h-3.5 shrink-0" />
                  <span>{cat.title}</span>
                  <span
                    className="text-[10px] px-1.5 py-0.2 rounded-full font-bold opacity-80"
                    style={{
                      backgroundColor: isActive ? (isDarkMode ? 'rgba(30,29,27,0.15)' : 'rgba(239, 226, 202, 0.25)') : 'rgba(0,0,0,0.08)'
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}

            <a
              href="#supplements-section"
              className="mokito-heading tracking-wider uppercase px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition hover:bg-black/10 flex items-center gap-1.5"
              style={{ color: theme.text }}
            >
              <SupplementsIcon className="w-3.5 h-3.5" />
              <span>SUPPLÉMENTS</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-black/5 dark:bg-white/5 opacity-80">
                10
              </span>
            </a>
          </div>
        </div>
      </nav>

      {/* ====================================================================
          MAIN MENU SECTIONS & DISH GRIDS
          (Featuring authentic, 10/10 bespoke vector hero illustrations per section)
         ==================================================================== */}
      <main className="max-w-5xl mx-auto px-3 sm:px-6 py-8 space-y-12">
        {filteredCategories.length === 0 ? (
          <div className="kraft-panel rounded-2xl p-10 text-center space-y-3">
            <p className="mokito-heading text-2xl font-bold uppercase">Aucun plat ne correspond à vos filtres</p>
            <p className="text-sm" style={{ color: theme.textMuted }}>
              Essayez de modifier votre recherche ou de désactiver les filtres diététiques.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveDietFilter('all');
                setActiveCategory('all');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition"
              style={{
                backgroundColor: isDarkMode ? '#F4E8D3' : '#1E1D1B',
                color: isDarkMode ? '#1E1D1B' : '#EFE2CA'
              }}
            >
              Réinitialiser la carte
            </button>
          </div>
        ) : (
          filteredCategories.map((category) => {
            const HeroComponent = category.heroIllustration;
            return (
              <section key={category.id} id={category.id} className="space-y-6">
                {/* Category Header with Bespoke 10/10 Monoline Ink Illustration */}
                <div className="text-center max-w-2xl mx-auto">
                  <div className="flex justify-center mb-1">
                    <HeroComponent className="w-36 h-28 sm:w-44 sm:h-32" stroke={theme.borderSolid} />
                  </div>

                  <h2 className="mokito-heading text-3xl sm:text-4xl font-bold tracking-wider uppercase">
                    {category.title}
                  </h2>

                  {category.subtitle && (
                    <p className="text-xs sm:text-sm font-medium mt-1.5 leading-relaxed flex items-center justify-center gap-1.5 flex-wrap" style={{ color: theme.textMuted }}>
                      {category.id === 'salades' && <DiamondSVG className="w-2.5 h-2.5 shrink-0" />}
                      <span>{category.subtitle}</span>
                    </p>
                  )}

                  <DiamondDivider color={theme.borderSolid} />
                </div>

                {/* Dishes Grid — Clean, uncluttered, editorial typographic beauty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.items.map((item) => {
                    const activeProt = getCardProtein(item.id);
                    const currentPrice = item.hasProteinChoice && item.prices
                      ? item.prices[activeProt]
                      : item.price || 0;
                    const isFav = favorites.includes(item.id);

                    return (
                      <div
                        key={item.id}
                        onClick={() => openDishModal(item)}
                        className="kraft-panel rounded-2xl p-4 sm:p-5 cursor-pointer flex flex-col justify-between group relative overflow-hidden transition-all duration-300 hover:shadow-xl"
                      >
                        <div>
                          {/* Upper Card: Information on left, dedicated 10/10 dish illustration on right */}
                          <div className="flex items-start justify-between gap-3 sm:gap-4">
                            <div className="space-y-1.5 flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="mokito-heading text-xl sm:text-2xl font-bold tracking-wide group-hover:text-[#C83E2B] transition-colors">
                                  {item.name}
                                </h3>

                                {item.spicy && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#C83E2B]/15 text-[#C83E2B] text-[10px] font-bold uppercase tracking-wider">
                                    <ChiliPepperSVG className="w-3.5 h-3.5" />
                                    <span>Spicy</span>
                                  </span>
                                )}

                                {item.tags?.includes('chef') && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#1E1D1B]/10 dark:bg-white/10 text-[10px] font-bold uppercase tracking-wider">
                                    <SparklesSVG className="w-3 h-3 text-[#E4B875]" />
                                    <span>Signature</span>
                                  </span>
                                )}
                              </div>

                              {item.allergens && item.allergens.length > 0 && (
                                <div className="flex items-center gap-1.5 flex-wrap text-[10px] opacity-65">
                                  <span>Contient:</span>
                                  {item.allergens.map((alg) => (
                                    <span key={alg} className="underline decoration-dotted">
                                      {ALLERGEN_LABELS[alg]}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Dish Description */}
                              {item.description && (
                                <p className="text-xs sm:text-sm mt-1 leading-relaxed line-clamp-2" style={{ color: theme.textMuted }}>
                                  {item.description}
                                </p>
                              )}
                            </div>

                            {/* Right Column: Price + Dedicated 10/10 Dish Vector Artwork */}
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={(e) => toggleFavorite(item.id, e)}
                                  className="p-1 rounded-full hover:bg-black/10 transition"
                                  aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                                  title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                                >
                                  <HeartSVG className="w-4 h-4" filled={isFav} />
                                </button>

                                <div className="mokito-heading text-xl sm:text-2xl font-bold">
                                  {currentPrice} <span className="text-sm font-semibold">DT</span>
                                </div>
                              </div>

                              {/* 10/10 Dish Illustration on Artisanal Kraft Pedestal */}
                              <div
                                className="w-20 h-20 sm:w-22 sm:h-22 rounded-xl p-1.5 flex items-center justify-center border shadow-sm transition-transform duration-300 group-hover:scale-108 shrink-0"
                                style={{
                                  backgroundColor: isDarkMode ? 'rgba(40, 36, 32, 0.75)' : 'rgba(247, 238, 223, 0.85)',
                                  borderColor: theme.border
                                }}
                              >
                                {React.createElement(getDishIllustration(item), { className: 'w-full h-full object-contain filter drop-shadow-sm' })}
                              </div>
                            </div>
                          </div>

                          {/* Protein Switcher if applicable */}
                          {item.hasProteinChoice && item.prices && (
                            <div
                              className="mt-3.5 pt-2.5 border-t flex flex-wrap items-center justify-between gap-2"
                              style={{ borderColor: theme.border }}
                            >
                              <div
                                className="flex items-center gap-1 p-1 rounded-lg border"
                                style={{
                                  backgroundColor: isDarkMode ? '#282420' : '#D6BE9B',
                                  borderColor: theme.border
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={(e) => handleCardProteinToggle(item.id, 'poulet', e)}
                                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wide transition ${
                                    activeProt === 'poulet'
                                      ? 'bg-[#1E1D1B] text-[#EFE2CA]'
                                      : 'opacity-75 hover:opacity-100'
                                  }`}
                                >
                                  <DiamondSVG className="w-2 h-2" />
                                  <span>Poulet ({item.prices.poulet} DT)</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleCardProteinToggle(item.id, 'viande', e)}
                                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wide transition ${
                                    activeProt === 'viande'
                                      ? 'bg-[#1E1D1B] text-[#EFE2CA]'
                                      : 'opacity-75 hover:opacity-100'
                                  }`}
                                >
                                  <DiamondSVG className="w-2 h-2" />
                                  <span>Viande ({item.prices.viande} DT)</span>
                                </button>
                              </div>

                              <span
                                className="mokito-heading text-xs uppercase font-bold tracking-wider px-3 py-1 rounded transition group-hover:bg-[#C83E2B]"
                                style={{
                                  backgroundColor: isDarkMode ? '#F4E8D3' : '#1E1D1B',
                                  color: isDarkMode ? '#1E1D1B' : '#EFE2CA'
                                }}
                              >
                                + Choisir
                              </span>
                            </div>
                          )}
                        </div>

                        {!item.hasProteinChoice && (
                          <div
                            className="mt-3.5 pt-2.5 border-t flex items-center justify-between"
                            style={{ borderColor: theme.border }}
                          >
                            <span className="text-[11px] font-semibold opacity-65">
                              Personnaliser & suppléments
                            </span>
                            <span
                              className="mokito-heading text-xs uppercase font-bold tracking-wider px-3 py-1 rounded transition group-hover:bg-[#C83E2B]"
                              style={{
                                backgroundColor: isDarkMode ? '#F4E8D3' : '#1E1D1B',
                                color: isDarkMode ? '#1E1D1B' : '#EFE2CA'
                              }}
                            >
                              + Choisir
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Bread-Wich Spicy Note */}
                {category.id === 'bread-wich' && (
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#C83E2B] pt-1">
                    <ChiliPepperSVG className="w-4 h-4" />
                    <span>SPICY — Tous nos Bread-Wichs sont relevés à la sauce piquante</span>
                  </div>
                )}

                {/* Salades Footnotes */}
                {category.id === 'salades' && (
                  <div className="text-center text-xs italic space-y-0.5 pt-1" style={{ color: theme.textMuted }}>
                    <p>*Mélange de salade : laitue et roquette</p>
                    <p>*Légumes confits : Aubergines et courgettes</p>
                  </div>
                )}

                {/* Tiramisu Mason Jar Feature Banner */}
                {category.id === 'desserts' && (
                  <div
                    className="mt-4 kraft-panel rounded-2xl p-5 border-2 flex flex-col sm:flex-row items-center justify-between gap-4"
                    style={{ borderColor: theme.borderSolid }}
                  >
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                      <DessertsJarArtisanalIllustration className="w-32 h-26 shrink-0" stroke={theme.borderSolid} />
                      <div>
                        <div className="mokito-heading text-xs uppercase tracking-widest opacity-70 font-bold">
                          DESSERT SIGNATURE EN BOCAL
                        </div>
                        <h4 className="mokito-heading text-2xl font-bold mt-0.5">
                          TIRAMISU NUTELLA SPÉCULOOS — 12 DT
                        </h4>
                        <p className="text-xs sm:text-sm mt-1 max-w-lg" style={{ color: theme.textMuted }}>
                          La même base... avec une couche de Nutella en plus. On ne discute pas. On ferme les yeux.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const tiramisu = category.items.find((i) => i.id === 'des-tiramisu');
                        if (tiramisu) openDishModal(tiramisu);
                      }}
                      className="mokito-heading px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-[#C83E2B] transition shrink-0"
                      style={{
                        backgroundColor: isDarkMode ? '#F4E8D3' : '#1E1D1B',
                        color: isDarkMode ? '#1E1D1B' : '#EFE2CA'
                      }}
                    >
                      + Ajouter (12 DT)
                    </button>
                  </div>
                )}
              </section>
            );
          })
        )}

        {/* ====================================================================
            SUPPLEMENTS SECTION (WITH AUTHENTIC HERO ILLUSTRATION)
           ==================================================================== */}
        <section
          id="supplements-section"
          className="kraft-panel rounded-2xl p-6 sm:p-8 border-2"
          style={{ borderColor: theme.borderSolid }}
        >
          <div className="text-center max-w-xl mx-auto mb-6">
            <div className="flex justify-center mb-1">
              <SupplementsArtisanalIllustration className="w-36 h-28 sm:w-44 sm:h-32" stroke={theme.borderSolid} />
            </div>

            <h2 className="mokito-heading text-3xl sm:text-4xl font-bold tracking-wider uppercase">
              SUPPLEMENTS
            </h2>
            <DiamondDivider color={theme.borderSolid} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3">
            {SUPPLEMENTS_LIST.map((sup) => (
              <div
                key={sup.id}
                className="flex items-baseline justify-between gap-3 py-2 border-b"
                style={{ borderColor: theme.border }}
              >
                <div>
                  <div className="mokito-heading text-base sm:text-lg font-bold uppercase tracking-wide">
                    {sup.name}
                  </div>
                  {sup.detail && (
                    <div className="text-xs leading-snug mt-0.5" style={{ color: theme.textMuted }}>
                      {sup.detail}
                    </div>
                  )}
                </div>
                <div className="mokito-heading text-lg sm:text-xl font-bold shrink-0">
                  {sup.price} DT
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-6 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs italic"
            style={{ borderColor: theme.border, color: theme.textMuted }}
          >
            <span>*Mélange de salade : laitue et roquette</span>
            <span>*Légumes confits : Aubergines et courgettes</span>
          </div>
        </section>
      </main>

      {/* ====================================================================
          AUTHENTIC BACK-COVER FOOTER & CONTACT
         ==================================================================== */}
      <footer
        className="border-t-2 py-10 px-4 sm:px-6 mt-12 no-print"
        style={{
          borderColor: theme.borderSolid,
          backgroundColor: isDarkMode ? '#100F0E' : '#CBB18C',
          color: theme.text
        }}
      >
        <div className="max-w-5xl mx-auto space-y-8">
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b"
            style={{ borderColor: theme.border }}
          >
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-7 text-xs sm:text-sm font-bold">
              <a href="tel:29300029" className="flex items-center gap-2 hover:underline">
                <span className="w-7 h-7 rounded-full bg-[#1E1D1B] text-[#EFE2CA] flex items-center justify-center">
                  <PhoneSVG className="w-3.5 h-3.5" />
                </span>
                <span>29 300 029</span>
              </a>

              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#1E1D1B] text-[#EFE2CA] flex items-center justify-center">
                  <PinSVG className="w-3.5 h-3.5" />
                </span>
                <span>3, Rue El Mourouj, Menzah 1</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#1E1D1B] text-[#EFE2CA] flex items-center justify-center">
                  <FacebookSVG className="w-3.5 h-3.5" />
                </span>
                <span>Mokito</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#1E1D1B] text-[#EFE2CA] flex items-center justify-center">
                  <InstagramSVG className="w-3.5 h-3.5" />
                </span>
                <span>Mokito_Tunisia</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[11px] font-semibold opacity-70 uppercase tracking-wider hidden sm:inline">
                Partenaires :
              </span>
              <GlovoOfficialLogoSVG />
              <YassirOfficialLogoSVG />
              <KoolOfficialLogoSVG />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: theme.textMuted }}>
            <span>MOKiTO — Cuisine Sincère • 3, Rue El Mourouj, Menzah 1, Tunis</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 hover:underline"
              >
                <PrintSVG className="w-3.5 h-3.5" />
                <span>Imprimer la carte physique</span>
              </button>
              <span>Tous les prix en Dinars Tunisiens (DT)</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ====================================================================
          FLOATING BOTTOM BAR: "MA SÉLECTION DE TABLE"
         ==================================================================== */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-4 inset-x-0 z-40 px-4 pointer-events-none floating-actions no-print">
          <div className="max-w-md mx-auto pointer-events-auto">
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full bg-[#1E1D1B] text-[#EFE2CA] border-2 border-[#DFC9A8] rounded-2xl px-5 py-3.5 shadow-2xl flex items-center justify-between hover:bg-[#2c2a27] transition-all transform active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#C83E2B] text-white font-bold flex items-center justify-center text-sm shadow">
                  {totalCartItems}
                </div>
                <div className="text-left">
                  <div className="mokito-heading text-base font-bold tracking-wider uppercase">
                    MA SÉLECTION
                  </div>
                  <div className="text-[11px] text-[#D6BE9B]">
                    Afficher au serveur ou commander sur WhatsApp
                  </div>
                </div>
              </div>

              <div className="mokito-heading text-xl font-bold text-[#EFE2CA]">
                {totalCartPrice.toFixed(1).replace('.0', '')} DT
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          DISH CUSTOMIZATION DRAWER (WITH MATCHING HERO ARTWORK HEADER)
         ==================================================================== */}
      {selectedDish && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 no-print">
          <div
            className="border-t-2 sm:border-2 rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
            style={{
              backgroundColor: isDarkMode ? '#24211D' : '#DFC9A8',
              borderColor: theme.borderSolid,
              color: theme.text
            }}
          >
            {/* Modal Header */}
            <div className="bg-[#1E1D1B] text-[#EFE2CA] px-5 py-4 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="mokito-heading text-2xl font-bold tracking-wider uppercase">
                    {selectedDish.name}
                  </h3>
                  {selectedDish.spicy && <ChiliPepperSVG className="w-4 h-4" />}
                </div>
                {selectedDish.description && (
                  <p className="text-xs text-[#D6BE9B] mt-1 leading-relaxed">
                    {selectedDish.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedDish(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-[#EFE2CA]"
                aria-label="Fermer"
              >
                <CloseSVG className="w-5 h-5" />
              </button>
            </div>

            {/* Grand Dish Artwork Spotlight */}
            <div
              className="py-4 px-6 flex items-center justify-center border-b"
              style={{
                backgroundColor: isDarkMode ? '#1B1815' : '#ECE0CC',
                borderColor: theme.border
              }}
            >
              <div
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl p-2.5 flex items-center justify-center border shadow-lg"
                style={{
                  backgroundColor: isDarkMode ? '#24211D' : '#F7EEDF',
                  borderColor: theme.borderSolid
                }}
              >
                {React.createElement(getDishIllustration(selectedDish), { className: 'w-full h-full object-contain filter drop-shadow' })}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              {/* Protein Selector */}
              {selectedDish.hasProteinChoice && selectedDish.prices && (
                <div>
                  <label className="mokito-heading text-sm font-bold uppercase tracking-wider block mb-2">
                    1. CHOIX DE LA PROTÉINE
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setModalProtein('poulet')}
                      className={`p-3 rounded-xl border-2 text-left transition flex items-center justify-between ${
                        modalProtein === 'poulet'
                          ? 'bg-[#1E1D1B] text-[#EFE2CA] border-[#1E1D1B]'
                          : 'bg-[#EFE2CA]/75 text-[#1E1D1B] border-[#1E1D1B]/30'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs uppercase">Blanc de Poulet</div>
                        <div className="text-xs opacity-80 mt-0.5">{selectedDish.prices.poulet} DT</div>
                      </div>
                      {modalProtein === 'poulet' && <CheckSVG className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setModalProtein('viande')}
                      className={`p-3 rounded-xl border-2 text-left transition flex items-center justify-between ${
                        modalProtein === 'viande'
                          ? 'bg-[#1E1D1B] text-[#EFE2CA] border-[#1E1D1B]'
                          : 'bg-[#EFE2CA]/75 text-[#1E1D1B] border-[#1E1D1B]/30'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs uppercase">Viande Hachée</div>
                        <div className="text-xs opacity-80 mt-0.5">{selectedDish.prices.viande} DT</div>
                      </div>
                      {modalProtein === 'viande' && <CheckSVG className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Supplements Selector */}
              {!selectedDish.isDrink && !selectedDish.isDessert && (
                <div>
                  <label className="mokito-heading text-sm font-bold uppercase tracking-wider block mb-2">
                    {selectedDish.hasProteinChoice ? '2. SUPPLÉMENTS AU CHOIX' : '1. SUPPLÉMENTS AU CHOIX'}
                  </label>
                  <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                    {SUPPLEMENTS_LIST.map((sup) => {
                      const isChecked = modalSupplements.some((s) => s.id === sup.id);
                      return (
                        <button
                          key={sup.id}
                          type="button"
                          onClick={() => toggleSupplement(sup)}
                          className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between gap-2 ${
                            isChecked
                              ? 'bg-[#1E1D1B] text-[#EFE2CA] border-[#1E1D1B]'
                              : 'bg-[#EFE2CA]/70 text-[#1E1D1B] border-[#1E1D1B]/25 hover:bg-[#EFE2CA]'
                          }`}
                        >
                          <div className="text-xs">
                            <span className="font-bold uppercase">{sup.name}</span>
                            {sup.detail && (
                              <span className="block text-[11px] opacity-75">{sup.detail}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-bold">+{sup.price} DT</span>
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center border ${
                                isChecked
                                  ? 'bg-[#EFE2CA] border-[#EFE2CA] text-[#1E1D1B]'
                                  : 'border-current'
                              }`}
                            >
                              {isChecked && <CheckSVG className="w-3 h-3" />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Smart Pairing Suggestion */}
              {selectedDish.suggestedPairingId && ALL_ITEMS_MAP[selectedDish.suggestedPairingId] && (
                <div
                  className="p-3 rounded-xl border flex items-center justify-between gap-3 text-xs"
                  style={{
                    backgroundColor: isDarkMode ? '#1E1B18' : '#F2E5D0',
                    borderColor: theme.border
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#EFE2CA] border border-[#1E1D1B]/20 p-1 flex items-center justify-center shrink-0 shadow-sm">
                      {React.createElement(getDishIllustration(ALL_ITEMS_MAP[selectedDish.suggestedPairingId]), { className: 'w-full h-full object-contain' })}
                    </div>
                    <div>
                      <span className="mokito-heading text-[11px] uppercase font-bold tracking-wider opacity-75 block">
                        ACCORD CONSEILLÉ
                      </span>
                      <span className="font-bold">
                        {ALL_ITEMS_MAP[selectedDish.suggestedPairingId].name} (+{ALL_ITEMS_MAP[selectedDish.suggestedPairingId].price || ALL_ITEMS_MAP[selectedDish.suggestedPairingId].prices?.poulet} DT)
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddPairingDirectly(ALL_ITEMS_MAP[selectedDish.suggestedPairingId!])}
                    className="px-2.5 py-1 rounded-lg bg-[#1E1D1B] text-[#EFE2CA] text-[11px] font-bold uppercase shrink-0 hover:bg-[#C83E2B] transition"
                  >
                    + Ajouter
                  </button>
                </div>
              )}

              {/* Notes & Quantity */}
              <div className="space-y-3">
                <div>
                  <label className="mokito-heading text-xs font-bold uppercase tracking-wider block mb-1">
                    NOTE DU CLIENT OU PRÉFÉRENCE (OPTIONNEL)
                  </label>
                  <input
                    type="text"
                    value={modalNotes}
                    onChange={(e) => setModalNotes(e.target.value)}
                    placeholder="Ex: Sans oignons, sauce à part, bien doré..."
                    className="w-full px-3 py-2 rounded-xl bg-[#EFE2CA] border border-[#1E1D1B]/35 text-xs text-[#1E1D1B] placeholder-[#1E1D1B]/50 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="mokito-heading text-sm font-bold uppercase">QUANTITÉ</span>
                  <div className="flex items-center gap-3 bg-[#EFE2CA] px-3 py-1.5 rounded-xl border border-[#1E1D1B]/35 text-[#1E1D1B]">
                    <button
                      type="button"
                      onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                      className="p-1 rounded hover:bg-[#1E1D1B]/10"
                      aria-label="Diminuer la quantité"
                    >
                      <MinusSVG className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-sm w-5 text-center">{modalQuantity}</span>
                    <button
                      type="button"
                      onClick={() => setModalQuantity(modalQuantity + 1)}
                      className="p-1 rounded hover:bg-[#1E1D1B]/10"
                      aria-label="Augmenter la quantité"
                    >
                      <PlusSVG className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className="p-4 border-t"
              style={{
                backgroundColor: isDarkMode ? '#1E1B18' : '#D6BE9B',
                borderColor: theme.border
              }}
            >
              <button
                type="button"
                onClick={handleAddToSelection}
                className="w-full py-3.5 px-5 rounded-xl bg-[#1E1D1B] text-[#EFE2CA] font-bold text-sm uppercase tracking-wider flex items-center justify-between hover:bg-[#C83E2B] transition"
              >
                <span>Ajouter à ma sélection</span>
                <span className="mokito-heading text-lg">
                  {(
                    ((selectedDish.hasProteinChoice && selectedDish.prices
                      ? selectedDish.prices[modalProtein]
                      : selectedDish.price || 0) +
                      modalSupplements.reduce((acc, s) => acc + s.price, 0)) *
                    modalQuantity
                  )
                    .toFixed(1)
                    .replace('.0', '')}{' '}
                  DT
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          TABLE SELECTION & WHATSAPP ORDER DRAWER ("MA SÉLECTION")
         ==================================================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 no-print">
          <div
            className="border-t-2 sm:border-2 rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
            style={{
              backgroundColor: isDarkMode ? '#24211D' : '#DFC9A8',
              borderColor: theme.borderSolid,
              color: theme.text
            }}
          >
            {/* Header */}
            <div className="bg-[#1E1D1B] text-[#EFE2CA] px-5 py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="mokito-heading text-2xl font-bold tracking-wider uppercase">
                    MA SÉLECTION MOKiTO
                  </h3>

                </div>
                <p className="text-xs text-[#D6BE9B] mt-0.5">
                  Présentez au serveur ou commandez directement sur WhatsApp
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-[#EFE2CA]"
                aria-label="Fermer"
              >
                <CloseSVG className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              {cart.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <p className="mokito-heading text-xl font-bold uppercase">Votre sélection est vide</p>
                  <p className="text-xs opacity-75">Parcourez le menu et ajoutez des plats savoureux !</p>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div
                      key={item.cartId}
                      className="p-3.5 rounded-xl bg-[#EFE2CA] text-[#1E1D1B] border border-[#1E1D1B]/30 flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Mini Dish Illustration Thumbnail */}
                        <div className="w-12 h-12 rounded-lg bg-[#F8EFE2] border border-[#1E1D1B]/20 p-1 flex items-center justify-center shrink-0 shadow-sm">
                          {ALL_ITEMS_MAP[item.itemId] && React.createElement(getDishIllustration(ALL_ITEMS_MAP[item.itemId]), { className: 'w-full h-full object-contain' })}
                        </div>
                        <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-[#1E1D1B] text-[#EFE2CA] text-xs font-bold">
                            {item.quantity}x
                          </span>
                          <h4 className="mokito-heading text-lg font-bold">{item.name}</h4>
                        </div>

                        {item.protein && (
                          <div className="text-xs font-semibold text-[#1E1D1B] flex items-center gap-1.5">
                            <DiamondSVG className="w-2 h-2" />
                            <span>{item.protein}</span>
                          </div>
                        )}

                        {item.supplements?.length > 0 && (
                          <div className="text-xs text-[#1E1D1B]/80">
                            + Suppléments : {item.supplements.map((s) => s.name).join(', ')}
                          </div>
                        )}

                        {item.notes && (
                          <div className="text-[11px] italic text-[#1E1D1B]/70">
                            Note : {item.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="mokito-heading text-lg font-bold">
                          {(item.unitPrice * item.quantity).toFixed(1).replace('.0', '')} DT
                        </span>
                        <button
                          onClick={() => setCart((prev) => prev.filter((c) => c.cartId !== item.cartId))}
                          className="text-xs text-[#C83E2B] hover:underline flex items-center gap-1 font-semibold"
                        >
                          <TrashSVG className="w-3.5 h-3.5" />
                          <span>Retirer</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Group Dining: Partager l'addition (Bill Splitter) */}
                  <div
                    className="p-3.5 rounded-xl border mt-4 text-xs space-y-2.5"
                    style={{
                      backgroundColor: isDarkMode ? '#1E1B18' : '#EFE2CA',
                      borderColor: theme.border
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold uppercase">
                        <UsersSVG className="w-4 h-4 text-[#C83E2B]" />
                        <span>Partager l'addition entre convives</span>
                      </div>
                      <span className="font-bold text-sm">
                        {splitPricePerPerson} DT / pers.
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] opacity-75">Nombre de convives à table :</span>
                      <div className="flex items-center gap-1">
                        {[2, 3, 4, 5, 6].map((num) => (
                          <button
                            key={num}
                            onClick={() => setGuestSplitCount(num)}
                            className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                              guestSplitCount === num
                                ? 'bg-[#1E1D1B] text-[#EFE2CA]'
                                : 'bg-black/10 hover:bg-black/20'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Waiter & Bill Request Buttons */}
                  <div className="pt-2 border-t space-y-2" style={{ borderColor: theme.border }}>
                    <div className="text-[11px] uppercase font-bold tracking-wider opacity-75">
                      Service à table :
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleCallWaiter('waiter')}
                        className="p-2 rounded-xl border text-[11px] font-bold uppercase flex flex-col items-center gap-1 text-center hover:bg-black/10 transition"
                        style={{ borderColor: theme.border }}
                      >
                        <BellSVG className="w-4 h-4 text-[#C83E2B]" />
                        <span>Appeler serveur</span>
                      </button>

                      <button
                        onClick={() => handleCallWaiter('bill_cash')}
                        className="p-2 rounded-xl border text-[11px] font-bold uppercase flex flex-col items-center gap-1 text-center hover:bg-black/10 transition"
                        style={{ borderColor: theme.border }}
                      >
                        <ReceiptSVG className="w-4 h-4 text-[#1E1D1B] dark:text-[#EFE2CA]" />
                        <span>Addition Espèces</span>
                      </button>

                      <button
                        onClick={() => handleCallWaiter('bill_card')}
                        className="p-2 rounded-xl border text-[11px] font-bold uppercase flex flex-col items-center gap-1 text-center hover:bg-black/10 transition"
                        style={{ borderColor: theme.border }}
                      >
                        <ReceiptSVG className="w-4 h-4 text-[#1E1D1B] dark:text-[#EFE2CA]" />
                        <span>Addition Carte (TPE)</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Total & Action Buttons */}
            {cart.length > 0 && (
              <div
                className="p-4 sm:p-5 border-t space-y-3"
                style={{
                  backgroundColor: isDarkMode ? '#1E1B18' : '#D6BE9B',
                  borderColor: theme.border
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="mokito-heading text-lg font-bold uppercase">TOTAL DE LA TABLE</span>
                  <span className="mokito-heading text-3xl font-bold">
                    {totalCartPrice.toFixed(1).replace('.0', '')} DT
                  </span>
                </div>

                <a
                  href={generateWhatsAppOrderUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#1ebc59] shadow-lg transition"
                >
                  <WhatsAppSVG className="w-5 h-5" />
                  <span>Envoyer la commande via WhatsApp (+216 29 300 029)</span>
                </a>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => {
                      if (confirm('Voulez-vous vraiment vider votre sélection ?')) {
                        setCart([]);
                        addToast('Sélection vidée.');
                      }
                    }}
                    className="py-2.5 px-3 rounded-xl border-2 text-xs font-bold uppercase tracking-wider hover:bg-black/10 transition"
                    style={{ borderColor: theme.borderSolid }}
                  >
                    Vider la sélection
                  </button>

                  <a
                    href="tel:29300029"
                    className="py-2.5 px-3 rounded-xl bg-[#1E1D1B] text-[#EFE2CA] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#C83E2B] transition"
                  >
                    <PhoneSVG className="w-4 h-4" />
                    <span>Appeler 29 300 029</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      {/* ====================================================================
          FLOATING TOAST NOTIFICATION CONTAINER
         ==================================================================== */}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none no-print">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-2.5 text-xs font-bold uppercase tracking-wide animate-in slide-in-from-top-3 fade-in duration-200"
            style={{
              backgroundColor: toast.type === 'bell' ? '#C83E2B' : '#1E1D1B',
              color: '#EFE2CA',
              borderColor: '#EAD6B9'
            }}
          >
            {toast.type === 'bell' ? (
              <BellSVG className="w-4 h-4 text-white animate-bounce" />
            ) : (
              <CheckSVG className="w-4 h-4 text-[#25D366]" />
            )}
            <span>{toast.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}