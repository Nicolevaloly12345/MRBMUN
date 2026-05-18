import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { Download, ArrowLeft, Loader2, ShieldAlert } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function AdminDashboard({ onClose }: { onClose: () => void }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visits, setVisits] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        if (user.email === 'nicole.valbuena@colegiomonterrosales.edu.co' && user.emailVerified) {
          setIsAdmin(true);
          fetchVisits();
        } else {
          setError('Acceso denegado. Solo la administradora puede ver esto.');
          auth.signOut();
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError('Error al iniciar sesión: ' + err.message);
      setLoading(false);
    }
  };

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'visits'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVisits(data);
    } catch (err: any) {
      setError('Error al cargar datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = () => {
    if (visits.length === 0) return;

    const dataToExport = visits.map(v => {
      const createdAt = v.createdAt?.toDate?.() || new Date();
      const lastActivity = v.lastActivityAt?.toDate?.() || new Date();
      return {
        'ID Visitante': v.visitorId,
        'Fecha de Inicio': createdAt.toLocaleString(),
        'Última Actividad': lastActivity.toLocaleString(),
        'Duración (segundos)': v.durationSeconds || 0,
        'Duración (minutos)': ((v.durationSeconds || 0) / 60).toFixed(2)
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Visitas");
    XLSX.writeFile(workbook, "Reporte_Visitas_MRBMUN.xlsx");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-snow flex items-center justify-center">
        <Loader2 className="animate-spin text-burgundy" size={48} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-snow flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100">
          <ShieldAlert className="mx-auto text-red-500 mb-6" size={64} />
          <h2 className="text-2xl font-serif font-bold text-burgundy mb-2">Panel Privado</h2>
          <p className="text-gray-600 mb-8">Esta sección es exclusiva para la dueña de la página.</p>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="w-full bg-burgundy text-white rounded-xl py-3 font-medium hover:bg-burgundy/90 transition-colors"
            >
              Iniciar sesión con Google
            </button>
            <button
              onClick={onClose}
              className="w-full text-gray-500 hover:text-burgundy transition-colors font-medium text-sm"
            >
              Volver a la página principal
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalVisits = visits.length;
  const avgDuration = visits.length > 0 
    ? visits.reduce((acc, v) => acc + (v.durationSeconds || 0), 0) / visits.length 
    : 0;

  return (
    <div className="min-h-screen bg-snow p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={onClose} className="flex items-center text-gray-500 hover:text-burgundy mb-4 transition-colors">
              <ArrowLeft size={16} className="mr-2" /> Volver
            </button>
            <h1 className="text-3xl font-serif font-bold text-burgundy">Panel de Administración</h1>
            <p className="text-gray-600">Hola Nicole, aquí está el reporte de actividad de tu página.</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={downloadExcel}
              className="flex items-center gap-2 bg-gold text-burgundy px-4 py-2 rounded-xl font-bold shadow-md hover:bg-gold/90 transition-colors"
            >
              <Download size={18} /> Exportar Reporte
            </button>
            <button
              onClick={() => auth.signOut()}
              className="px-4 py-2 text-gray-500 hover:text-burgundy font-medium transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-gray-500 font-medium mb-1">Visitas Totales</h3>
            <p className="text-4xl font-bold text-burgundy">{totalVisits}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-gray-500 font-medium mb-1">Tiempo Promedio en la Página</h3>
            <p className="text-4xl font-bold text-burgundy">{(avgDuration / 60).toFixed(1)} <span className="text-xl text-gray-400">minutos</span></p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                  <th className="p-4 font-medium">Visitante</th>
                  <th className="p-4 font-medium">Fecha de Ingreso</th>
                  <th className="p-4 font-medium">Tiempo Transcurrido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visits.map((v) => {
                  const createdAt = v.createdAt?.toDate?.() || new Date();
                  return (
                    <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 text-sm font-mono text-gray-500">
                        {v.visitorId?.substring(0, 8)}...
                      </td>
                      <td className="p-4 text-sm text-gray-800">
                        {createdAt.toLocaleString()}
                      </td>
                      <td className="p-4 text-sm text-gray-800 font-bold">
                        {v.durationSeconds ? Math.floor(v.durationSeconds / 60) : 0} min {v.durationSeconds ? v.durationSeconds % 60 : 0} seg
                      </td>
                    </tr>
                  )
                })}
                {visits.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-500">
                      Aún no hay visitas registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
