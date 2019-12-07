# プラグイン

GitBook はプラグインを導入してカスタマイズすることができます．空のプロジェクトを作成した時点でいくつかのプラグインが自動で有効になります．

- livereload
- highlight
- search
- lunr
- sharing
- fontsettings
- theme-default

プラグインの追加は `plugins` で設定します．

```json
{
    "plugins": [...]
}
```

また，プラグインの設定は `pluginsConfig` で設定します．

```json
{
    "plugins": [...],
    "pluginsConfig": {...}
}
```

`plugins` に追加したプラグインは `gitbook install` でインストールします．

```
gitbook install
```

様々なプラグインがありますので，個人的にオススメなものをピックアップしていきます．