import { supabase } from '../lib/supabase.js';
import { cors, authCheck } from '../lib/validate.js';

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors() };
  }

  if (!authCheck(event)) {
    return { statusCode: 401, headers: cors(), body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .order('name');

  if (error) {
    return { statusCode: 500, headers: cors(), body: JSON.stringify({ error: error.message }) };
  }

  return {
    statusCode: 200,
    headers: cors(),
    body: JSON.stringify(data),
  };
}
