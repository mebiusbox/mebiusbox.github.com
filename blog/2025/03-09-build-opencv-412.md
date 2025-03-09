---
title: OpenCV 4.12 をビルドする
description: WindowsでOpenCV 4.12をビルドする方法
keywords:
  - OpenCV
  - Visual Studio
  - CMake
category: note
authors: [mebiusbox]
tags: [OpenCV, CMake]
image: https://og-image-mebiusbox.vercel.app/api/og?title=OpenCV+4.12+%e3%82%92%e3%83%93%e3%83%ab%e3%83%89%e3%81%99%e3%82%8b&subtitle=Windows%e3%81%a7OpenCV+4.12%e3%82%92%e3%83%93%e3%83%ab%e3%83%89%e3%81%99%e3%82%8b%e6%96%b9%e6%b3%95&date=2025%2F03%2F09&tags=OpenCV,CMake
---

WindowsでOpenCVをビルドする方法です．OpenCVをビルドする方法の解説はそこらじゅうにありますが、必要最低限のビルド構成について解説します．

<!-- truncate -->

OpenCVにはさまざまなモジュールがあります．今回は最低限の画像処理だけできればいいように `core`, `imgproc`, `imgcodecs`, `videoio`のみをビルドする構成にします．また、64bit版のみとします．

## 準備

ソースコードは OpenCV の[リポジトリ](https://github.com/opencv/opencv)から取得します．今回は Contrib を使いません．また、OpenCV は`4.x`の最新版を取得しました．ビルドするには [CMake](https://cmake.org/) が必要です．必要であればWinGetでインストールします．WinGetでインストールする場合はパスが追加されてませんので、必要に応じて追加します．

```shell
winget install Kitware.Cmake
```

ビルドには Visual Studio 2022 を使います．

## プロジェクトの生成

CMakeを使ってプロジェクトを作成します．不要なモジュールとテストコードを除外します．

クローンしたディレクトリに `build.x64` ディレクトリを作成し、そこに移動します．そして、次のコマンドを実行します．
必要なモジュールがあれば、削除して有効にしてください．

```shell
cmake -G "Visual Studio 17 2022" -A x64 -DBUILD_TESTS=OFF -DBUILD_PERF_TEST=OFF -DBUILD_opencv_apps=OFF -DBUILD_opencv_calib3d=OFF -DBUILD_opencv_dnn=OFF -DBUILD_opencv_features2d=OFF -DBUILD_opencv_flann=OFF -DBUILD_opencv_gapi=OFF -DBUILD_opencv_highgui=OFF -DBUILD_opencv_java_bindings_generator=OFF -DBUILD_opencv_js_bindings_generator=OFF -DBUILD_opencv_ml=OFF -DBUILD_opencv_objc_bindings_generator=OFF -DBUILD_opencv_objdetect=OFF -DBUILD_opencv_photo=OFF -DBUILD_opencv_python3=OFF -DBUILD_opencv_python_bindings_generator=OFF -DBUILD_opencv_python_tests=OFF -DBUILD_opencv_stitching=OFF -DBUILD_opencv_ts=OFF -DBUILD_opencv_video=OFF ..
```

:::warning
Pythonモジュールを有効にするとDebugビルド時にPythonライブラリのDebug版が求められますので注意．
:::

正常終了すればプロジェクトファイルが作成されます．

## ビルド

`ALL_BUILD.vcxproj` を開いて `ALL_BUILD` 構成でビルドします．その後、`INSTALL` 構成でビルドすれば `build.x64\install` にインストールされます．
ターミナルでも CMake を使ってビルドやインストールができます．その場合は次のコマンドを実行します．

```shell
cmake --build .\ --config Debug
cmake --build .\ --config Release
cmake --install .\ --config Debug
cmake --install .\ --config Release
```

どちらでも構いません．個人的に何かエラーが発生した場合は、Visual Studioで確認したほうがいいので、面倒でもVisual Studioを開いてビルドすることをオススメします．

以上です．

## おまけ

CMake で次のようなエラーが出る場合：

```text
CMake Error: The following variables are used in this project, but they are set to NOTFOUND. Please set them or make sure they are set and tested correctly in the CMake files: CUDA_nppial_LIBRARY (ADVANCED) linked by target ...
```

OpenCV 3.x 系をビルドしようとしたらこのようなエラーが出ました．一応、対応できるらしいですが、問題なければ 4.x 系を使いましょう．
（3.3.0 で確認しました．どうやら 3.4.0 から修正されているようですが、確認はしていません）
