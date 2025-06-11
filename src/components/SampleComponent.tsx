import React from 'react'; // Reactライブラリをインポート

// SampleComponentという関数コンポーネントを定義
const SampleComponent: React.FC = () => {
    // 商品情報を格納するための状態を定義
    const [products, setProducts] = React.useState([]); 

    // コンポーネントがマウントされたときに商品情報を取得するための副作用を設定
    React.useEffect(() => {
        // 商品情報を取得する非同期関数を定義
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products'); // APIエンドポイントから商品情報を取得
                const data = await response.json(); // レスポンスをJSON形式に変換
                setProducts(data); // 取得した商品情報を状態に設定
            } catch (error) {
                console.error('Error fetching products:', error); // エラーハンドリング
            }
        };

        fetchProducts(); // 非同期関数を呼び出す
    }, []); // 空の依存配列を指定して、コンポーネントの初回マウント時のみ実行

    // コンポーネントのレンダリング部分
    return (
        <div>
            <h1>商品リスト</h1> {/* 商品リストの見出し */}
            <ul>
                {products.map((product) => (
                    <li key={product.id}>{product.name}</li> // 商品名をリスト表示
                ))}
            </ul>
        </div>
    );
};

// SampleComponentをエクスポート
export default SampleComponent;