// Next.jsの設定ファイル
module.exports = {
  // ReactのStrictモードを有効にする
  reactStrictMode: true,
  
  // 環境変数を設定する
  env: {
    // APIのベースURLを環境変数として設定
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8000',
  },

  // 画像の最適化設定
  images: {
    // 許可するドメインを指定
    domains: ['example.com'], // ここに許可するドメインを追加
  },

  // Webpackのカスタマイズ設定
  webpack: (config) => {
    // ここにWebpackのカスタマイズを追加
    return config;
  },
};