# ベースイメージ（Node.js公式）
FROM node:18

# 作業ディレクトリを作成
WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリ全体をコピー
COPY . .

# アプリが使うポートを公開（例：3000番ポート）
EXPOSE 3000

# アプリを起動（必要に応じて修正）
CMD ["npm", "start"]