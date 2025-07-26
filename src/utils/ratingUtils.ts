// src/utils/ratingUtils.ts
import { supabase } from '../lib/supabaseClient';

export async function getAverageRatingByUserId(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('ratings')
    .select('rating')
    .eq('user_id', userId);

  if (error || !data) return 0;

  const ratings = data.map(r => r.rating);
  const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
  return avg;
}
