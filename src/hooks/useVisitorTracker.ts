import { useEffect, useRef } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export function useVisitorTracker() {
  const isTracking = useRef(false);

  useEffect(() => {
    if (isTracking.current) return;
    isTracking.current = true;

    const trackVisit = async () => {
      try {
        let visitorId = localStorage.getItem('mrbmun_visitor_id');
        let visitDocId = localStorage.getItem('mrbmun_visit_doc_id');

        if (!visitorId) {
          visitorId = uuidv4();
          localStorage.setItem('mrbmun_visitor_id', visitorId);
        }

        if (!visitDocId) {
          visitDocId = uuidv4();
          localStorage.setItem('mrbmun_visit_doc_id', visitDocId);
          await setDoc(doc(db, 'visits', visitDocId), {
            visitorId,
            createdAt: serverTimestamp(),
            lastActivityAt: serverTimestamp(),
            durationSeconds: 0
          });
        }
        
        // Setup ping every 30 seconds
        const pingInterval = setInterval(async () => {
          if (!visitDocId || !visitorId) return;
          try {
             const docRef = doc(db, 'visits', visitDocId);
             const docSnap = await getDoc(docRef);
             if (docSnap.exists()) {
                 const data = docSnap.data();
                 const createdAt = data.createdAt?.toDate?.() || new Date();
                 const durationSeconds = Math.floor((new Date().getTime() - createdAt.getTime()) / 1000);
                 await updateDoc(docRef, {
                   lastActivityAt: serverTimestamp(),
                   durationSeconds
                 });
             }
          } catch(e) {
             // Silently fail pings to avoid console spam for users
          }
        }, 30000);

        // Also ping on visibility change or beforeunload
        const handleBeforeUnload = async () => {
          if (!visitDocId || !visitorId) return;
          try {
             // Synchronous fallback (though fetch/updateDoc is async, firestore tries to flush)
             const docRef = doc(db, 'visits', visitDocId);
             updateDoc(docRef, {
               lastActivityAt: serverTimestamp()
             });
          } catch(e) {}
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
          clearInterval(pingInterval);
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };

      } catch (error) {
         console.log("Visit tracking failed:", error);
      }
    };

    trackVisit();
  }, []);
}
