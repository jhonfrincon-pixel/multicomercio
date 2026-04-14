import { create } from 'zustand';
import type { Order } from './checkoutStore';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

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
  isLoading: boolean;
  error: string | null;
  loadCRMData: () => Promise<void>;
  
  // Customer actions
  addCustomer: (customer: Omit<CRMCustomer, 'id' | 'joinDate'>) => Promise<CRMCustomer>;
  updateCustomer: (id: string, data: Partial<CRMCustomer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  getCustomerByEmail: (email: string) => CRMCustomer | undefined;
  syncFromOrder: (order: Order) => Promise<void>;
  getCustomerMetrics: () => {
    totalCustomers: number;
    activeCustomers: number;
    vipCustomers: number;
    averageLifetimeValue: number;
  };
  
  // Automation actions
  createAutomation: (automation: Omit<Automation, 'id' | 'createdAt' | 'runCount'>) => Promise<Automation>;
  updateAutomation: (id: string, data: Partial<Automation>) => Promise<void>;
  deleteAutomation: (id: string) => Promise<void>;
  runAutomation: (id: string) => Promise<void>;
  
  // Campaign actions
  createCampaign: (campaign: Omit<EmailCampaign, 'id'>) => Promise<EmailCampaign>;
  updateCampaign: (id: string, data: Partial<EmailCampaign>) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  sendCampaign: (id: string) => Promise<void>;
  scheduleCampaign: (id: string, date: Date) => Promise<void>;
}

type CustomerRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  tags: string[] | null;
  notes: string | null;
  total_orders: number;
  total_spent: number;
  last_order_date: string | null;
  join_date: string;
  status: CRMCustomer['status'];
  source: CRMCustomer['source'];
};

type AutomationRow = {
  id: string;
  name: string;
  trigger: Automation['trigger'];
  conditions: Record<string, any>;
  actions: Automation['actions'];
  is_active: boolean;
  created_at: string;
  last_run: string | null;
  run_count: number;
};

type CampaignRow = {
  id: string;
  name: string;
  subject: string;
  content: string;
  recipients: string[] | null;
  status: EmailCampaign['status'];
  scheduled_at: string | null;
  sent_at: string | null;
  open_rate: number | null;
  click_rate: number | null;
};

const rowToCustomer = (row: CustomerRow): CRMCustomer => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone ?? undefined,
  address: row.address ?? undefined,
  city: row.city ?? undefined,
  tags: row.tags ?? [],
  notes: row.notes ?? '',
  totalOrders: row.total_orders,
  totalSpent: Number(row.total_spent),
  lastOrderDate: row.last_order_date ? new Date(row.last_order_date) : undefined,
  joinDate: new Date(row.join_date),
  status: row.status,
  source: row.source,
});

const rowToAutomation = (row: AutomationRow): Automation => ({
  id: row.id,
  name: row.name,
  trigger: row.trigger,
  conditions: row.conditions,
  actions: row.actions,
  isActive: row.is_active,
  createdAt: new Date(row.created_at),
  lastRun: row.last_run ? new Date(row.last_run) : undefined,
  runCount: row.run_count,
});

const rowToCampaign = (row: CampaignRow): EmailCampaign => ({
  id: row.id,
  name: row.name,
  subject: row.subject,
  content: row.content,
  recipients: row.recipients ?? [],
  status: row.status,
  scheduledAt: row.scheduled_at ? new Date(row.scheduled_at) : undefined,
  sentAt: row.sent_at ? new Date(row.sent_at) : undefined,
  openRate: row.open_rate ?? undefined,
  clickRate: row.click_rate ?? undefined,
});

const customerToInsert = (customer: CRMCustomer) => ({
  id: customer.id,
  name: customer.name,
  email: customer.email,
  phone: customer.phone ?? null,
  address: customer.address ?? null,
  city: customer.city ?? null,
  tags: customer.tags,
  notes: customer.notes,
  total_orders: customer.totalOrders,
  total_spent: customer.totalSpent,
  last_order_date: customer.lastOrderDate ? customer.lastOrderDate.toISOString() : null,
  join_date: customer.joinDate.toISOString(),
  status: customer.status,
  source: customer.source,
});

export const useCRMStore = create<CRMState>((set, get) => ({
  customers: [],
  automations: [],
  campaigns: [],
  isLoading: false,
  error: null,

  loadCRMData: async () => {
    if (!isSupabaseConfigured || !supabase) {
      return;
    }
    set({ isLoading: true, error: null });
    const [customersRes, automationsRes, campaignsRes] = await Promise.all([
      supabase.from('crm_customers').select('*').order('join_date', { ascending: false }),
      supabase.from('crm_automations').select('*').order('created_at', { ascending: false }),
      supabase.from('crm_campaigns').select('*').order('created_at', { ascending: false }),
    ]);

    const hasError = customersRes.error || automationsRes.error || campaignsRes.error;
    if (hasError) {
      set({
        isLoading: false,
        error: customersRes.error?.message || automationsRes.error?.message || campaignsRes.error?.message || 'No se pudieron cargar datos del CRM',
      });
      return;
    }

    set({
      customers: (customersRes.data as CustomerRow[]).map(rowToCustomer),
      automations: (automationsRes.data as AutomationRow[]).map(rowToAutomation),
      campaigns: (campaignsRes.data as CampaignRow[]).map(rowToCampaign),
      isLoading: false,
      error: null,
    });
  },

  addCustomer: async (customer) => {
    const newCustomer: CRMCustomer = {
      ...customer,
      id: crypto.randomUUID(),
      joinDate: new Date(),
    };
    set((state) => ({ customers: [newCustomer, ...state.customers] }));

    if (isSupabaseConfigured && supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        set({ error: 'Debes iniciar sesión para guardar clientes en CRM.' });
        return newCustomer;
      }
      const { error } = await supabase.from('crm_customers').insert({
        ...customerToInsert(newCustomer),
        user_id: user.id,
      });
      if (error) {
        set({ error: error.message });
      }
    }
    return newCustomer;
  },

  updateCustomer: async (id, data) => {
    set((state) => ({
      customers: state.customers.map((c) => (c.id === id ? { ...c, ...data } : c)),
    }));

    if (isSupabaseConfigured && supabase) {
      const payload: Record<string, any> = {};
      if (data.name !== undefined) payload.name = data.name;
      if (data.email !== undefined) payload.email = data.email;
      if (data.phone !== undefined) payload.phone = data.phone ?? null;
      if (data.address !== undefined) payload.address = data.address ?? null;
      if (data.city !== undefined) payload.city = data.city ?? null;
      if (data.tags !== undefined) payload.tags = data.tags;
      if (data.notes !== undefined) payload.notes = data.notes;
      if (data.totalOrders !== undefined) payload.total_orders = data.totalOrders;
      if (data.totalSpent !== undefined) payload.total_spent = data.totalSpent;
      if (data.lastOrderDate !== undefined) payload.last_order_date = data.lastOrderDate ? data.lastOrderDate.toISOString() : null;
      if (data.status !== undefined) payload.status = data.status;
      if (data.source !== undefined) payload.source = data.source;
      const { error } = await supabase.from('crm_customers').update(payload).eq('id', id);
      if (error) {
        set({ error: error.message });
      }
    }
  },

  deleteCustomer: async (id) => {
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
    }));
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('crm_customers').delete().eq('id', id);
      if (error) {
        set({ error: error.message });
      }
    }
  },

  getCustomerByEmail: (email) => {
    return get().customers.find((c) => c.email.toLowerCase() === email.toLowerCase());
  },

  syncFromOrder: async (order) => {
    const existing = get().getCustomerByEmail(order.shippingInfo.email);
    if (existing) {
      const nextTotalSpent = existing.totalSpent + order.total;
      await get().updateCustomer(existing.id, {
        totalOrders: existing.totalOrders + 1,
        totalSpent: nextTotalSpent,
        lastOrderDate: new Date(),
        status: nextTotalSpent > 2000 ? 'vip' : 'active',
      });
      return;
    }
    await get().addCustomer({
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

  createAutomation: async (automation) => {
    const newAutomation: Automation = {
      ...automation,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      runCount: 0,
    };
    set((state) => ({ automations: [newAutomation, ...state.automations] }));
    if (isSupabaseConfigured && supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        set({ error: 'Debes iniciar sesión para guardar automatizaciones en CRM.' });
        return newAutomation;
      }
      const { error } = await supabase.from('crm_automations').insert({
        id: newAutomation.id,
        user_id: user.id,
        name: newAutomation.name,
        trigger: newAutomation.trigger,
        conditions: newAutomation.conditions,
        actions: newAutomation.actions,
        is_active: newAutomation.isActive,
        created_at: newAutomation.createdAt.toISOString(),
        last_run: newAutomation.lastRun ? newAutomation.lastRun.toISOString() : null,
        run_count: newAutomation.runCount,
      });
      if (error) {
        set({ error: error.message });
      }
    }
    return newAutomation;
  },

  updateAutomation: async (id, data) => {
    set((state) => ({
      automations: state.automations.map((a) => (a.id === id ? { ...a, ...data } : a)),
    }));
    if (isSupabaseConfigured && supabase) {
      const payload: Record<string, any> = {};
      if (data.name !== undefined) payload.name = data.name;
      if (data.trigger !== undefined) payload.trigger = data.trigger;
      if (data.conditions !== undefined) payload.conditions = data.conditions;
      if (data.actions !== undefined) payload.actions = data.actions;
      if (data.isActive !== undefined) payload.is_active = data.isActive;
      if (data.lastRun !== undefined) payload.last_run = data.lastRun ? data.lastRun.toISOString() : null;
      if (data.runCount !== undefined) payload.run_count = data.runCount;
      const { error } = await supabase.from('crm_automations').update(payload).eq('id', id);
      if (error) {
        set({ error: error.message });
      }
    }
  },

  deleteAutomation: async (id) => {
    set((state) => ({
      automations: state.automations.filter((a) => a.id !== id),
    }));
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('crm_automations').delete().eq('id', id);
      if (error) {
        set({ error: error.message });
      }
    }
  },

  runAutomation: async (id) => {
    const target = get().automations.find((a) => a.id === id);
    if (!target) return;
    await get().updateAutomation(id, {
      lastRun: new Date(),
      runCount: target.runCount + 1,
    });
  },

  createCampaign: async (campaign) => {
    const newCampaign: EmailCampaign = {
      ...campaign,
      id: crypto.randomUUID(),
    };
    set((state) => ({ campaigns: [newCampaign, ...state.campaigns] }));
    if (isSupabaseConfigured && supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        set({ error: 'Debes iniciar sesión para guardar campañas en CRM.' });
        return newCampaign;
      }
      const { error } = await supabase.from('crm_campaigns').insert({
        id: newCampaign.id,
        user_id: user.id,
        name: newCampaign.name,
        subject: newCampaign.subject,
        content: newCampaign.content,
        recipients: newCampaign.recipients,
        status: newCampaign.status,
        scheduled_at: newCampaign.scheduledAt ? newCampaign.scheduledAt.toISOString() : null,
        sent_at: newCampaign.sentAt ? newCampaign.sentAt.toISOString() : null,
        open_rate: newCampaign.openRate ?? null,
        click_rate: newCampaign.clickRate ?? null,
      });
      if (error) {
        set({ error: error.message });
      }
    }
    return newCampaign;
  },

  updateCampaign: async (id, data) => {
    set((state) => ({
      campaigns: state.campaigns.map((c) => (c.id === id ? { ...c, ...data } : c)),
    }));
    if (isSupabaseConfigured && supabase) {
      const payload: Record<string, any> = {};
      if (data.name !== undefined) payload.name = data.name;
      if (data.subject !== undefined) payload.subject = data.subject;
      if (data.content !== undefined) payload.content = data.content;
      if (data.recipients !== undefined) payload.recipients = data.recipients;
      if (data.status !== undefined) payload.status = data.status;
      if (data.scheduledAt !== undefined) payload.scheduled_at = data.scheduledAt ? data.scheduledAt.toISOString() : null;
      if (data.sentAt !== undefined) payload.sent_at = data.sentAt ? data.sentAt.toISOString() : null;
      if (data.openRate !== undefined) payload.open_rate = data.openRate;
      if (data.clickRate !== undefined) payload.click_rate = data.clickRate;
      const { error } = await supabase.from('crm_campaigns').update(payload).eq('id', id);
      if (error) {
        set({ error: error.message });
      }
    }
  },

  deleteCampaign: async (id) => {
    set((state) => ({
      campaigns: state.campaigns.filter((c) => c.id !== id),
    }));
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('crm_campaigns').delete().eq('id', id);
      if (error) {
        set({ error: error.message });
      }
    }
  },

  sendCampaign: async (id) => {
    await get().updateCampaign(id, { status: 'sent', sentAt: new Date() });
  },

  scheduleCampaign: async (id, date) => {
    await get().updateCampaign(id, { status: 'scheduled', scheduledAt: date });
  },
}));
