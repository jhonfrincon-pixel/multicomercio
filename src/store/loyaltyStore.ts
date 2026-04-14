import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LoyaltyMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  joinDate: Date;
  totalSpent: number;
  ordersCount: number;
  birthday?: string;
  preferences: {
    categories: string[];
    notifications: boolean;
  };
}

interface LoyaltyState {
  currentMember: LoyaltyMember | null;
  members: LoyaltyMember[];
  
  // Actions
  registerMember: (data: Partial<LoyaltyMember>) => LoyaltyMember;
  loginMember: (email: string) => LoyaltyMember | null;
  logout: () => void;
  addPoints: (email: string, points: number, reason?: string) => void;
  redeemPoints: (email: string, points: number) => { success: boolean; message: string };
  updateMember: (email: string, data: Partial<LoyaltyMember>) => void;
  getTierBenefits: (tier: LoyaltyMember['tier']) => string[];
  getPointsForPurchase: (amount: number) => number;
}

const TIER_BENEFITS: Record<LoyaltyMember['tier'], string[]> = {
  bronze: [
    '1 punto por cada $10 de compra',
    'Acceso a ofertas exclusivas',
    'Newsletter mensual',
  ],
  silver: [
    '1.5 puntos por cada $10 de compra',
    'Envío gratis en compras +$300',
    'Acceso 24h antes a nuevas colecciones',
    'Descuento de cumpleaños 10%',
  ],
  gold: [
    '2 puntos por cada $10 de compra',
    'Envío gratis en todas las compras',
    'Acceso 48h antes a nuevas colecciones',
    'Descuento de cumpleaños 15%',
    'Atención prioritaria',
  ],
  platinum: [
    '3 puntos por cada $10 de compra',
    'Envío express gratis',
    'Acceso prioritario a todo',
    'Descuento de cumpleaños 20%',
    'Atención VIP personalizada',
    'Regalos exclusivos',
  ],
};

const getTierFromPoints = (points: number): LoyaltyMember['tier'] => {
  if (points >= 5000) return 'platinum';
  if (points >= 2000) return 'gold';
  if (points >= 500) return 'silver';
  return 'bronze';
};

export const useLoyaltyStore = create<LoyaltyState>()(
  persist(
    (set, get) => ({
      currentMember: null,
      members: [],

      registerMember: (data) => {
        const newMember: LoyaltyMember = {
          id: `MEM-${Date.now()}`,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone,
          points: 100, // Welcome bonus
          tier: 'bronze',
          joinDate: new Date(),
          totalSpent: 0,
          ordersCount: 0,
          birthday: data.birthday,
          preferences: {
            categories: data.preferences?.categories || [],
            notifications: data.preferences?.notifications ?? true,
          },
        };

        set((state) => ({
          members: [...state.members, newMember],
          currentMember: newMember,
        }));

        return newMember;
      },

      loginMember: (email) => {
        const member = get().members.find((m) => m.email === email);
        if (member) {
          set({ currentMember: member });
        }
        return member || null;
      },

      logout: () => {
        set({ currentMember: null });
      },

      addPoints: (email, points, _reason) => {
        set((state) => ({
          members: state.members.map((m) => {
            if (m.email === email) {
              const newPoints = m.points + points;
              return {
                ...m,
                points: newPoints,
                tier: getTierFromPoints(newPoints),
              };
            }
            return m;
          }),
          currentMember: state.currentMember?.email === email
            ? {
                ...state.currentMember,
                points: state.currentMember.points + points,
                tier: getTierFromPoints(state.currentMember.points + points),
              }
            : state.currentMember,
        }));
      },

      redeemPoints: (email, points) => {
        const member = get().members.find((m) => m.email === email);
        if (!member) {
          return { success: false, message: 'Miembro no encontrado' };
        }
        if (member.points < points) {
          return { success: false, message: 'Puntos insuficientes' };
        }

        set((state) => ({
          members: state.members.map((m) =>
            m.email === email ? { ...m, points: m.points - points } : m
          ),
          currentMember: state.currentMember?.email === email
            ? { ...state.currentMember, points: state.currentMember.points - points }
            : state.currentMember,
        }));

        return { success: true, message: `¡${points} puntos canjeados exitosamente!` };
      },

      updateMember: (email, data) => {
        set((state) => ({
          members: state.members.map((m) =>
            m.email === email ? { ...m, ...data } : m
          ),
          currentMember: state.currentMember?.email === email
            ? { ...state.currentMember, ...data }
            : state.currentMember,
        }));
      },

      getTierBenefits: (tier) => TIER_BENEFITS[tier],

      getPointsForPurchase: (amount) => {
        const member = get().currentMember;
        if (!member) return Math.floor(amount / 10);
        
        const multipliers = {
          bronze: 1,
          silver: 1.5,
          gold: 2,
          platinum: 3,
        };
        
        return Math.floor((amount / 10) * multipliers[member.tier]);
      },
    }),
    {
      name: 'loyalty-storage',
    }
  )
);
