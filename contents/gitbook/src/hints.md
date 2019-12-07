# 警告などのメッセージ

`hints` プラグインを使います．

```json
{
    "plugins": ["hints"]
}
```

`info`, `tip`, `danger`, `working` の４種類があります．使い方は次のようになります．

{% raw %}
```
{% hint style='info' %}
info: this is a information
{% endhint %}

{% hint style='tip' %}
tip: this is a tip
{% endhint %}

{% hint style='danger' %}
danger: this is a danger message
{% endhint %}

{% hint style='working' %}
working: this is working
{% endhint %}
```
{% endraw %}

{% hint style='info' %}
info: this is a information
{% endhint %}

{% hint style='tip' %}
tip: this is a tip
{% endhint %}

{% hint style='danger' %}
danger: this is a danger message
{% endhint %}

{% hint style='working' %}
working: this is working
{% endhint %}
