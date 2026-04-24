-- Migration: Add referral and rewards system to profiles
-- This script adds the necessary fields for the dual rewards system

-- 1. Add referral and rewards fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS referral_code VARCHAR(10) UNIQUE,
ADD COLUMN IF NOT EXISTS points_balance DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS upline_id UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS total_earnings DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- 2. Create referral_code for existing users if they don't have one
UPDATE profiles 
SET referral_code = UPPER(SUBSTRING(MD5(id || email), 1, 8))
WHERE referral_code IS NULL;

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_profiles_upline_id ON profiles(upline_id);
CREATE INDEX IF NOT EXISTS idx_profiles_points_balance ON profiles(points_balance);

-- 4. Create orders table if it doesn't exist (for tracking purchases and rewards)
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    cashback_amount DECIMAL(10,2) DEFAULT 0.00,
    referral_commission DECIMAL(10,2) DEFAULT 0.00,
    referral_code_used VARCHAR(10) REFERENCES profiles(referral_code),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Create transactions table for tracking rewards
CREATE TABLE IF NOT EXISTS reward_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('cashback', 'referral', 'conversion')),
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 6. Create coupons table for cashback conversions
CREATE TABLE IF NOT EXISTS coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    code VARCHAR(20) UNIQUE NOT NULL,
    discount_amount DECIMAL(10,2) NOT NULL,
    min_purchase_amount DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 7. Create indexes for orders and transactions
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_referral_code ON orders(referral_code_used);
CREATE INDEX IF NOT EXISTS idx_reward_transactions_user_id ON reward_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_reward_transactions_type ON reward_transactions(type);
CREATE INDEX IF NOT EXISTS idx_coupons_user_id ON coupons(user_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- 8. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. Create function to calculate cashback
CREATE OR REPLACE FUNCTION calculate_cashback(order_total DECIMAL) RETURNS DECIMAL AS $$
BEGIN
    RETURN order_total * 0.05; -- 5% cashback
END;
$$ LANGUAGE plpgsql;

-- 11. Create function to calculate referral commission
CREATE OR REPLACE FUNCTION calculate_referral_commission(order_total DECIMAL) RETURNS DECIMAL AS $$
BEGIN
    RETURN order_total * 0.10; -- 10% referral commission
END;
$$ LANGUAGE plpgsql;
