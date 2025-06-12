import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { BrowserMultiFormatReader } from '@zxing/browser';

type Product = {
  name: string;
  code: string;
  price: number;
};

const TAX_RATE = 0.1;


const BarcodeScanner = ({
  onDetected,
  onClose,
}: {
  onDetected: (code: string) => void;
  onClose: () => void;
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [scanning, setScanning] = useState(true);

  React.useEffect(() => {
    if (!scanning) return;
    const codeReader = new BrowserMultiFormatReader();
    let stopped = false;
  
    const scan = async () => {
      if (!webcamRef.current) return;
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const img = new window.Image();
        img.src = imageSrc;
        img.onload = async () => {
          try {
            const result = await codeReader.decodeFromImageElement(img);
            if (result && !stopped) {
              onDetected(result.getText());
              setScanning(false);
              stopped = true;
              onClose();
            }
          } catch (e) {
            console.error('バーコード認識エラー:', e);
          }
        };
      }
      if (!stopped) setTimeout(scan, 500);
    };

    scan();

    return () => {
      stopped = true;
    };
  }, [onDetected, scanning, onClose]);

  const videoStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 400,
    height: 'auto',
    borderRadius: 8,
    margin: '0 auto',
    display: 'block',
  };

  return (
    <div style={{ textAlign: 'center', padding: 8 }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/png"
        style={videoStyle}
        videoConstraints={{
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }}
      />
      <button style={{ marginTop: 12, padding: '12px 24px', fontSize: 18 }} onClick={onClose}>キャンセル</button>
    </div>
  );
};

const HomePage = () => {
      const [scanning, setScanning] = useState(false);
      const [barcode, setBarcode] = useState('');
      const [manualBarcode, setManualBarcode] = useState(''); // 手動入力用
      const [product, setProduct] = useState<Product | null>(null);
      const [cart, setCart] = useState<Product[]>([]);
      const [showResult, setShowResult] = useState(false);
  
  // バーコード読取時
  const handleScan = async (barcode: string) => {
    setBarcode(barcode);
    setScanning(false);

    try {
      // バックエンドAPIに直接リクエスト
      const res = await fetch(`https://app-step4-59.azurewebsites.net/${barcode}`);
      if (!res.ok) {
        alert('商品が見つかりません');
        setProduct(null);
        return;
      }
      const data = await res.json();
      if (!data || !data.name) {
        alert('商品データが空です');
        setProduct(null);
        return;
      }
      setProduct(data);
    } catch (e) {
      alert('商品情報の取得に失敗しました');
      setProduct(null);
      console.error(e);
    }
  };

    // 手動入力で検索
  const handleManualSearch = () => {
    if (manualBarcode.trim() !== '') {
      handleScan(manualBarcode.trim());
    }
  };


  // 商品追加
  const handleAdd = () => {
    if (product) {
      setCart([...cart, product]);
      setProduct(null);
      setBarcode('');
    }
  };

  // 購入処理
  const handlePurchase = async () => {
  await fetch('https://app-step4-59.azurewebsites.net/', {
    method: 'POST',
    body: JSON.stringify({
      EMP_CD: "A001", // 従業員コード（適宜入力や選択に変更可）
      STORE_CD: "S01", // 店舗コード
      POS_NO: "P01",   // POS番号
      TOTAL_AMT: totalWithTax, // 合計金額（税込）
      TTL_AMT_EX_TAX: total    // 税抜金額
      // DATETIMEは省略可（サーバー側で自動設定）
    }),
    headers: { 'Content-Type': 'application/json' },
  });
  setShowResult(true);
};

  const total = cart.reduce((sum, p) => sum + p.price, 0);
  const tax = Math.round(total * TAX_RATE);
  const totalWithTax = total + tax;

  const containerStyle: React.CSSProperties = {
    maxWidth: 480,
    margin: '0 auto',
    padding: 12,
    fontSize: 18,
  };

  const buttonStyle: React.CSSProperties = {
    padding: '12px 24px',
    fontSize: 18,
    margin: '8px 0',
    width: '100%',
    borderRadius: 8,
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: 28, textAlign: 'center' }}>POS Demo</h1>
      <button style={buttonStyle} onClick={() => setScanning(true)}>スキャン（カメラ）</button>
       {/* 手動入力フォーム */}
      <div style={{ margin: '16px 0', textAlign: 'center' }}>
        <input
          type="text"
          value={manualBarcode}
          onChange={e => setManualBarcode(e.target.value)}
          placeholder="バーコード番号を入力"
          style={{ fontSize: 18, padding: 8, width: 200, marginRight: 8 }}
        />
        <button style={buttonStyle} onClick={handleManualSearch}>検索</button>
      </div>
      {scanning && (
        <BarcodeScanner
          onDetected={handleScan}
          onClose={() => setScanning(false)}
        />
      )}
      {product && (
        <div style={{ margin: '16px 0', padding: 12, background: '#f5f5f5', borderRadius: 8 }}>
          <div>名称: {product.name}</div>
          <div>コード: {product.code}</div>
          <div>単価: {product.price}円</div>
          <button style={buttonStyle} onClick={handleAdd}>追加</button>
        </div>
      )}
      <h2 style={{ fontSize: 22 }}>購入リスト</h2>
      <ul style={{ padding: 0, listStyle: 'none' }}>
        {cart.map((item, idx) => (
          <li key={idx} style={{ marginBottom: 8, borderBottom: '1px solid #ddd', paddingBottom: 4 }}>
            {item.name} ({item.code}) - {item.price}円
          </li>
        ))}
      </ul>
      <button style={buttonStyle} onClick={handlePurchase} disabled={cart.length === 0}>
        購入
      </button>
      {showResult && (
        <div style={{ background: '#fffbe6', borderRadius: 8, padding: 16, marginTop: 16, textAlign: 'center' }}>
          <p style={{ fontSize: 20 }}>合計（税込）: {totalWithTax}円</p>
          <p style={{ fontSize: 18 }}>税抜: {total}円</p>
           <button
            style={buttonStyle}
            onClick={() => {
              setShowResult(false);
              setCart([]); // ← 追加：購入リストを初期化
            }}
           >
           OK
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;