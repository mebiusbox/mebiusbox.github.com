# SNSボタン

右上に表示される SNSボタンは `sharing` プラグインです．これは標準で有効になっています．

![](/images/1575612027.png)

非表示にしたい場合はプラグインを無効にします．

```json
{
    "plugins": ["-sharing"]
}
```

また，個別に指定したい場合は次のようになります．

```json
{
    "pluginsConfig": {
        "sharing": [
        "facebook": true,
        "twitter": true,
        "google": false,
        "weibo": false,
        "instapaper": false,
        "vk": false,
        "all": [
            "facebook", "google", "twitter", "weibo", "instapaper"
        ]
    }
}
```

