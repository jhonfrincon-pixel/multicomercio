-- Supabase Trigger Functions for Livo Rewards System
-- These triggers automatically create profiles and assign referral codes when users register

-- 1. Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_unique_referral_code()
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    code_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate 8-character alphanumeric code
        new_code := UPPER(SUBSTRING(MD5(NOW() || RANDOM()), 1, 8));
        
        -- Check if code already exists
        SELECT EXISTS(SELECT 1 FROM public.profiles WHERE referral_code = new_code) INTO code_exists;
        
        -- If code doesn't exist, exit loop
        IF NOT code_exists THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- 2. Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user_registration()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if profile already exists for this user
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
        -- Insert new profile with auto-generated referral code and welcome bonus
        INSERT INTO public.profiles (
            id,
            email,
            full_name,
            referral_code,
            points_balance,
            total_earnings,
            referral_count,
            upline_id,
            created_at,
            updated_at
        ) VALUES (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
            generate_unique_referral_code(),
            10000.00, -- 🎯 $10,000 de bono de bienvenida automático
            0.00,     -- total_earnings starts at 0
            0,        -- referral_count starts at 0
            NULL,     -- upline_id will be set later if referral code is used
            NOW(),
            NOW()
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Function to handle referral code processing during registration
CREATE OR REPLACE FUNCTION process_referral_on_signup()
RETURNS TRIGGER AS $$
DECLARE
    referral_user_id UUID;
    referral_code_used TEXT;
BEGIN
    -- Extract referral code from user metadata if present
    referral_code_used := NEW.raw_user_meta_data->>'referral_code';
    
    -- If referral code was provided, process it
    IF referral_code_used IS NOT NULL AND referral_code_used != '' THEN
        -- Find the user who owns this referral code
        SELECT id INTO referral_user_id 
        FROM public.profiles 
        WHERE referral_code = UPPER(referral_code_used);
        
        -- If valid referral code found, update the new user's upline
        IF referral_user_id IS NOT NULL THEN
            UPDATE public.profiles 
            SET upline_id = referral_user_id 
            WHERE id = NEW.id;
            
            -- Optional: Log the referral for tracking
            INSERT INTO public.referral_logs (
                referrer_id,
                referred_id,
                referral_code,
                created_at
            ) VALUES (
                referral_user_id,
                NEW.id,
                referral_code_used,
                NOW()
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create the trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user_registration();

-- 5. Create the trigger for referral processing (runs after profile creation)
DROP TRIGGER IF EXISTS process_referral_trigger ON public.profiles;
CREATE TRIGGER process_referral_trigger
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION process_referral_on_signup();

-- 6. Create referral_logs table for tracking
CREATE TABLE IF NOT EXISTS public.referral_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    referred_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    referral_code VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. Create indexes for referral_logs
CREATE INDEX IF NOT EXISTS idx_referral_logs_referrer_id ON public.referral_logs(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_logs_referred_id ON public.referral_logs(referred_id);
CREATE INDEX IF NOT EXISTS idx_referral_logs_code ON public.referral_logs(referral_code);

-- 8. Create trigger for updated_at on referral_logs
CREATE TRIGGER update_referral_logs_updated_at BEFORE UPDATE ON public.referral_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Function to increment referral count when referral makes first purchase
CREATE OR REPLACE FUNCTION increment_referral_count_on_first_purchase()
RETURNS TRIGGER AS $$
BEGIN
    -- Update referrer's referral count if this is the first purchase
    UPDATE public.profiles 
    SET 
        referral_count = referral_count + 1,
        updated_at = NOW()
    WHERE id = (
        SELECT upline_id 
        FROM public.profiles 
        WHERE id = NEW.user_id
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Create trigger for first purchase referral counting
DROP TRIGGER IF EXISTS increment_referral_on_purchase ON public.orders;
CREATE TRIGGER increment_referral_on_purchase
    AFTER INSERT ON public.orders
    FOR EACH ROW
    WHEN (NEW.status = 'delivered' AND NEW.referral_code_used IS NOT NULL)
    EXECUTE FUNCTION increment_referral_count_on_first_purchase();

-- 11. Function to validate referral code
CREATE OR REPLACE FUNCTION validate_referral_code(code TEXT)
RETURNS TABLE(
    is_valid BOOLEAN,
    referrer_id UUID,
    referrer_email TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TRUE as is_valid,
        p.id as referrer_id,
        p.email as referrer_email
    FROM public.profiles p
    WHERE p.referral_code = UPPER(code)
    LIMIT 1;
    
    -- If no rows returned, the function will return empty result set
    -- indicating invalid referral code
END;
$$ LANGUAGE plpgsql;

-- 12. Grant necessary permissions
GRANT EXECUTE ON FUNCTION generate_unique_referral_code() TO authenticated;
GRANT EXECUTE ON FUNCTION handle_new_user_registration() TO authenticated;
GRANT EXECUTE ON FUNCTION process_referral_on_signup() TO authenticated;
GRANT EXECUTE ON FUNCTION validate_referral_code(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_referral_count_on_first_purchase() TO authenticated;

-- 13. Enable RLS (Row Level Security) on new tables
ALTER TABLE public.referral_logs ENABLE ROW LEVEL SECURITY;

-- 14. Create RLS policies for referral_logs
CREATE POLICY "Users can view their own referrals" ON public.referral_logs
    FOR SELECT USING (referrer_id = auth.uid() OR referred_id = auth.uid());

CREATE POLICY "System can insert referral logs" ON public.referral_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update referral logs" ON public.referral_logs
    FOR UPDATE USING (true);
