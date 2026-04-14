import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order } from './checkoutStore';

export interface CRMCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  tags: string[];
  notes: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: Date;
  joinDate: Date;
  status: 'active' | 'inactive' | 'vip';
  source: 'organic' | 'referral' | 'social' | 'ads' | 'other';
}

export interface Automation {
  id: string;
  name: string;
  trigger: 'new_order' | 'abandoned_cart' | 'birthday' | 'inactive' | 'price_drop';
  conditions: Record<string, any>;
  actions: {
    type: 'email' | 'notification' | 'tag' | 'discount';
    config: Record<string, any>;
  }[];
  isActive: boolean;
  createdAt: Date;
  lastRun?: Date;
  runCount: number;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  recipients: string[];
  status: 'draft' | 'scheduled' | 'sending' | 'sent';
  scheduledAt?: Date;
  sentAt?: Date;
  openRate?: number;
  clickRate?: number;
}

interface CRMState {
  customers: CRMCustomer[];
  automations: Automation[];
  campaigns: EmailCampaign[];
  
  // Customer actions
  addCustomer: (customer: Omit<CRMCustomer, 'id' | 'joinDate'>) => CRMCustomer;
  updateCustomer: (id: string, data: Partial<CRMCustomer>) => void;
  deleteCustomer: (id: string) => void;
  getCustomerByEmail: (email: string) => CRMCustomer | undefined;
  syncFromOrder: (order: Order) => void;
  getCustomerMetrics: () => {
    totalCustomers: number;
    activeCustomers: number;
    vipCustomers: number;
    averageLifetimeValue: number;
  };
  
  // Automation actions
  createAutomation: (automation: Omit<Automation, 'id' | 'createdAt' | 'runCount'>) => Automation;
  updateAutomation: (id: string, data: Partial<Automation>) => void;
  deleteAutomation: (id: string) => void;
  runAutomation: (id: string) => void;
  
  // Campaign actions
  createCampaign: (campaign: Omit<EmailCampaign, 'id'>) => EmailCampaign;
  updateCampaign: (id: string, data: Partial<EmailCampaign>) => void;
  deleteCampaign: (id: string) => void;
  sendCampaign: (id: string) => void;
  scheduleCampaign: (id: string, date: Date) => void;
}

export const useCRMStore = create<CRMState>()(
  persist(
    (set, get) => ({
      customers: [],
      automations: [],
      campaigns: [],

      // Customer actions
      addCustomer: (customer) => {
        const newCustomer: CRMCustomer = {
          ...customer,
          id: `CUST-${Date.now()}`,
          joinDate: new Date(),
        };
        set((state) => ({ customers: [...state.customers, newCustomer] }));
        return newCustomer;
      },

      updateCustomer: (id, data) => {
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        }));
      },

      deleteCustomer: (id) => {
        set((state) => ({
          customers: state.customers.filter((c) => c.id !== id),
        }));
      },

      getCustomerByEmail: (email) => {
        return get().customers.find((c) => c.email === email);
      },

      syncFromOrder: (order) => {
        const existing = get().getCustomerByEmail(order.shippingInfo.email);
        if (existing) {
          get().updateCustomer(existing.id, {
            totalOrders: existing.totalOrders + 1,
            totalSpent: existing.totalSpent + order.total,
            lastOrderDate: new Date(),
            status: existing.totalSpent + order.total > 2000 ? 'vip' : 'active',
          });
        } else {
          get().addCustomer({
            name: `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`,
            email: order.shippingInfo.email,
            phone: order.shippingInfo.phone,
            address: order.shippingInfo.address,
            city: order.shippingInfo.city,
            tags: [],
            notes: '',
            totalOrders: 1,
            totalSpent: order.total,
            lastOrderDate: new Date(),
            status: 'active',
            source: 'organic',
          });
        }
      },

      getCustomerMetrics: () => {
        const customers = get().customers;
        const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);
        return {
          totalCustomers: customers.length,
          activeCustomers: customers.filter((c) => c.status === 'active').length,
          vipCustomers: customers.filter((c) => c.status === 'vip').length,
          averageLifetimeValue: customers.length > 0 ? totalSpent / customers.length : 0,
        };
      },

      // Automation actions
      createAutomation: (automation) => {
        const newAutomation: Automation = {
          ...automation,
          id: `AUTO-${Date.now()}`,
          createdAt: new Date(),
          runCount: 0,
        };
        set((state) => ({ automations: [...state.automations, newAutomation] }));
        return newAutomation;
      },

      updateAutomation: (id, data) => {
        set((state) => ({
          automations: state.automations.map((a) =>
            a.id === id ? { ...a, ...data } : a
          ),
        }));
      },

      deleteAutomation: (id) => {
        set((state) => ({
          automations: state.automations.filter((a) => a.id !== id),
        }));
      },

      runAutomation: (id) => {
        set((state) => ({
          automations: state.automations.map((a) =>
            a.id === id
              ? { ...a, lastRun: new Date(), runCount: a.runCount + 1 }
              : a
          ),
        }));
      },

      // Campaign actions
      createCampaign: (campaign) => {
        const newCampaign: EmailCampaign = {
          ...campaign,
          id: `CAMP-${Date.now()}`,
        };
        set((state) => ({ campaigns: [...state.campaigns, newCampaign] }));
        return newCampaign;
      },

      updateCampaign: (id, data) => {
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        }));
      },

      deleteCampaign: (id) => {
        set((state) => ({
          campaigns: state.campaigns.filter((c) => c.id !== id),
        }));
      },

      sendCampaign: (id) => {
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === id
              ? { ...c, status: 'sent', sentAt: new Date() }
              : c
          ),
        }));
      },

      scheduleCampaign: (id, date) => {
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === id
              ? { ...c, status: 'scheduled', scheduledAt: date }
              : c
          ),
        }));
      },
    }),
    {
      name: 'crm-storage',
    }
  )
);
