declare module 'react-barcode-reader' {
  import * as React from 'react';
  interface BarcodeReaderProps {
    onScan: (result: string) => void;
    onError?: (error: any) => void;
  }
  const BarcodeReader: React.FC<BarcodeReaderProps>;
  export default BarcodeReader;
}