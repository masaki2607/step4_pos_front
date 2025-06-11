# フロントエンドに関するドキュメント
# プロジェクトの概要やセットアップ手順を記載する

# プロジェクト名
# My Next.js and FastAPI with MySQL Application

## 概要
このプロジェクトは、Next.jsを使用したフロントエンドとFastAPIを使用したバックエンドを組み合わせたアプリケーションです。MySQLデータベースに接続し、データの取得や操作を行います。

## セットアップ手順

### 1. フロントエンドのセットアップ
- フロントエンドディレクトリに移動します。
  ```
  cd frontend
  ```

- 必要な依存関係をインストールします。
  ```
  npm install
  ```

- 開発サーバーを起動します。
  ```
  npm run dev
  ```

### 2. バックエンドのセットアップ
- バックエンドディレクトリに移動します。
  ```
  cd ../backend
  ```

- 必要な依存関係をインストールします。
  ```
  pip install -r requirements.txt
  ```

- FastAPIアプリケーションを起動します。
  ```
  uvicorn app.main:app --reload
  ```

## 使用技術
- **フロントエンド**: Next.js, TypeScript
- **バックエンド**: FastAPI, SQLAlchemy
- **データベース**: MySQL

## 注意事項
- MySQLデータベースの設定が必要です。`backend/app/database.py`で接続情報を設定してください。
- APIエンドポイントは`backend/app/main.py`で定義されています。フロントエンドからのリクエストに応じてデータを取得します。

## ライセンス
このプロジェクトはMITライセンスの下で公開されています。