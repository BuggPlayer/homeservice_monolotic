-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_quotes_service_request_id ON quotes(service_request_id);
CREATE INDEX IF NOT EXISTS idx_quotes_provider_id ON quotes(provider_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_valid_until ON quotes(valid_until);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_quotes_updated_at 
    BEFORE UPDATE ON quotes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
