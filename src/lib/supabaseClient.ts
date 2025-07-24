// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://scryeowxcuckzoucrkql.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjcnllb3d4Y3Vja3pvdWNya3FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxOTg4MTMsImV4cCI6MjA2ODc3NDgxM30.L70l7uDgLMmtetQz2ftazzvECQr0Vt2DH0_d3zT8VqY';

export const supabase = createClient(supabaseUrl, supabaseKey);
