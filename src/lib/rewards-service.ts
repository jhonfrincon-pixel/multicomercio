import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  referral_code: string;
  points_balance: number;
  total_earnings: number;
  referral_count: number;
  upline_id?: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  cashback_amount: number;
  referral_commission: number;
  referral_code_used?: string;
  created_at: string;
}

export interface RewardTransaction {
  id: string;
  user_id: string;
  order_id: string;
  type: 'cashback' | 'referral' | 'conversion';
  amount: number;
  description: string;
  created_at: string;
}

export interface Coupon {
  id: string;
  user_id: string;
  code: string;
  discount_amount: number;
  min_purchase_amount: number;
  status: 'active' | 'used' | 'expired';
  expires_at: string;
  created_at: string;
}

export class RewardsService {
  // Generate unique referral code
  static generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // Get user profile with referral data
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // Create or update user profile with referral code
  static async createOrUpdateProfile(userId: string, email: string, fullName: string, referralCode?: string): Promise<UserProfile | null> {
    try {
      // Check if user exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      let uplineId = null;
      
      // If referral code provided, find the referrer
      if (referralCode && !existingProfile) {
        const { data: referrer } = await supabase
          .from('profiles')
          .select('id')
          .eq('referral_code', referralCode)
          .single();
        
        if (referrer) {
          uplineId = referrer.id;
        }
      }

      const profileData = {
        id: userId,
        email,
        full_name: fullName,
        referral_code: existingProfile?.referral_code || this.generateReferralCode(),
        upline_id: uplineId,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .upsert(profileData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating/updating profile:', error);
      return null;
    }
  }

  // Create order and calculate rewards
  static async createOrder(userId: string, totalAmount: number, referralCode?: string): Promise<Order | null> {
    try {
      const cashbackAmount = totalAmount * 0.05; // 5% cashback
      
      let referralCommission = 0;
      let referralCodeUsed = null;

      // Check if referral code is valid
      if (referralCode) {
        const { data: referrer } = await supabase
          .from('profiles')
          .select('id')
          .eq('referral_code', referralCode)
          .single();

        if (referrer && referrer.id !== userId) {
          referralCommission = totalAmount * 0.10; // 10% referral commission
          referralCodeUsed = referralCode;
        }
      }

      const orderData = {
        user_id: userId,
        total_amount: totalAmount,
        cashback_amount: cashbackAmount,
        referral_commission: referralCommission,
        referral_code_used: referralCodeUsed,
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  }

  // Process order delivery and award rewards
  static async processOrderDelivery(orderId: string): Promise<boolean> {
    try {
      // Get order details
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError || !order) throw new Error('Order not found');

      // Update order status
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'delivered' })
        .eq('id', orderId);

      if (updateError) throw updateError;

      // Award cashback to customer
      if (order.cashback_amount > 0) {
        await this.addCashback(order.user_id, order.id, order.cashback_amount);
      }

      // Award referral commission
      if (order.referral_commission > 0 && order.referral_code_used) {
        await this.addReferralCommission(order.referral_code_used, order.id, order.referral_commission);
      }

      return true;
    } catch (error) {
      console.error('Error processing order delivery:', error);
      return false;
    }
  }

  // Add cashback to user balance
  private static async addCashback(userId: string, orderId: string, amount: number): Promise<void> {
    try {
      // Update user balance
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ 
          points_balance: supabase.rpc('increment_balance', { user_id: userId, amount }),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (balanceError) throw balanceError;

      // Record transaction
      const { error: transactionError } = await supabase
        .from('reward_transactions')
        .insert({
          user_id: userId,
          order_id: orderId,
          type: 'cashback',
          amount: amount,
          description: `Cashback de 5% por compra`
        });

      if (transactionError) throw transactionError;
    } catch (error) {
      console.error('Error adding cashback:', error);
    }
  }

  // Add referral commission
  private static async addReferralCommission(referralCode: string, orderId: string, amount: number): Promise<void> {
    try {
      // Get referrer profile
      const { data: referrer, error: referrerError } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', referralCode)
        .single();

      if (referrerError || !referrer) return;

      // Update referrer earnings
      const { error: earningsError } = await supabase
        .from('profiles')
        .update({ 
          total_earnings: supabase.rpc('increment_earnings', { user_id: referrer.id, amount }),
          referral_count: supabase.rpc('increment_referral_count', { user_id: referrer.id }),
          updated_at: new Date().toISOString()
        })
        .eq('id', referrer.id);

      if (earningsError) throw earningsError;

      // Record transaction
      const { error: transactionError } = await supabase
        .from('reward_transactions')
        .insert({
          user_id: referrer.id,
          order_id: orderId,
          type: 'referral',
          amount: amount,
          description: `Comisión de 10% por referido`
        });

      if (transactionError) throw transactionError;
    } catch (error) {
      console.error('Error adding referral commission:', error);
    }
  }

  // Convert points to coupon
  static async convertPointsToCoupon(userId: string, pointsAmount: number): Promise<Coupon | null> {
    try {
      // Check if user has enough points
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('points_balance')
        .eq('id', userId)
        .single();

      if (profileError || !profile || profile.points_balance < pointsAmount) {
        throw new Error('Insufficient points');
      }

      // Generate coupon code
      const couponCode = 'LIVO' + Math.random().toString(36).substr(2, 9).toUpperCase();
      
      // Calculate discount (1 point = 1 COP)
      const discountAmount = pointsAmount;

      // Create coupon
      const couponData = {
        user_id: userId,
        code: couponCode,
        discount_amount: discountAmount,
        min_purchase_amount: 50000, // Minimum purchase of 50k
        status: 'active',
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      };

      const { data: coupon, error: couponError } = await supabase
        .from('coupons')
        .insert(couponData)
        .select()
        .single();

      if (couponError) throw couponError;

      // Deduct points from user balance
      const { error: deductError } = await supabase
        .from('profiles')
        .update({ 
          points_balance: profile.points_balance - pointsAmount,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (deductError) throw deductError;

      // Record conversion transaction
      const { error: transactionError } = await supabase
        .from('reward_transactions')
        .insert({
          user_id: userId,
          type: 'conversion',
          amount: -pointsAmount,
          description: `Conversión de ${pointsAmount} puntos a cupón ${couponCode}`
        });

      if (transactionError) throw transactionError;

      return coupon;
    } catch (error) {
      console.error('Error converting points to coupon:', error);
      return null;
    }
  }

  // Get user orders
  static async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting user orders:', error);
      return [];
    }
  }

  // Get user reward transactions
  static async getUserTransactions(userId: string): Promise<RewardTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('reward_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting user transactions:', error);
      return [];
    }
  }

  // Get user coupons
  static async getUserCoupons(userId: string): Promise<Coupon[]> {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting user coupons:', error);
      return [];
    }
  }

  // Get referral stats
  static async getReferralStats(userId: string): Promise<{
    total_referrals: number;
    active_referrals: number;
    total_earnings: number;
    pending_earnings: number;
  }> {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('referral_count, total_earnings')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        return {
          total_referrals: 0,
          active_referrals: 0,
          total_earnings: 0,
          pending_earnings: 0
        };
      }

      // Get active referrals (those who have made purchases)
      const { data: referrals, error: referralsError } = await supabase
        .from('profiles')
        .select('id')
        .eq('upline_id', userId);

      if (referralsError) throw referralsError;

      const referralIds = referrals?.map(r => r.id) || [];
      
      let activeReferrals = 0;
      if (referralIds.length > 0) {
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('user_id')
          .in('user_id', referralIds)
          .eq('status', 'delivered');

        if (!ordersError && orders) {
          activeReferrals = new Set(orders.map(o => o.user_id)).size;
        }
      }

      return {
        total_referrals: profile.referral_count || 0,
        active_referrals,
        total_earnings: profile.total_earnings || 0,
        pending_earnings: 0 // Calculate based on pending orders if needed
      };
    } catch (error) {
      console.error('Error getting referral stats:', error);
      return {
        total_referrals: 0,
        active_referrals: 0,
        total_earnings: 0,
        pending_earnings: 0
      };
    }
  }
}
