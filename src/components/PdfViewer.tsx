import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error('PDF load error:', error);
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center">
      <div 
        className="border border-gray-200 shadow-lg rounded max-w-full overflow-auto bg-white p-2 select-none"
        onContextMenu={(e) => e.preventDefault()}
      >
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<div className="p-8 text-gray-500">Cargando documento...</div>}
          className="max-w-full pointer-events-none"
        >
          {numPages && (
            <Page 
              pageNumber={pageNumber} 
              renderTextLayer={false} 
              renderAnnotationLayer={false}
              className="max-w-full scale-100 sm:scale-100"
              width={Math.min(window.innerWidth - 64, 800)}
            />
          )}
        </Document>
      </div>

      {numPages && numPages > 1 && (
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
            className="p-2 rounded-full bg-snow border border-gray-200 disabled:opacity-50 hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={24} className="text-burgundy" />
          </button>
          
          <span className="text-gray-700 font-medium">
            Página {pageNumber} de {numPages}
          </span>
          
          <button
            onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
            disabled={pageNumber >= numPages}
            className="p-2 rounded-full bg-snow border border-gray-200 disabled:opacity-50 hover:bg-gray-100 transition-colors"
          >
            <ChevronRight size={24} className="text-burgundy" />
          </button>
        </div>
      )}
    </div>
  );
};
