# React + TypeScript + Vite

# 部屋の予約システム

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## 概要

研究室の自由部屋（F601、F602、F612 の 3 部屋）の予約可視化システムです。Google Apps Script、Typescript、React を組み合わせて作成し、Google Calendar の登録情報をデータベースとして活用しています。システムは現状の部屋の状況（空室/使用中/使用不可）や今後 1 週間の予約を表示します。

Currently, two official plugins are available:

## 部屋の状況と使い方

予約をしたい場合は、各部屋の Google Calendar から予約を行なってください。使用状況は、予約の時間帯になると原則的に「使用不可」になりますが、予約の説明文に「入室可能」の文字を含めると、使用状況が「使用中」に変わります。

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## 情報の流れ

### 1. 1 週間の予約の取得

- Google Calendar から、更新日時から 1 週間の予約内容を取得
- 取得した予約内容を Google Spreadsheet に書き込み
- Google Spreadsheet から 1 週間の予約を取得

## Expanding the ESLint configuration

### 2. 今日の次の予約や現在の使用状況の取得

- 今日の次の予定：次の予約が今日の日付であれば、今日の次の予定として表示
- 現在の使用状況：現在の時間に予定があるかを確認し、予定がある場合は「使用不可」または「使用中」のどちらかを表示

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

### 3. 表示

- All Room：すべての部屋の現在の使用状況と、今日の次の予定を表示
- 各部屋の Dashboard：各部屋の現在の使用状況と今後 1 週間の予定を表示
