-- Create service_providers table
CREATE TABLE IF NOT EXISTS service_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    business_license VARCHAR(100),
    services_offered TEXT[] NOT NULL DEFAULT '{}',
    service_areas TEXT[] NOT NULL DEFAULT '{}',
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    total_reviews INTEGER DEFAULT 0,
    years_experience INTEGER DEFAULT 0,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_service_providers_user_id ON service_providers(user_id);
CREATE INDEX IF NOT EXISTS idx_service_providers_verification_status ON service_providers(verification_status);
CREATE INDEX IF NOT EXISTS idx_service_providers_rating ON service_providers(rating);
CREATE INDEX IF NOT EXISTS idx_service_providers_services_offered ON service_providers USING GIN(services_offered);
CREATE INDEX IF NOT EXISTS idx_service_providers_service_areas ON service_providers USING GIN(service_areas);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_service_providers_updated_at 
    BEFORE UPDATE ON service_providers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
