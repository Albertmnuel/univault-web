import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ivdwtuwlymnuszypekox.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2ZHd0dXdseW1udXN6eXBla294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5MzI5NzAsImV4cCI6MjEwNTUwODk3MH0.y3-12CnbQGaPaZJmZCI2TPCVlXUi1DebEGm2sICyYZk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);