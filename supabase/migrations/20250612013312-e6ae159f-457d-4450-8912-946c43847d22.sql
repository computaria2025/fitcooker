
-- Enable RLS on seguidores table
ALTER TABLE public.seguidores ENABLE ROW LEVEL SECURITY;

-- Create policies for seguidores table
CREATE POLICY "Users can view followers/following relationships" 
ON public.seguidores 
FOR SELECT 
USING (true);

CREATE POLICY "Users can follow others" 
ON public.seguidores 
FOR INSERT 
WITH CHECK (auth.uid() = seguidor_id);

CREATE POLICY "Users can unfollow others" 
ON public.seguidores 
FOR DELETE 
USING (auth.uid() = seguidor_id);

-- Create trigger to update followers count
CREATE OR REPLACE FUNCTION update_followers_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment follower count for the followed user
    UPDATE public.profiles 
    SET seguidores_count = seguidores_count + 1
    WHERE id = NEW.seguido_id;
    
    -- Increment following count for the follower
    UPDATE public.profiles 
    SET seguindo_count = seguindo_count + 1
    WHERE id = NEW.seguidor_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement follower count for the unfollowed user
    UPDATE public.profiles 
    SET seguidores_count = GREATEST(0, seguidores_count - 1)
    WHERE id = OLD.seguido_id;
    
    -- Decrement following count for the unfollower
    UPDATE public.profiles 
    SET seguindo_count = GREATEST(0, seguindo_count - 1)
    WHERE id = OLD.seguidor_id;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS followers_count_trigger ON public.seguidores;
CREATE TRIGGER followers_count_trigger
  AFTER INSERT OR DELETE ON public.seguidores
  FOR EACH ROW EXECUTE FUNCTION update_followers_count();

-- Function to check if user is following another user
CREATE OR REPLACE FUNCTION public.is_following(follower_id uuid, followed_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.seguidores 
    WHERE seguidor_id = follower_id AND seguido_id = followed_id
  )
$$;
