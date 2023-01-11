---
layout: post
title: Blender：パーティクルを使ったビルの配置
category: note
tags: [blender]
authors: [mebiusbox]
---

Blender で複数のビルをパーティクルを使って格子状に配置する方法です。

まず、ビルを用意します。今回はキューブを３つ作りました。
スケールとZ軸の位置はフリーズしておきます。

![001](/img/post/2016-07-02-blender-building-001.png)

各ビルのパラメータは次のようになっています。

![building2](/img/post/2016-07-02-blender-building-building2.png){: .imgblk }
![building1](/img/post/2016-07-02-blender-building-building1.png){: .imgblk }
![building3](/img/post/2016-07-02-blender-building-building3.png)

作成したビルはグループ化し、名前は `Buildings` にします。

![002](/img/post/2016-07-02-blender-building-002.png)

次にパーティクルを生成して配置していきます。
別レイヤーにすると作業しやすいので、別のレイヤーにして Plane を作成します。スケールは 8 にしました。

![003](/img/post/2016-07-02-blender-building-003.png)

Edit Mode にして `Subdivide` を何回か実行します。

![004](/img/post/2016-07-02-blender-building-004.png)

Object Mode に戻してパーティクルを作成します。

![005](/img/post/2016-07-02-blender-building-005.png)

Type を `Hair` にして、`Advanced` のチェックをつけます。

![006](/img/post/2016-07-02-blender-building-006.png)

![007](/img/post/2016-07-02-blender-building-007.png)

Render の `Group` を選択します。

![008](/img/post/2016-07-02-blender-building-008.png)

![008-2](/img/post/2016-07-02-blender-building-008_2.png)

Render の `Dupli Group` で `Buildings` を選択します。

![009](/img/post/2016-07-02-blender-building-009.png)

回転が正しくないので、調整します。
Rotation の項目にチェックをつけて、`Initial Orientation` を `Object Y` にします。

![010](/img/post/2016-07-02-blender-building-010.png)

![011](/img/post/2016-07-02-blender-building-011.png)

この状態だと面の法線上にランダムで作成しているので他のビルと重なってしまいます。
そこで生成する場所を頂点に変更します。

Emission の `Emit From` を `Verts` に変更します。

![012](/img/post/2016-07-02-blender-building-012.png)

![013](/img/post/2016-07-02-blender-building-013.png)

Top から正投影（ワイヤーフレーム）で見てみると次のようになっています。

![014](/img/post/2016-07-02-blender-building-014.png)

Emission の Numbers を編集してみると生成されるビルの数を調整することができます。
`Emit From` の `Random` のチェックをつけていると同じ場所にビルが重なって生成されてしまうのでチェックをはずします。
頂点の数が 1089 なら、Numbers が 1090 だとすべての頂点の位置に生成されます。

![015](/img/post/2016-07-02-blender-building-015.png)

Plane の頂点上に配置しているので、頂点を削除すればその上に配置されなくなります。
適当な頂点を消してみます。

![016](/img/post/2016-07-02-blender-building-016.png)

Edit Mode では反映されないので、Object Mode にして確認すると、削除した部分にビルが配置されなくなっています。

![017](/img/post/2016-07-02-blender-building-017.png)

![018](/img/post/2016-07-02-blender-building-018.png)

これを使って通路を確保してみます。

![019](/img/post/2016-07-02-blender-building-019.png)

![020](/img/post/2016-07-02-blender-building-020.png)

この方法なら大量の配置も、新しいビルの追加も簡単です。
