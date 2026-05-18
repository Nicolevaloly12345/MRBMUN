import React, { useState } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// Ensure the worker is set up
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function AgendaViewer() {
  const pdfUrl = "/Jornada 2026 Mun 2026.pdf";
  
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col h-[calc(100vh-120px)]">
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-burgundy mb-2">Agenda (Jornada 2026)</h2>
        <p className="text-gray-600">Revisa la agenda oficial del evento y mantente al tanto de todas las actividades programadas.</p>
      </div>

      <div className="flex-1 w-full bg-snow rounded-xl border border-gray-200 overflow-hidden flex flex-col relative">
        <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-white flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPageNumber(p => Math.max(1, p - 1))}
              disabled={pageNumber <= 1}
              className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium text-gray-700">
              Página {pageNumber} de {numPages || '?'}
            </span>
            <button 
              onClick={() => setPageNumber(p => Math.min(numPages || p, p + 1))}
              disabled={pageNumber >= (numPages || 1)}
              className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
            
            <div className="h-6 w-px bg-gray-300 mx-2"></div>
            
            <button 
              onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <ZoomOut size={20} />
            </button>
            <span className="text-sm text-gray-700 w-12 text-center">{Math.round(scale * 100)}%</span>
            <button 
              onClick={() => setScale(s => Math.min(3.0, s + 0.1))}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <ZoomIn size={20} />
            </button>
          </div>
        </div>
        
        <div 
          className="flex-1 w-full relative bg-gray-100 overflow-auto flex justify-center p-4 select-none"
          onContextMenu={(e) => e.preventDefault()}
        >
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            className="max-w-full flex-col items-center pointer-events-none"
            loading={
              <div className="flex justify-center items-center h-64 text-gray-500">
                Cargando agenda...
              </div>
            }
            error={
              <div className="flex justify-center items-center h-64 text-red-500 text-center px-4">
                Error al cargar el PDF.
              </div>
            }
          >
            <Page 
              pageNumber={pageNumber} 
              scale={scale} 
              className="shadow-md bg-white mb-4"
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>
      </div>
    </div>
  );
}
