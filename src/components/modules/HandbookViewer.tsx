import React, { useState } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, FileText } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function HandbookViewer() {
  const pdfUrl = "/HANDBOOK.pdf";
  
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="h-[calc(100vh-180px)] w-full flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex justify-between items-center p-3 border-b border-gray-100 bg-gray-50 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setPageNumber(p => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
            className="p-1 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium text-gray-700">
            Página {pageNumber} de {numPages || '?'}
          </span>
          <button 
            onClick={() => setPageNumber(p => Math.min(numPages || p, p + 1))}
            disabled={pageNumber >= (numPages || 1)}
            className="p-1 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
          
          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          
          <button 
            onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
            className="p-1 rounded-md hover:bg-gray-200"
          >
            <ZoomOut size={20} />
          </button>
          <span className="text-sm text-gray-700 w-12 text-center">{Math.round(scale * 100)}%</span>
          <button 
            onClick={() => setScale(s => Math.min(3.0, s + 0.1))}
            className="p-1 rounded-md hover:bg-gray-200"
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
              Cargando documento...
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
  );
}
