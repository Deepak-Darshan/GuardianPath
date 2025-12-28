
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kfajpxdxyszsjrzoyiwo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmYWpweGR4eXN6c2pyem95aXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NzAzNDMsImV4cCI6MjA4MjQ0NjM0M30.ocHuNr943VvTjkWZlpTdQO0FxJgJU--gDW0kBGd0OhA';

export const supabase = createClient(supabaseUrl, supabaseKey);
