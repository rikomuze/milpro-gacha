# ミリプロ バッジガチャ

ミリプロメンバーの表情差分バッジを集める非公式ファンメイドガチャです。

## 現在の状態
- 11名を登録済み
- 虹深°ぬふ / ゆらぎゆら / 小廻こま を GOLD 対象として登録
- GOLD 排出率は仮で 15%
- ガチャ結果・コレクション・履歴は localStorage 保存
- Canva の完成バッジPNGを差し込める構成
- 現在はバッジ画像未投入のため、名前の頭文字による仮表示

## ファイル
- `index.html` … 画面
- `assets/style.css` … デザイン
- `assets/app.js` … ガチャ・コレクション処理
- `assets/badges.json` … バッジ素材管理用の雛形

## バッジ画像の想定
- PNG / 透過背景
- 1表情 = 1ファイル
- 通常: `assets/badges/normal/<member>/<file>.png`
- GOLD: `assets/badges/gold/<member>/<file>.png`

## GitHub Pages
Settings → Pages → Deploy from a branch → `main` / `/(root)` を選択すると公開できます。

> 非公式ファンメイドです。Million Production / 各タレント・関係者とは関係ありません。
