
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jvvyflqnssqqwjraaisf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2dnlmbHFuc3NxcXdqcmFhaXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwMzk0MjksImV4cCI6MjA2NDYxNTQyOX0.0oneFH_rxMAenQ96USYs1WOloxTwobGIG0KgJu436Io'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
