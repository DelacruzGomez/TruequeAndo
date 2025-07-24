import { useEffect } from 'react';
import { supabase } from './lib/supabaseClient';

export default function TestSupabase() {
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('*');
      if (error) {
        console.error('❌ Error al conectar:', error.message);
      } else {
        console.log('✅ Conexión exitosa. Usuarios cargados:', data);
      }
    };

    fetchUsers();
  }, []);

 return (
  <div style={{ padding: '1rem', background: '#eee' }}>
    <p>Supabase está conectado correctamente ✅</p>
  </div>
);
}
