---
title: WindowsでTensorflow(GPU)を使う
description: WindowsでWSLとDocker Desktopを使ってTensorflowがGPUを使うようにする方法
keywords:
  - WSL
  - Ubuntu
  - Docker
  - Docker Desktop
  - Tensorflow
  - Python
  - Jupyter Notebook
  - uv
category: note
authors: [mebiusbox]
tags: [wsl,ubuntu,docker,tensorflow,python,jupyter]
image: https://og-image-mebiusbox.vercel.app/api/og?title=Windows%e3%81%a7Tensorflow(GPU)%e3%82%92%e4%bd%bf%e3%81%86&subtitle=Windows%e3%81%a7WSL%e3%81%a8Docker+Desktop%e3%82%92%e4%bd%bf%e3%81%a3%e3%81%a6Tensorflow%e3%81%8cGPU%e3%82%92%e4%bd%bf%e3%81%86%e3%82%88%e3%81%86%e3%81%ab%e3%81%99%e3%82%8b%e6%96%b9%e6%b3%95&date=2024%2F09%2F20&tags=wsl,ubuntu,docker,tensorflow,python,jupyter
---

WindowsでTensorflowがGPUを使えるようにするための方法をここに記録しておきます．
また、それに関係するWSLやDocker Desktopについてもまとめておきます．

<!-- truncate -->

試した環境はWindowsでpythonの仮想環境を構築して、Visual Studio CodeのJupyter拡張機能を使っています．

## tensorflow-intel

Tensorflowを使う機会があったので、普通に Tensorflow を `uv add tensorflow` でインストールしてみました．
とりあえず、インストールはできたみたいなのですが、Jupyter Notebook からインポートしてもモジュールが見つかりませんとエラーになります．
まずは`uv pip list`を実行してインストールされていることを確認しました．
あとはネットで検索したりして同様な症状が発生しているときの対処方法を試してみても変わらず．
そこで、`uv pip show tensorflow` としたところ次のように表示されました．

```powershell
Name: tensorflow
Version: 2.17.0
Location: F:\src\jupyter\.venv\Lib\site-packages
Requires: tensorflow-intel
Required-by:
```

どうやら`tensorflow-intel`が必要みたいです．確認してみるとインストールされていませんでした．
uvでは依存解決できなかったらしく、直接指定してインストールすることで Jupyter Notebookからでもモジュールが見つかるようになりました．

## tensorflow (GPU対応)

`tensorflow-intel`が必要だったので、GPUの対応はどうなっているのか気になりました．
そこで調べてみると、最近のWindows用 tensorflow はGPUに対応していないみたいです．
どうやらWSL2を使えばいいらしいので、試してみることにしました．また、Dockerイメージも用意されているみたいなので、それも使うことにします．

## WSL2 + Docker Desktop

WSLは環境構築済みで、Ubuntu (`22.04.5 LTS`) を使っています．
Docker Desktopは最新のものをインストールしています．

あまり両者とも使っていなかったので、整理することにしました．
Ubuntuは再インストールして最低限の設定をしておきました．
問題は Docker Desktop です．イメージが肥大化していくので大容量HDDに移動しておこうと思います．

色々調べてみると情報が結構古かったので調べたり試したりして得られたことをここに書いておきます．
もしかすると設定が必要なのかもしれませんが、そこはご了承ください．

まず、Docker Desktop は WSL2 をバックエンドとして実行されます．
Docker DesktopをWSL2にインテグレーションすると `docker-desktop` というディストリビューションが作られます．
これは `docker-desktop` と `docker-desktop-data` の2つが作成されるとネットでよく見たのですが、最新は1つだけのようです．
また、データの格納先も変わっていました．

旧バージョン

| ディストリビューション | 場所                                         |
| :--------------------- | :------------------------------------------- |
| docker-desktop         | `%LocalAppData%\Docker\wsl\distro\ext4.vhdx` |
| docker-desktop-data    | `%LocalAppData%\Docker\wsl\data\ext4.vhdx`   |

最新

| ディストリビューション | 場所                                              |
| :--------------------- | :------------------------------------------------ |
| docker-desktop         | `%LocalAppData%\Docker\wsl\disk\docker_data.vhdx` |

このファイルがどんどん肥大化していくので、別のドライブにしたいのです．
まず、Docker Desktop自体に設定で場所を変更できる機能がありますが、試したところ失敗することが多く、まったく安定しません．
次に、エクスポート・インポートする方法がありますが、ちょっと面倒ですし、人によっては上手くいかないこともあるようです．
なので、シンボリックリンクを作成して`%LocalAppData%\Docker\wsl`ディレクトリを別のドライブにリンクするようにしました．

あと、WSL2にインテグレーションすると、WSL側のディストリビューションで docker コマンドが Docker Desktop を経由するようになります．
この場合、別途 Docker をインストールする必要がありません．

## tensorflow-gpu

これで WSL2(Ubuntu) で Docker を使う環境が整ったので、あとはイメージをpullして実行するだけです．

```powershell
docker pull tensorflow/tensorflow:latest-gpu
docker run --gpus all --it --name tfgpu tensorflow/tensorflow:latest-gpu
```

必要に応じてマウントを追加してください．
あとは、Visual Studio Codeの Dev Containerを使ってアタッチします．
実行するカーネルを選択したり、Jupyter notebookを使うために拡張機能や ipykernel のインストールなどが求められますのでインストールします．
諸々設定が終わったらGPUを認識しているか確認します．

```python title="IN"
import tensorflow as tf
tf.config.list_physical_devices("GPU")
```

```powershell title="OUT"
[PhysicalDevice(name='/physical_device:GPU:0', device_type='GPU')]
```

ちゃんと認識しているみたいです．

ちなみに、Jupyter notebookのサーバーを立ち上げたい場合は `tensorflow/tensorflow:latest-gpu-jupyter` を使います．

以上です．
