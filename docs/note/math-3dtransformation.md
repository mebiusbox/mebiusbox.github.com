---
title: 3次元座標変換のメモ書き
description: 3次元座標変換について解説します
keywords:
  - 3次元座標変換
  - Three.js
pagination_next: null
pagination_prev: null
image: https://og-image-mebiusbox.vercel.app/api/og?title=3%E6%AC%A1%E5%85%83%E5%BA%A7%E6%A8%99%E5%A4%89%E6%8F%9B%E3%81%AE%E3%83%A1%E3%83%A2%E6%9B%B8%E3%81%8D&subtitle=3%E6%AC%A1%E5%85%83%E5%BA%A7%E6%A8%99%E5%A4%89%E6%8F%9B%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6%E8%A7%A3%E8%AA%AC%E3%81%97%E3%81%BE%E3%81%99&date=2023%2F01%2F14
last_update:
  date: 2023-01-14
  author: mebiusbox
---

# 3次元座標変換のメモ書き

:::info
これは Zenn で公開している内容と同じです．
Docusaurusの数式処理を確認するための文書です．
:::

## はじめに

入社してきた新入社員が期待と不安とやる気に満ちあふれているところで，まずは研修から始めるところが多いかと思います．
研修なんて受けたことがないので，きちんと基礎を叩き込んでくれるところで研修受けたい．そう思うこの頃です．

今回は３次元座標変換について，巷にはそういった情報は沢山あるのですが，自分なりの整理も含めて少し書くことにしました．新人向けに書いていますので，最初は基本的なところから入っていきます．

## 基本的な座標変換

### 座標系（coordinate system）

３次元空間は実世界と同じであり，上下・左右・前後の３つの次元です．この上下・左右・前後はそれぞれ直交関係にあります．そして，例えば上下というのは，私から見た上下と，あなたから見た上下は必ずしも一致するとは限りません．つまり，上下・左右・前後というのはどこか基点があるということです．この場合，私やあなたが基点であり，向いている方向に依存しています．次に，例えば前方に５歩進むとしたら人によって進む距離に違いがあります．もし，前方に１メートル進む場合は全員同じ距離になりますが，今度は１メートル進むための歩数が変わってきます．このように，単位も重要になってきます．よって，基点と向きと単位を決めれば，その３次元空間での座標が特定できることになります．この基点を原点（origin）とし，向き（axis），単位（unit）を決めたものを**座標系**といいます．ここでは上下をY，左右をX，前後をZとします．

３次元空間では座標系を決めるときに２つの種類があります．**左手座標系**と**右手座標系**です．左手座標系ではZ方向が奥に向かって正であり，DirectXやUnrealEngine，Unityなどが左手座標系です．右手座標系はZ方向が手前に向かって正であり，OpenGLやWebGLなどが右手座標系です．座標系が同じだとしても，上下方向がYやZだったりするので，座標系と軸を確認するようにしましょう．

ここでは**右手座標系**で説明します．

### ベクトル（vector）

座標系が決まれば，位置を表現することができます．３次元空間での位置はベクトルで表されます．まず，点$p$の位置をXYZの各軸で測った値をそれぞれx,y,zとすると

$$
    p = (x,y,z)
$$

で位置を表現できます．ベクトルは方向と大きさを表していて，例えば点$q$から点$p$に向かうベクトル$v$は

$$
    q = (0,30,0), \quad p = (0,50,0), \quad \vec{v} = \vec{qp} = (0,20,0)
$$

となります．これにはベクトルの始点，終点の位置，大きさ，方向がありますね．ここで，ベクトル$\vec{v}$の始点を原点$O = (0,0,0)$とすれば，

$$
    \vec{OV} = \vec{v} = (0,20,0)
$$

となって，大きさと方向のみを表すことになります．このときの$x,y,z$のことをそれぞれX成分，Y成分，Z成分といい，この表記を**成分表示**といいます．

ベクトルの成分表示が出来たので，ベクトルから大きさと方向をそれぞれ取り出してみましょう．まず，大きさですがこれは始点から終点までの距離になります．始点を原点とすればピタゴラスの定理を使ってベクトルの大きさ$|\vec{v}|$は

$$
    |\vec{v}| = \sqrt{x^2+y^2+z^2}
$$

で得られます．３次元ベクトルが３つの値を持っていることに対して，ベクトルの大きさは１つの量を表す値です．この値をベクトルに対して**スカラ**（scalar）といいます．

次に方向は，大きさが１のベクトルで表します．このようなベクトルを**単位ベクトル**（unit vector）といいます．単位ベクトルはベクトルの各成分を大きさで割ることで求められます．

$$
    \frac{\vec{v}}{|\vec{v}|} = \left(\frac{x}{|\vec{v}|},\frac{y}{|\vec{v}|},\frac{z}{|\vec{v}|}\right)
$$

これを**正規化**（normalize）といいます．つまり，ベクトルを正規化すればそれは方向を表すベクトルということになります．

※ベクトルや行列の演算について，これから出てきますが詳しいことはここでは解説しません．ベクトルや行列などの線形代数については他を参照したり，もしくは私が書いた「[CGのための数学](https://zenn.dev/mebiusbox/books/132b654aa02124)」を参照してください．

### 基底（basis）

ベクトルの成分表示でXYZで測った値を表記することがわかりました．もちろん，このXYZというのはそのベクトルを測った座標系に基づいています．この座標系とベクトルの関係を見ていきましょう．

XYZというのは座標系における軸のことです．これまで，上下・左右・前後という曖昧な表現でしたが，方向を表すベクトル，つまり単位ベクトルを使うと，XYZの向きをベクトルで表すことが出来ます．一般的な座標系として，左右をX，上下をY，前後をZとしたとき，それぞれの向き（単位ベクトル）$\vec{e} _ x,\vec{e} _ y,\vec{e} _ z$は

$$
    \vec{e}_x = (1,0,0), \quad \vec{e}_y = (0,1,0), \quad \vec{e}_z = (0,0,1)
$$

となります．これを使うとベクトルの成分表示は

$$
    \vec{p} = \left(\begin{matrix}p_x \newline p_y \newline p_z\end{matrix}\right) =
    p_x \left(\begin{matrix}1 \newline 0 \newline 0\end{matrix}\right) + 
    p_y \left(\begin{matrix}0 \newline 1 \newline 0\end{matrix}\right) +
    p_z \left(\begin{matrix}0 \newline 0 \newline 1\end{matrix}\right) 
    = p_x \vec{e}_x + p_y \vec{e}_y + p_z \vec{e}_z
$$

となります．この$\vec{e}\_x,\vec{e}\_y,\vec{e}\_z$はお互い直交関係になっています．ベクトルの内積が０のとき，直交であることから

$$
    \vec{e}_x \cdot \vec{e}_y =
    \vec{e}_y \cdot \vec{e}_z =
    \vec{e}_z \cdot \vec{e}_x = 0
$$

の関係であることがわかります．これらの単位ベクトルによって座標系の向きを決めることができます．このXYZの向きベクトルの組を**基底**といい，それぞれのベクトルのことを**基底ベクトル**といいます．ベクトルの内積は片方が単位ベクトルのとき，もう片方のベクトルのその単位ベクトル方向の大きさを求められます．これを使って，ある座標系の基底ベクトルと，位置を表すベクトルから

$$
    \begin{aligned}
    p_x &= \vec{p} \cdot \vec{e}_x \newline
    p_y &= \vec{p} \cdot \vec{e}_y \newline
    p_z &= \vec{p} \cdot \vec{e}_z \newline
    \end{aligned}
$$

と各成分が得られます．さらに行列を使って，$\vec{e}\_x = i, \vec{e}\_y = j, \vec{e}\_z = k$とおくと

$$
    \begin{aligned}
    M &= \left(\begin{matrix}i_x & i_y & i_z \newline
    j_x & j_y & j_z \newline
    k_x & k_y & k_z\end{matrix}\right) \newline
    \vec{p}' &= M\vec{p} \newline
    &= \vec{p}\cdot i + \vec{p}\cdot j + \vec{p}\cdot k
    \end{aligned}
$$

となります．この行列$M$はXYZの基底ベクトルで構成されていることから，基底を表していることが想像できると思います．行列とベクトルの内積の性質から，基底を表す行列$M$に，任意のベクトル$\vec{p}$をかけると（一次変換），行列$M$で表す基底での成分に変換することができ，この値は一意に決まります．よって，この行列$M$はベクトル$\vec{p}$から$\vec{p}'$の写像を表しています．

基底ベクトルというのは常に単位ベクトルというわけでもなく，また，３次元での基底は直交していなくても定義することができます．このような座標系は斜交座標系といったりします．ここでは，右手座標系ですので，基底ベクトルは直交関係であり，また，基底ベクトルが単位ベクトルであるとします．このような基底を**正規直交基底**といいます．

### 基底変換（basis transformation）

いよいよ座標変換に入っていきます．座標変換といっても色々種類がありますので，１つずつ見ていきましょう．まずは基底変換です．基底というのはすでに見てきたように，基底ベクトルの組であり，基底ベクトルは単位ベクトルで互いに直交になっています．座標系で出てきた「原点」「向き」「単位」のうち，「原点」は$O=(0,0,0)$のままでどの基底でも同じです．また，単位も基底ベクトルは常に単位ベクトルですので，単位も変わりません．結局，基底は向きのみを表しているといえます．そうすると基底が変わるということはどういうことでしょうか．原点が固定で，大きさも変わらないとなれば，それは向きが「回転」すると考えられます．つまり，基底変換は回転させる座標変換といえます．

ここで少し三角関数について復習しておきましょう．まずは三角比から．

$$
    \sin\theta = \frac{a}{c}, \quad \cos\theta = \frac{b}{c}, \quad \tan\theta = \frac{a}{b}
$$

![1554578765757_resize](https://storage.googleapis.com/zenn-user-upload/wqu7p1d41zdhp0nlewl7xt2l70yf)

単位円で三角関数を見てみると

$$
    x = \cos\theta, \quad y = \sin\theta
$$

![1554578820354_resize](https://storage.googleapis.com/zenn-user-upload/b2aftsjvnmvgl0bmgzdsh5b5hbtm)

となります．また，ピタゴラスの定理から

$$
    \sin\theta^2 + \cos\theta^2 = 1
$$

が得られます．三角関数の逆関数にはそれぞれ$\arcsin, \arccos, \arctan$があります．これらの関係は

$$
    \begin{aligned}
    \theta &= \arcsin(\sin\theta) \quad ( -\frac{\pi}{2} \leqq \theta \leqq \frac{\pi}{2} ), \newline
    \theta &= \arccos(\cos\theta) \quad ( 0 \leqq \theta \leqq \pi ), \newline
    \theta &= \arctan(\tan\theta) \quad ( -\frac{\pi}{2} < \theta < \frac{\pi}{2} )
    \end{aligned}
$$

となります．次に加法定理です．次の図を見てください．

![1554578863249](https://storage.googleapis.com/zenn-user-upload/k4icxxiktalgyjqcm9x4xetbbtlu)

$\Delta abc$において，斜辺の長さが$1$から

$$
    \overline{ac} = \sin(A+B), \quad
    \overline{bc} = \cos(A+B)
$$

$\Delta abd$において，

$$
    \overline{ad} = \sin B, \quad \overline{bd} = \cos B
$$

次に

$$
    \begin{aligned}
    \overline{af} &= \overline{ad}\cos A = \cos A \sin B \newline
    \overline{fc} &= \overline{de} = \overline{bd}\sin A = \sin A \cos B
    \end{aligned}
$$

$\overline{ac} = \overline{af}+\overline{fc}$の関係から

$$
    \begin{aligned}
    \sin(A+B) &= \sin A\cos B + \cos A\sin B \newline
    \cos(A+B) &= \cos A\cos B - \sin A\sin B \newline
    \sin(A-B) &= \sin A\cos B - \cos A\sin B \newline
    \cos(A-B) &= \cos A\cos B + \sin A\sin B
    \end{aligned}
$$

となります．

それでは回転を見ていきましょう．次の図のように点$p$を点$p'$に回転する場合を考えます．ここでは$z=0$とします．

![1554580093216](https://storage.googleapis.com/zenn-user-upload/r9fszm4o15wgisb7abxea2qrv5ce)

すると点$p$の各成分は

$$
    x = r\cos\phi, \quad y = r\sin\phi
$$

となります．回転後の点$p'$の各成分は加法定理を使って

$$
    \begin{aligned}
    x' &= r\cos(\theta+\phi)
       = r\cos\theta\cos\phi - r\sin\theta\sin\phi \newline
    y' &= r\sin(\theta+\phi)
       = r\sin\theta\cos\phi + r\cos\theta\sin\phi
    \end{aligned}
$$

となります．ここで

$$
    r = \frac{x}{\cos\phi}, \quad r = \frac{y}{\sin\phi}
$$

を代入して，整理すると

$$
    \begin{aligned}
    x' &= \frac{x\cos\theta\cos\phi}{\cos\phi} - \frac{y\sin\theta\sin\phi}{\sin\phi}
       = x\cos\theta - y\sin\theta \newline
    y' &= \frac{x\sin\theta\cos\phi}{\cos\phi} + \frac{y\cos\theta\sin\phi}{\sin\phi}
       = x\sin\theta + y\cos\theta \newline
    z' &= z
    \end{aligned}
$$

となって，行列で書くと

$$
    \left(\begin{matrix}x' \newline y' \newline z'\end{matrix}\right) = 
    \left(\begin{matrix}
        \cos\theta & -\sin\theta & 0 \newline
        \sin\theta & \cos\theta & 0 \newline
        0 & 0 & 1
    \end{matrix}\right)
    \left(\begin{matrix}x \newline y \newline z\end{matrix}\right)
$$

となります．この行列の基底ベクトルに注目してみると，回転させたい方向とは逆の方向に回転したベクトルになっています．つまり，反対方向に回転させた基底を使って変換を行うと，回転した座標になるということになります．

![1554580132600](https://storage.googleapis.com/zenn-user-upload/lw23oeaav3nlgs3z7rsszi90o4qx)

この回転行列はZ軸を基準に回転を表していることになります．このZ軸回転の行列を$R_z$とおくと

$$
    R_z = 
    \left(\begin{matrix}
        \cos\theta & -\sin\theta & 0 \newline
        \sin\theta & \cos\theta & 0 \newline
        0 & 0 & 1
    \end{matrix}\right)
$$

となります．同じようにX軸，Y軸の回転行列$R_x,R_y$は

$$
    \begin{aligned}
    R_x &= \left(\begin{matrix}
        1 & 0 & 0\newline
        0 & \cos\theta & -\sin\theta \newline
        0 & \sin\theta & \cos\theta
    \end{matrix}\right) \newline
    R_y &= \left(\begin{matrix}
        \cos\theta & 0 & \sin\theta\newline
        0 & 1 & 0 \newline
        -\sin\theta & 0 & \cos\theta
    \end{matrix}\right)
    \end{aligned}
$$

となります．ここで各回転行列の行ベクトル，および列ベクトルは

$$
    \sin\theta^2 + \cos\theta^2 = 1
$$

から，すべて単位ベクトルであり，列ベクトルにおいても互いに内積がゼロなので直交していることがわかります．

行列は掛け合わせて合成できるので，例えばXYZ回転の行列$R \_ {xyz}$は

$$
    R \_ {xyz} = R_z R_y R_x
$$

となります．ここでは取り上げませんが，任意の軸を基準に回転する行列の式も簡単に見つかると思います．これらの回転行列を組み合わせて基底変換の行列をつくることが出来ます．


### 剛体変換（rigid-body transformation）

基底変換では座標系のうち，向きしか変換できませんでした．ここで，原点を平行移動させる変換を考えます．このような大きさが変わらず，向きと位置が変わる変換を**剛体変換**といいます．剛体（rigid body）は力を加えても形状を変えない物体のことで物理シミュレーションでよく使います．
基底変換では向きしか変換できなかったので，これに加えて平行移動する変換をしなければなりません．基底変換ではある点$p$を点$p'$に変換する行列$M$から

$$
    \vec{p}' = M\vec{p}
$$

と表せました．ここで，この変換に$\vec{t}$の平行移動を追加するには

$$
    \vec{p}' = M\vec{p} + \vec{t}
$$

とすればよいことになります．これは１次関数の形になっていますね．しかし，このままでは３行３列の行列で表すことができず，扱いづらいものになっています．そこで，４次元の**同次座標系**（homogeneous coordinate）を使います（同次座標系は斉次座標系とも呼ばれます）．４次元の同次座標系を使うと４次元空間の断面と３次元空間の座標を同じ（写像）扱いにすることができます．４次元空間の位置は$w$が追加された$x,y,z,w$で表し，３次元空間との関係は

$$
    \left(\begin{matrix}x \newline y \newline z\end{matrix}\right) = 
    \left(\begin{matrix}x/w \newline y/w \newline z/w\end{matrix}\right)
$$

となります．通常は$w=1$として

$$
    \left(\begin{matrix}x \newline y \newline z\end{matrix}\right) = 
    \left(\begin{matrix}x \newline y \newline z \newline 1\end{matrix}\right)
$$

とします．ちなみに$w=0$とすると，無限遠点となり大きさが無限となります．ただし，無限遠点でも向きは存在しているので，$w=0$の場合は向きだけを表しているとも考えることができます．

４次元の同次座標系を使うことで４行４列の行列を扱えるようになりました．平行移動を行列で表記すると

$$
    T = 
    \left(\begin{matrix}
        1 & 0 & 0 & t_x \newline
        0 & 1 & 0 & t_y \newline
        0 & 0 & 1 & t_z \newline
        0 & 0 & 0 & 1
    \end{matrix}\right)
$$

となります．基底変換の行列は回転を表す行列なので，回転行列を$R$とおくと，剛体変換は次のようになります．

$$
\begin{aligned}
    \vec{p}' = M\vec{p} + \vec{t} = TR\vec{p} &=
    \left(\begin{matrix}
        1 & 0 & 0 & t_x \newline
        0 & 1 & 0 & t_y \newline
        0 & 0 & 1 & t_z \newline
        0 & 0 & 0 & 1
    \end{matrix}\right)
    \left(\begin{matrix}
        R \_ {11} & R \_ {12} & R \_ {13} & 0 \newline
        R \_ {21} & R \_ {22} & R \_ {23} & 0 \newline
        R \_ {31} & R \_ {32} & R \_ {33} & 0 \newline
        0 & 0 & 0 & 1
    \end{matrix}\right)
    \left(\begin{matrix}p_x \newline p_y \newline p_z \newline 1\end{matrix}\right) \newline &=
    \left(\begin{matrix}
        R \_ {11} & R \_ {12} & R \_ {13} & t_x \newline
        R \_ {21} & R \_ {22} & R \_ {23} & t_y \newline
        R \_ {31} & R \_ {32} & R \_ {33} & t_z \newline
        0 & 0 & 0 & 1
    \end{matrix}\right)
    \left(\begin{matrix}p_x \newline p_y \newline p_z \newline 1\end{matrix}\right)
\end{aligned}
$$

### アフィン変換（affine transformation）

基底変換の式

$$
    \vec{p}' = M\vec{p}
$$

は一次変換でした．次に，剛体変換の式は基底変換に平行移動を追加した式

$$
    \vec{p}' = M\vec{p} + \vec{t}
$$

は１次関数と同じ形になっていましたね．もちろん，これは写像を表しています．この１次関数をベクトル空間で一般化し，一次変換と平行移動を合わせた変換を**アフィン変換**といいます．よって，剛体変換も基底変換もアフィン変換の特殊な形となります．アフィン変換では回転，平行移動の他に，拡大・縮小，鏡映，せん断があります．

先に鏡映とせん断についてです．鏡映（reflection）は基準となる軸に対して対称となる位置に移動する変換です．例えば，右手座標系と左手座標系を相互に変換する場合は次のような行列になります．

$$
    M \_ {reflection} = 
    \left(\begin{matrix}
        1 & 0 & 0 \newline
        0 & 1 & 0 \newline
        0 & 0 & -1
    \end{matrix}\right)
$$

せん断（shearing）はスキュー（skew）変換とも呼ばれ，歪ませる変換です．これは別軸の成分の値が他の軸の成分に影響させることで歪ませます．例えば，$Y$軸方向の値分，$X$軸方向にずらす場合は

$$
    M \_ {skew} = 
    \left(\begin{matrix}
        1 & 1 & 0 \newline
        0 & 1 & 0 \newline
        0 & 0 & 1
    \end{matrix}\right)
$$

となります．

次は拡大・縮小です．この行列$S$は次のようになります．

$$
    S = 
    \left(\begin{matrix}
        s_x & 0 & 0 \newline
        0 & s_y & 0 \newline
        0 & 0 & s_z
    \end{matrix}\right)
$$

拡大・縮小行列で変換してみると

$$
    \vec{p}' = S\vec{p} =
    \left(\begin{matrix}
        s_x & 0 & 0 \newline
        0 & s_y & 0 \newline
        0 & 0 & s_z
    \end{matrix}\right)
    \left(\begin{matrix}p_x \newline p_y \newline p_z\end{matrix}\right) =
    \left(\begin{matrix}s_x p_x \newline s_y p_y \newline s_z p_z\end{matrix}\right)
$$

となります．この拡大・縮小と回転，平行移動の３つを組み合わせて座標変換行列をつくるのが基本的なやり方となります．式で表すと

$$
    \begin{aligned}
    \vec{p}' &= TRS\vec{p} \newline
    &= \left(\begin{matrix}
        1 & 0 & 0 & t_x \newline
        0 & 1 & 0 & t_y \newline
        0 & 0 & 1 & t_z \newline
        0 & 0 & 0 & 1
    \end{matrix}\right)
    \left(\begin{matrix}
        R \_ {11} & R \_ {12} & R \_ {13} & 0 \newline
        R \_ {21} & R \_ {22} & R \_ {23} & 0 \newline
        R \_ {31} & R \_ {32} & R \_ {33} & 0 \newline
        0 & 0 & 0 & 1
    \end{matrix}\right)
    \left(\begin{matrix}
        s_x & 0 & 0 & 0 \newline
        0 & s_y & 0 & 0 \newline
        0 & 0 & s_z & 0 \newline
        0 & 0 & 0 & 1
    \end{matrix}\right)
    \left(\begin{matrix}p_x \newline p_y \newline p_z \newline 1\end{matrix}\right) \newline
    &= 
    \left(\begin{matrix}
        s_x R \_ {11} & s_y R \_ {12} & s_z R \_ {13} & t_x \newline
        s_x R \_ {21} & s_y R \_ {22} & s_z R \_ {23} & t_y \newline
        s_x R \_ {31} & s_y R \_ {32} & s_z R \_ {33} & t_z \newline
        0 & 0 & 0 & 1
    \end{matrix}\right)
    \left(\begin{matrix}p_x \newline p_y \newline p_z \newline 1\end{matrix}\right)
    \end{aligned}
$$

となります．また，TRSの変換行列において４行目のベクトルは固定値になっているため

$$
    TRS = 
    \left(\begin{matrix}
        s_x R \_ {11} & s_y R \_ {12} & s_z R \_ {13} & t_x \newline
        s_x R \_ {21} & s_y R \_ {22} & s_z R \_ {23} & t_y \newline
        s_x R \_ {31} & s_y R \_ {32} & s_z R \_ {33} & t_z \newline
    \end{matrix}\right)
$$

と３行４列の部分だけあればよいことになります．これは変換行列のデータ量を小さくするときに利用します．

TRSの変換行列が得られたので，今度はTRSから拡大・縮小，回転，平行移動に分解することを考えてみましょう．まず，平行移動は$t\_x,t\_y,t\_z$をそのまま取り出すことができます．問題は拡大・縮小と回転です．これを抽出するためには回転行列の性質を利用します．

ここからは少しややこしくなりますが，１つ１つ整理しながら読み進んでもらえるといいかなと思います．

基底変換のところで回転行列について扱いました．$\theta$回転させる場合，反対方向に回転，つまり$-\theta$回転した基底を使えば$\theta$回転することになるということでしたね．さらにいうと，回転した座標を回転した基底で変換すると，回転前と同じ座標になります．ここで注意なのが，回転した基底は回転行列とは異なるということです．基底を表す行列$M$，点を$p$として，回転前の行列$M_1$，回転前の点$p_1$，回転後の行列$M_2$，回転後の点$p_2$とすれば

$$
    M_1 p_1 = M_2 p_2
$$

の関係が成り立ちます．また，逆行列を使えば

$$
    p_1 = M_1^{-1} M_2 p_2, \quad p_2 = M_2^{-1} M_1 p_1
$$

となります．$\theta$回転する基底を作ると，それは$-\theta$回転した基底ベクトルということでした．この行列の逆行列を考えてみると，$\theta$回転した基底ベクトルになっているということになります．これはまさに回転後の基底です．ここまでをまとめると，

- 基底を表す行列の逆行列は，回転後の基底である
- 基底を表す行列は，回転後の基底における回転前の基底である

となります．次に回転行列は**直交行列**の性質を持っています．直交行列はその転置行列を自身にかけると単位行列となるものです．つまり，直交行列の転置行列は逆行列ということになります．

$$
    M^TM = MM^T = I, \quad MM^{-1} = M^{-1}M = I, \quad \therefore M^T = M^{-1}
$$

また，直交行列の行列式の性質も確認してみましょう．行列$A,B$の行列式の関係は

$$
    |AB| = |A||B|
$$

です．これに$A=M,B=M^T$を代入すると

$$
    |MM^T| = |M||M^T|
$$

行列式の性質として行列とその行列の転置行列の行列式は同じです．

$$
    |M| = |M^T|
$$

よって

$$
    |MM^T| = |M||M^T| = |M||M| = |M|^2
$$

となります．一方で

$$
    MM^T = I
$$

および，単位行列$I$の行列式は$|I|=1$ということがわかっているので

$$
    |MM^T| = |I| = 1
$$

となり，

$$
    |MM^T| = |I| = |M|^2 = 1
$$

となります．よって，二乗して$1$となる値が直交行列の行列式となるので，$1$と$-1$ということになります．また，回転行列のように行ベクトル，列ベクトルがすべて単位ベクトルであり，互いに直交である場合は行列式の値が$1$になります．

これまで直交行列の性質をみてきました．回転行列は直交行列ですので，直交行列の性質から回転行列の逆行列は転置行列と等しくなります．このことを踏まえて

- 基底を表す行列の逆行列は，回転後の基底である

を考えてみると，逆行列は転置行列だったので，基底を表す行列の列ベクトルが回転後の基底ベクトルとなります．結局

- 基底を表す行列の列ベクトルは，回転後の基底ベクトルである
- 基底を表す行列は，回転後の基底における回転前の基底である

となります．これでTRSの座標変換行列から回転と拡大・縮小を抽出する準備ができました．もう一度変換行列を確認してみると

$$
    \vec{p}' = TRS\vec{p} =
    \left(\begin{matrix}
        s_x R \_ {11} & s_y R \_ {12} & s_z R \_ {13} & t_x \newline
        s_x R \_ {21} & s_y R \_ {22} & s_z R \_ {23} & t_y \newline
        s_x R \_ {31} & s_y R \_ {32} & s_z R \_ {33} & t_z \newline
        0 & 0 & 0 & 1
    \end{matrix}\right)
    \left(\begin{matrix}p_x \newline p_y \newline p_z \newline 1\end{matrix}\right)
$$

ここで列ベクトルに注目し，それぞれ$\vec{v}\_x,\vec{v}\_y,\vec{v}\_z$とおくと

$$
    \vec{v}_x = \left(\begin{matrix} s_x R \_ {11} \newline s_x R \_ {21} \newline s_x R \_ {31}\end{matrix}\right),
    \quad
    \vec{v}_y = \left(\begin{matrix} s_y R \_ {12} \newline s_y R \_ {22} \newline s_y R \_ {32}\end{matrix}\right),
    \quad
    \vec{v}_z = \left(\begin{matrix} s_z R \_ {13} \newline s_z R \_ {23} \newline s_z R \_ {33}\end{matrix}\right)
$$

となります．各ベクトルの大きさを求めると

$$
    \begin{aligned}
    |\vec{v}_x| &= \sqrt{(s_x R \_ {11})^2 + (s_x R \_ {21})^2 + (s_x R \_ {31})^2} \newline
    |\vec{v}_y| &= \sqrt{(s_y R \_ {12})^2 + (s_y R \_ {22})^2 + (s_y R \_ {32})^2} \newline
    |\vec{v}_z| &= \sqrt{(s_z R \_ {13})^2 + (s_z R \_ {23})^2 + (s_z R \_ {33})^2}
    \end{aligned}
$$

となります．さらに二乗して平方根をはずして整理すると

$$
    \begin{aligned}
    |\vec{v}_x|^2 &= s_x^2 R \_ {11}^2 + s_x^2 R \_ {21}^2 + s_x^2 R \_ {31}^2 = s_x^2(R \_ {11}^2 + R \_ {21}^2 + R \_ {31}^2) \newline
    |\vec{v}_y|^2 &= s_y^2 R \_ {12}^2 + s_y^2 R \_ {22}^2 + s_y^2 R \_ {32}^2 = s_y^2(R \_ {12}^2+R \_ {22}^2+R \_ {32}^2) \newline
    |\vec{v}_z|^2 &= s_z^2 R \_ {13}^2 + s_z^2 R \_ {23}^2 + s_z^2 R \_ {33}^2 = s_z^2(R \_ {13}^2+R \_ {23}^2+R \_ {33}^2)
    \end{aligned}
$$

となります．ここで回転行列の列ベクトルは回転後の基底ベクトルであり，単位ベクトルなので，

$$
    \begin{aligned}
    \sqrt{R \_ {11}^2 + R \_ {21}^2 + R \_ {31}^2} = 1 \quad \therefore R \_ {11}^2 + R \_ {21}^2 + R \_ {31}^2 = 1^2 = 1 \newline
    \sqrt{R \_ {12}^2+R \_ {22}^2+R \_ {32}^2} = 1 \quad \therefore R \_ {12}^2+R \_ {22}^2+R \_ {32}^2 = 1^2 = 1 \newline
    \sqrt{R \_ {13}^2+R \_ {23}^2+R \_ {33}^2} = 1 \quad \therefore R \_ {13}^2+R \_ {23}^2+R \_ {33}^2 = 1^2 = 1
    \end{aligned}
$$

となります．これを代入すると

$$
    |\vec{v}_x|^2 = s_x^2, \quad
    |\vec{v}_y|^2 = s_y^2, \quad
    |\vec{v}_z|^2 = s_z^2 \qquad
    \therefore |\vec{v}_x| = s_x, \quad |\vec{v}_y| = s_y, \quad |\vec{v}_z| = s_z
$$

となって，列ベクトルの大きさが拡大・縮小の値と一致することがわかります．$s_x,s_y,s_z$がわかれば，回転は

$$
    \frac{1}{s_x}\vec{v}_x, \quad
    \frac{1}{s_y}\vec{v}_y, \quad
    \frac{1}{s_z}\vec{v}_z
$$

で各成分が得られます．まとめると，TRSの合成行列を$M$とおくと

$$
    \vec{p}' = TRS\vec{p} =
    \left(\begin{matrix}
        M \_ {11} & M \_ {12} & M \_ {13} & M \_ {14} \newline
        M \_ {21} & M \_ {22} & M \_ {23} & M \_ {24} \newline
        M \_ {31} & M \_ {32} & M \_ {33} & M \_ {34} \newline
        M \_ {41} & M \_ {42} & M \_ {43} & M \_ {44}
    \end{matrix}\right)
    \left(\begin{matrix}p_x \newline p_y \newline p_z \newline 1\end{matrix}\right)
$$

これからTRSを求めると

$$
    \vec{t} = \left(\begin{matrix}M \_ {14} \newline M \_ {24} \newline M \_ {34}\end{matrix}\right), \quad
    \vec{s} = \left(\begin{matrix}
        \sqrt{M \_ {11}^2+M \_ {21}^2+M \_ {31}^2} \newline
        \sqrt{M \_ {12}^2+M \_ {22}^2+M \_ {32}^2} \newline
        \sqrt{M \_ {13}^2+M \_ {23}^2+M \_ {33}^2}
    \end{matrix}\right), \quad
    R = \left(\begin{matrix}
        M \_ {11}/s_x & M \_ {12}/s_y & M \_ {13}/s_z \newline
        M \_ {21}/s_x & M \_ {22}/s_y & M \_ {23}/s_z \newline
        M \_ {31}/s_x & M \_ {32}/s_y & M \_ {33}/s_z
    \end{matrix}\right)
$$

となります．

## レンダリングパイプライン

コンピュータグラフィックスでは，レンダリングするために入力データ（頂点データやテクスチャなど）から画面に表示するまでの工程があり，その工程順番を決めたものをレンダリングパイプラインといいます．座標変換はそのレンダリングパイプラインの工程で行われます．具体的にはモデル変換，ビュー変換，投影変換，ビューポート変換です．

### モデル変換（modeling transformation）

座標変換ができれば座標系がいくつもあっても構わないのですが，一般的に**ローカル座標系**（local coordinate system）と**ワールド座標系**（world coordinate system）が使われます．頂点データはローカル座標系で作成し，それをワールド座標系に変換します．このワールド座標系への変換を**モデル変換**といいます．頂点データはローカル座標系で作成しますが，普通は親子階層を持っていて，親の座標系の下にさらに子の座標系，さらにその子の座標系・・・というようになっています．座標変換は一方向に伝搬するので，ワールド←親←子←孫・・・と座標変換できます．逆行列を使えば逆方向に伝搬することも出来ますね．モデル変換や親子での座標変換も基本的に平行移動・回転・拡大・縮小のTRSで座標変換されます．

### ビュー変換（viewing transformation）

レンダリングではカメラを導入して，カメラから見えるシーンを描画します．モデル変換によってワールド座標系にすべて変換されますので，ワールド空間上にカメラを配置します．そして，ワールド座標系の座標をカメラから見た座標系（カメラ座標系またはビュー座標系）に変換します．これを**ビュー変換**といいます．ビュー変換には一般的に２種類あります．

######  LookAt方式

まず，LookAt方式です．これはカメラの位置（C）と対象の位置（P），カメラの傾きを表す方向（U）の３つで指定します．まず，カメラの位置が原点となりますので，平行移動が必要です．

$$
    M = \left(\begin{matrix}
        1 & 0 & 0 & -t_x \newline
        0 & 1 & 0 & -t_y \newline
        0 & 0 & 1 & -t_z \newline
        0 & 0 & 0 & 1
    \end{matrix}\right)
$$

次に，カメラから見て前後方向（Z軸）を決定します．それは対象の位置からカメラの位置に向かうベクトルです．

$$
    \vec{z} = \frac{\vec{C} - \vec{P}}{|\vec{C}-\vec{P}|}
$$

次に，カメラの上方向を表すベクトルと求めたZ方向との外積を求めます．これはX方向になります．

$$
    \vec{x} = \frac{\vec{U}\times \vec{z}}{|\vec{U}\times \vec{z}|}
$$

最後に，Z方向とX方向の外積を求めます．これはY方向になります．

$$
    \vec{y} = \frac{\vec{z}\times \vec{x}}{|\vec{z}\times \vec{x}|}
$$

これで基底ベクトルが揃ったので，行列にすると

$$
    M = \left(\begin{matrix}
        x_x & x_y & x_z & 0 \newline
        y_x & y_y & y_z & 0 \newline
        z_x & z_y & z_z & 0 \newline
        0 & 0 & 0 & 1
    \end{matrix}\right)
    \left(\begin{matrix}
        1 & 0 & 0 & -t_x \newline
        0 & 1 & 0 & -t_y \newline
        0 & 0 & 1 & -t_z \newline
        0 & 0 & 0 & 1
    \end{matrix}\right) = 
    \left(\begin{matrix}
        x_x & x_y & x_z & -\vec{x}\cdot \vec{t} \newline
        y_x & y_y & y_z & -\vec{y}\cdot \vec{t} \newline
        z_x & z_y & z_z & -\vec{z}\cdot \vec{t} \newline
        0 & 0 & 0 & 1
    \end{matrix}\right)
$$

となります．

######  位置と回転を指定する方式

カメラの位置と回転を表す行列をそれぞれ$T,R$とすれば，

$$
    \vec{p}' = TR\vec{p}
$$

はカメラ座標系からワールド座標系に変換する式です．ここで逆行列を使えば

$$
    \vec{p} = R^{-1}T^{-1}\vec{p}' = (RT)^{-1}\vec{p}'
$$

となって，ワールド座標系からカメラ座標系に変換する式となります．さらに，回転行列の逆行列は転置行列，平行移動の逆行列は符号を反転したもの

$$
    T = \left(\begin{matrix}
        1 & 0 & 0 & t_x \newline
        0 & 1 & 0 & t_y \newline
        0 & 0 & 1 & t_z \newline
        0 & 0 & 0 & 1
    \end{matrix}\right), \quad
    T^{-1} = \left(\begin{matrix}
        1 & 0 & 0 & -t_x \newline
        0 & 1 & 0 & -t_y \newline
        0 & 0 & 1 & -t_z \newline
        0 & 0 & 0 & 1
    \end{matrix}\right)
$$

ですから，

$$
    R^{-1}T^{-1} = 
    \left(\begin{matrix}
        R \_ {11} & R \_ {21} & R \_ {31} & 0 \newline
        R \_ {12} & R \_ {22} & R \_ {32} & 0 \newline
        R \_ {13} & R \_ {23} & R \_ {33} & 0 \newline
        0 & 0 & 0 & 1
    \end{matrix}\right)
    \left(\begin{matrix}
        1 & 0 & 0 & -t_x \newline
        0 & 1 & 0 & -t_y \newline
        0 & 0 & 1 & -t_z \newline
        0 & 0 & 0 & 1
    \end{matrix}\right)
$$

と書くことも出来ます．

### 投影変換（projective transformation）

投影変換はとても重要な変換であり，ここは環境に依存する部分でもあります．投影変換は射影変換とも言われます．投影変換には近くのものが大きく，遠いものが小さくなる**透視投影変換**（perspective projection）と，奥行きによって変換しない**正投影変換**（orthogonal projection）があります．

投影変換の手順としては，まず，カメラから見える範囲を決めます．具体的には**前方クリッピング面**（near clipping plane）と**後方クリッピング面**（far clipping plane）というのを導入し，その空間内に入っているものだけが投影されるようにします．この領域を**ビューボリューム**（view volume）といい，透視投影変換では視錐台（view frustum），正投影変換では長方体の形になります．

次に，このビューボリュームの後方クリッピング面が$z=1$で，このときのビューボリュームの$x,y$が $-1\leq x\leq 1$, $-1\leq y\leq 1$となるように正規化します．このビューボリュームを**正規化ビューボリューム**といいます．

この時点でビューボリュームも正規化ビューボリュームもまだカメラ空間にありますが，正規化ビューボリュームを$-1\leq z\leq 1$の空間に変換します．この空間をクリップ空間（clip space）といい，この空間でのビューボリュームは**標準視体積**（canonical view volume）といいます．このとき，Zは奥の方向が正となって左手座標系になります．このクリップ空間は４次元の同次座標系になっていて，$x,y,z,w$で表されます．投影変換はカメラ空間からクリップ空間に変換することをいいます．

※DirectXなどはZの範囲が$[0,1]$になっているので注意が必要です．

クリップ空間の座標で$x,y,z$を$w$で除算することを**透視除算**といい，$x/w,y/w,z/w$となります．この透視除算した座標を**正規化デバイス座標**（normalized device coordinate）といいます．

######  透視投影変換

まずは透視投影変換から見ていきましょう．透視投影では近いほど大きく，遠いほど小さく見えます．次の図を見てください．

![1554621898018_half](https://storage.googleapis.com/zenn-user-upload/bcit5ohu7r2dxxg3wpg0e209kcao)

原点$O$の位置から点$P$を見たとき，点$P$を$z'=-1$の平面に投影すると，三角形$xoz$と$x'oz'$は相似の関係なので

$$
    x':x = z':z = -1:z, \quad \therefore x' = \frac{x}{-z}
$$

となります．これは$Y$についても同じです．よって

$$
    x' = x/-z, \quad y' = y/-z
$$

となります．次に投影面というのを考えます．これは先程の投影される平面のことで，$z'=-1$です．

![1554623777860_half](https://storage.googleapis.com/zenn-user-upload/z1evy3ejqfpxzlhcu2awpmzi1gyp)

また視野角を$90^{\circ}$とします．そうすると$z'$におけるXとYは$[-1,1]$になります．

![1554628026091_half](https://storage.googleapis.com/zenn-user-upload/4y7bc8hpduj1gq53peoff18032wk)

ここで，最初の透視変換の式と，投影面を考慮して行列で表すと次のようになります．

$$
    M_p = \left(\begin{matrix}
    1 & 0 & 0 & 0 \newline
    0 & 1 & 0 & 0 \newline
    0 & 0 & 1 & 0 \newline
    0 & 0 & -1 & 0 \end{matrix}\right)
$$

この行列で頂点$p$を座標変換すると

$$
    p' = M_p\cdot p = M_p \left(\begin{matrix}x \newline y \newline z \newline 1\end{matrix}\right) =
    \left(\begin{matrix}x \newline y \newline z \newline -z\end{matrix}\right)
$$

となります．$p \_ {w}'$で$p \_ {xyz}'$の各成分を除算すれば

$$
    \left(\begin{matrix}
        x/-z \newline y/-z \newline -1
    \end{matrix}\right)
$$

となります．次に正規化ビューボリュームの範囲$[-1,1]$に値を変換する必要があります．まずは$Z$値からですが，次のような1次関数を考えます．

$$
p \_ {z}' = az+b
$$

この行列は次のようになります．

$$
    M_w = \left(\begin{matrix}
    1 & 0 & 0 & 0 \newline
    0 & 1 & 0 & 0 \newline
    0 & 0 & a & b \newline
    0 & 0 & -1 & 0 \end{matrix}\right)
    \quad
    M_w \left(\begin{matrix}x \newline y \newline z \newline 1\end{matrix}\right) =
    \left(\begin{matrix}x \newline y \newline za+b \newline -z\end{matrix}\right)
$$

クリップ座標系は同次座標系ですので，$w$で各成分を割ることになります．透視投影ではこれを透視除算といい，透視除算した座標を正規化デバイス座標といいます．ここで

$$
p \_ {w}' = -z
$$

ですから，

$$
p \_ {z}' = az+b = -a\cdot p \_ {w}'+b
$$

という関係になります．また，正規化デバイス座標の$z \_ {ndc}$は

$$
    z \_ {ndc} = \frac{p \_ {z}'}{p \_ {w}'} = \frac{-a\cdot p \_ {w}'+b}{p \_ {w}'} = -a+\frac{b}{p \_ {w}'} = -a+\frac{b}{-z}
$$

となります．ここで，前方クリッピング面と後方クリッピング面を導入します．

![1554629530337_half](https://storage.googleapis.com/zenn-user-upload/5ccc1j6slu80pe9et8fot2rk1q5m)

この前方クリッピング面（$z=n$）のとき$z \_ {ndc}=-1$，後方クリッピング面（$z=f$）のとき$z \_ {ndc}=1$となるように，$a$と$b$を求めます．

$$
    -a+\frac{b}{-n} = -1, \quad -a+\frac{b}{-f} = 1, \quad \therefore b = -f(1+a)
$$

---

$$
    \begin{aligned}
    -a+\frac{b}{-n} &= -1 \newline
    a &= \frac{b}{-n}+1 = \frac{-f(1+a)}{-n}+1 = \frac{-f-af-n}{-n} = \frac{f+af+n}{n} \newline
    an &= f+af+n \newline
    an-af &= a(n-f) = f+n \newline
    a &= \frac{n+f}{n-f}
    \end{aligned}
$$

---

$$
    \begin{aligned}
    b &= -f(1+a) = -f-af \newline
      &= -f-f\left(\frac{n+f}{n-f}\right) \newline
      &= -\frac{nf-f^2}{n-f}-\frac{nf+f^2}{n-f} \newline
      &= \frac{nf+f^2-nf-f^2}{n-f} \newline
      &= \frac{-2nf}{n-f}
    \end{aligned}
$$

よって

$$
    \therefore a = \frac{n+f}{n-f}, \quad b = \frac{-2nf}{n-f}
$$

また，

$$
    p \_ {z}' = az+b = \frac{n+f}{n-f}z + \frac{-2nf}{n-f}
$$

行列に書き直せば

$$
    M_w = \left(\begin{matrix}
    1 & 0 & 0 & 0 \newline
    0 & 1 & 0 & 0 \newline
    0 & 0 & \frac{n+f}{n-f} & \frac{-2nf}{n-f} \newline
    0 & 0 & -1 & 0 \end{matrix}\right)
    \quad
    M_w \left(\begin{matrix}x \newline y \newline z \newline 1\end{matrix}\right) =
    \left(\begin{matrix}x \newline y \newline z\frac{n+f}{n-f}+\frac{-2nf}{n-f} \newline -z\end{matrix}\right)
$$

となります．ここで，$n=-1, f=-5$としたときの図を以下に示します．

![1554748535650_resize](https://storage.googleapis.com/zenn-user-upload/47h8ky78l55xbyttnebzwf9oje26)

この図では横軸が$z$，縦軸が$z \_ {ndc}$です．$z=-1$のとき$z \_ {ndc}=-1$，$z=-5$のとき$z \_ {ndc}=1$になっているのがわかります．

次に$l,r,t,b$を$[-1,1]$に収まるように拡大・縮小します．$z=-1$のとき$-1,1$，$z=-n$のとき$l,r$または$t,b$ですから，相似の関係から

$$
    \frac{1-(-1)}{-1}/\frac{r-l}{n} = \frac{-2n}{r-l}, \quad 
    \frac{1-(-1)}{-1}/\frac{t-b}{n} = \frac{-2n}{t-b}
$$

となります．これを行列表記すると

$$
    M_s = \left(\begin{matrix}
    \frac{-2n}{r-l} & 0 & 0 & 0 \newline
    0 & \frac{-2n}{t-b} & 0 & 0 \newline
    0 & 0 & 1 & 0 \newline
    0 & 0 & 0 & 1 \end{matrix}\right)
$$

となります．あとは，これまでZ軸がクリッピング面の中心を通っていることを想定していました．これがずれている場合に対処します．そのためにせん断を使います．前方クリッピング面での中心位置分をZ軸の値によって変化させてずらします．この行列は次のようになります．

$$
    M \_ {sh} = \left(\begin{matrix}
    1 & 0 & -\frac{r+l}{2}\frac{1}{n} & 0 \newline
    0 & 1 & -\frac{t+b}{2}\frac{1}{n} & 0 \newline
    0 & 0 & 1 & 0 \newline
    0 & 0 & 0 & 1 \end{matrix}\right)
    \quad
    M \_ {sh} \left(\begin{matrix}x \newline y \newline z \newline 1\end{matrix}\right) =
    \left(\begin{matrix}x-\frac{r+l}{2}\frac{z}{n} \newline y-\frac{t+b}{2}\frac{z}{n} \newline z \newline 1\end{matrix}\right)
$$

最終的に透視投影変換は

$$
    \begin{aligned}
    M_p = M_w M_s M \_ {sh} &= 
    \left(\begin{matrix}
    1 & 0 & 0 & 0 \newline
    0 & 1 & 0 & 0 \newline
    0 & 0 & \frac{n+f}{n-f} & \frac{-2nf}{n-f} \newline
    0 & 0 & -1 & 0 \end{matrix}\right)
    \left(\begin{matrix}
    \frac{-2n}{r-l} & 0 & 0 & 0 \newline
    0 & \frac{-2n}{t-b} & 0 & 0 \newline
    0 & 0 & 1 & 0 \newline
    0 & 0 & 0 & 1 \end{matrix}\right)
    \left(\begin{matrix}
    1 & 0 & -\frac{r+l}{2}\frac{1}{n} & 0 \newline
    0 & 1 & -\frac{t+b}{2}\frac{1}{n} & 0 \newline
    0 & 0 & 1 & 0 \newline
    0 & 0 & 0 & 1 \end{matrix}\right) \newline
    &= 
    \left(\begin{matrix}
        \frac{-2n}{r-l} & 0 & \frac{r+l}{r-l} & 0 \newline
        0 & \frac{-2n}{t-b} & \frac{t+b}{t-b} & 0 \newline
        0 & 0 & \frac{n+f}{n-f} & \frac{-2nf}{n-f} \newline
        0 & 0 & -1 & 0
    \end{matrix}\right)
    \end{aligned}
$$

となります．

この方法は汎用性が高いものの扱いづらいため，実際には画角とアスペクト比を使った方法がよく使われます．画角をfovy，アスペクト比をaspect(=幅/高さ)とすれば

$$
    M_p = \left(\begin{matrix}
    \frac{f}{aspect} & 0 & 0 & 0 \newline
    0 & f & 0 & 0 \newline
    0 & 0 & \frac{n+f}{n-f} & \frac{-2nf}{n-f} \newline
    0 & 0 & -1 & 0
    \end{matrix}\right)
$$

ここで

$$
    f = \frac{1}{\tan\left(\frac{fovy}{2}\right)} = \cot\left(\frac{fovy}{2}\right)
$$

となっています．

######  正投影変換

透視投影変換のときは奥行きによって見え方が変わらないので，$w$による透視除算がありません．正投影変換では，ビューボリュームの中心を原点に持ってきて，大きさを正規化するだけです．まずはビューボリュームの中心を原点にする平行移動を求めます．これは次のようになります．

$$
    M_t = \left(\begin{matrix}
        1 & 0 & 0 & -\frac{r+l}{2} \newline
        0 & 1 & 0 & -\frac{t+b}{2} \newline
        0 & 0 & 1 & -\frac{f+n}{2} \newline
        0 & 0 & 0 & 1
    \end{matrix}\right)
$$

各軸での中心を求めて移動しています．

次に正規化です．各軸がそれぞれ$[-1,1]$の範囲になるようにします．これは次のようになります．

$$
    M_s = \left(\begin{matrix}
        \frac{2}{r-l} & 0 & 0 & 0 \newline
        0 & \frac{2}{t-b} & 0 & 0 \newline
        0 & 0 & \frac{2}{f-n} & 0 \newline
        0 & 0 & 0 & 1
    \end{matrix}\right)
$$

よって，正投影変換の行列は

$$
\begin{aligned}
    M_o = M_s M_t &= 
    \left(\begin{matrix}
        \frac{2}{r-l} & 0 & 0 & 0 \newline
        0 & \frac{2}{t-b} & 0 & 0 \newline
        0 & 0 & \frac{2}{f-n} & 0 \newline
        0 & 0 & 0 & 1
    \end{matrix}\right)
    \left(\begin{matrix}
        1 & 0 & 0 & -\frac{r+l}{2} \newline
        0 & 1 & 0 & -\frac{t+b}{2} \newline
        0 & 0 & 1 & -\frac{f+n}{2} \newline
        0 & 0 & 0 & 1
    \end{matrix}\right) \newline &=
    \left(\begin{matrix}
        \frac{2}{r-l} & 0 & 0 & -\frac{r+l}{r-l} \newline
        0 & \frac{2}{t-b} & 0 & -\frac{t+b}{t-b} \newline
        0 & 0 & \frac{2}{f-n} & -\frac{f+n}{f-n} \newline
        0 & 0 & 0 & 1
    \end{matrix}\right)
\end{aligned}
$$

となります．次の図は正投影変換において$n=-1,f=-5$のときのグラフです．

![1554826933051_resize](https://storage.googleapis.com/zenn-user-upload/eyt3mgh0t247bmc635mjowqvd8h6)

### OpenGLの投影関数

OpenGLには投影変換行列を設定してくれる関数があります．`glFrustum`関数は前方クリッピング面の左右上下の座標$l,r,t,b$とZ軸の距離$n$，および遠方クリッピング面のZ軸の距離$f$を指定して，透視投影変換行列を設定します．`gluPerspective`関数は視野角(fovy)とアスペクト比(aspect)，前方・後方クリッピング面のZ軸の距離$n,f$を指定して，透視投影変換行列を設定します．`glOrtho`関数はクリッピング面の左右上下の座標$l,r,t,b$と前方・後方クリッピング面のZ軸の距離$n,f$を指定して正投影行列を設定します．これらの関数のドキュメントには行列の各要素が記載されています．その行列と，これまで導出してきた行列と比較してみるといくつか符号が違っているところがあります．これは，OpenGLの関数では$n,f$を正の値，導出した行列の$n,f$は負の値だからです．そのため，導出した行列をOpenGLの関数の行列と同じにするには$n,f$の符号を反転すればよいことになります．よって，それぞれの行列は

$$
    \begin{aligned}
        M \_ {frustum} &= 
        \left(\begin{matrix}
            \frac{-2(-n)}{r-l} & 0 & \frac{r+l}{r-l} & 0 \newline
            0 & \frac{-2(-n)}{t-b} & \frac{t+b}{t-b} & 0 \newline
            0 & 0 & \frac{(-n)+(-f)}{(-n)-(-f)} & \frac{-2(-n)(-f)}{(-n)-(-f)} \newline
            0 & 0 & -1 & 0
        \end{matrix}\right) = 
        \left(\begin{matrix}
            \frac{2n}{r-l} & 0 & \frac{r+l}{r-l} & 0 \newline
            0 & \frac{2n}{t-b} & \frac{t+b}{t-b} & 0 \newline
            0 & 0 & -\frac{f+n}{f-n} & \frac{-2nf}{f-n} \newline
            0 & 0 & -1 & 0
        \end{matrix}\right) \newline
        M \_ {perspective} &= 
        \left(\begin{matrix}
            \frac{f}{aspect} & 0 & 0 & 0 \newline
            0 & f & 0 & 0 \newline
            0 & 0 & \frac{(-n)+(-f)}{(-n)-(-f)} & \frac{-2(-n)(-f)}{(-n)-(-f)} \newline
            0 & 0 & -1 & 0
        \end{matrix}\right) =
        \left(\begin{matrix}
            \frac{f}{aspect} & 0 & 0 & 0 \newline
            0 & f & 0 & 0 \newline
            0 & 0 & -\frac{f+n}{f-n} & \frac{-2nf}{f-n} \newline
            0 & 0 & -1 & 0
        \end{matrix}\right) \newline
        M \_ {ortho} &= 
        \left(\begin{matrix}
            \frac{2}{r-l} & 0 & 0 & -\frac{r+l}{r-l} \newline
            0 & \frac{2}{t-b} & 0 & -\frac{t+b}{t-b} \newline
            0 & 0 & \frac{2}{(-f)-(-n)} & -\frac{(-f)+(-n)}{(-f)-(-n)} \newline
            0 & 0 & 0 & 1
        \end{matrix}\right) = 
        \left(\begin{matrix}
            \frac{2}{r-l} & 0 & 0 & -\frac{r+l}{r-l} \newline
            0 & \frac{2}{t-b} & 0 & -\frac{t+b}{t-b} \newline
            0 & 0 & \frac{2}{n-f} & -\frac{f+n}{f-n} \newline
            0 & 0 & 0 & 1
        \end{matrix}\right)
    \end{aligned}
$$

### ビューポート変換（viewport transformation）

投影変換によってクリップ空間に変換された座標は透視除算することで正規化デバイス座標に変換されます．

$$
    \vec{p} \_ {ndc} = \left(\begin{matrix}x/w \newline y/w \newline z/w\end{matrix}\right)
$$

この正規化デバイス座標系はXYZともに$-1$から$1$の範囲になっています．これを画面に表示するためにビューポート変換をします．画面のことをウィンドウとかスクリーンというので，ビューポート変換後をウィンドウ座標系やスクリーン座標系ともいいます．また，ビューポート変換をスクリーン座標変換ということもあります．

ビューポート変換ではスクリーンに表示する領域と位置を指定します．ここで，スクリーンの幅を$w$，高さを$h$，始点を$ox,oy$とおくとビューポート変換は

$$
    M_v = \left(\begin{matrix}
        \frac{w}{2} & 0 & 0 & \frac{w}{2}+ox \newline
        0 & -\frac{h}{2} & 0 & \frac{h}{2}+oy \newline
        0 & 0 & \frac{f-n}{2} & \frac{f+n}{2} \newline
        0 & 0 & 0 & 1
    \end{matrix}\right),
    \quad
    M_v \vec{p} \_ {ndc} = \left(\begin{matrix}
        x \frac{w}{2} + \frac{w}{2} + ox \newline
        -y \frac{h}{2} + \frac{h}{2} + oy \newline
        z \frac{f-n}{2} + \frac{f+n}{2} \newline
        1
    \end{matrix}\right)
$$

となります．$Y$が反転しているのは正規化デバイス座標系ではY軸の上が正に対して，スクリーンでは左上が原点でありY軸は下が正だからです．$Z$は$[n,f]$の間になるようにしています．通常は$n=0,f=1$です．

### 一般的な頂点データのパイプライン

レンダリングパイプラインの主要な座標変換を一通り見てきました．一般的に頂点データがどのような座標変換が適用されて画面に表示されるかを図にしてみました．

![1554646680440](https://storage.googleapis.com/zenn-user-upload/3yhvqigxx4oyb3rghqd525t7r3rr)

実際は環境によって変わる場合があると思いますので，この辺り触れる機会があれば，その環境のドキュメントを確認してください．

## おわりに

簡単にまとめるつもりが，なんか思っていた以上に長くなってしまった気がしますね．また，説明がまだ上手く出来ていないところが多々あるので反省．意見や感想，間違いの指摘など受け付けていますので，なにかあればよろしくおねがいします．また，少しでも参考になれば幸いです．

## 付録 A：Three.jsの深度の関数

Three.jsのシェーダコードには深度とZ値を変換する以下の関数があります．

- viewZToOrthographicDepth
- orthographicDepthToViewZ
- viewZToPerspectiveDepth
- perspectiveDepthToViewZ

例えば，深度の値からカメラ座標系でのZ値を求めれば，スクリーンの座標からカメラ座標系での座標(XYZ)を求めることができます．また，透視変換の場合は一般的に深度の値が線形になっていないため，線形に変換して使用することがあります．これらの関数のコードは次のようになっています．

```glsl
float viewZToOrthographicDepth(float viewZ, float near, float far) 
{
  return (viewZ + near) / (near - far);
}

float orthographicDepthToViewZ(float linearClipZ, float near, float far)
{
    return linearClipZ * (near - far) - near;
}

float viewZToPerspectiveDepth(float viewZ, float near, float far)
{
    return ((near + viewZ) * far) / ((far - near) * viewZ);
}

float perspectiveDepthToViewZ(float invClipZ, float near, float far) 
{
  return (near * far) / ((far - near) * invClipZ - far);
}
```

最初に，**perspectiveDepthToViewZ**から見ていきましょう．これを数式で表すと

$$
    viewZ = \frac{nf}{(f-n)\times invClipZ-f}
    \tag{1}
$$

となります．まず，これらの関数の**n**と**f**は正の値を指定します．よって，透視投影の式は

$$
\begin{aligned}
  p \_ {z}' &= az+b = \frac{n+f}{n-f}z + \frac{-2nf}{f-n} \newline
  a &= \frac{n+f}{n-f} \newline
  b &= \frac{-2nf}{f-n}
\end{aligned}
$$

です．また，正規化デバイス座標の$z \_ {ndc}$は次のようになります．

$$
  z \_ {ndc} = \frac{p \_ {z}'}{p \_ {w}'} = \frac{1}{-z}\left(\frac{n+f}{n-f}z + \frac{-2nf}{f-n}\right)
  \tag{2}
$$

正規化デバイス座標では$[-1,1]$の範囲になりますが，一般的に深度バッファに格納される深度値$depth$は$[0,1]$の範囲にビューポート変換されます．よって

$$
  depth = \frac{z \_ {ndc}}{2}+\frac{1}{2}, \qquad \therefore z \_ {ndc} = 2\cdot depth - 1
$$

これを式（２）に代入すると

$$
  2\cdot depth - 1 = \frac{1}{-z}\left(\frac{n+f}{n-f}z + \frac{-2nf}{f-n}\right)
$$

となります．$z$について解くと

$$
\begin{aligned}
  2\cdot depth - 1 &= \frac{1}{-z}\left(\frac{n+f}{n-f}z + \frac{-2nf}{f-n}\right) \newline
      &= -\frac{n+f}{n-f}+\frac{-2nf}{f-n}(-z) \newline
    2\cdot depth &= \frac{f+n}{f-n} + \frac{2nf}{(f-n)z} + 1 \newline
      &= \frac{(f+n)z}{(f-n)z} + \frac{2nf}{(f-n)z} + \frac{(f-n)z}{(f-n)z} \newline
      &= \frac{fz + nz + 2nf + fz - nz}{(f-n)z} \newline
      &= \frac{2fz + 2nf}{(f-z)n} \newline
    depth &= \frac{fz+nf}{(f-n)z} \qquad \qquad \text{\color{blue}(3)} \newline
      &= \frac{fz}{(f-n)z} + \frac{fn}{(f-n)z} = \frac{f}{f-n} + \frac{fn}{(f-n)z} \newline
    \frac{nf}{(f-n)z} &= depth - \frac{f}{f-n} \newline
    \frac{nf}{(f-n)z} &= \frac{(f-n)\cdot depth}{f-n} - \frac{f}{f-n} = \frac{(f-n)\cdot depth-f}{f-n} \newline
    \frac{(f-n)z}{nf} &= \frac{f-n}{(f-n)\cdot depth-f} \newline
    (f-n)z &= \frac{(f-n)nf}{(f-n)\cdot depth-f} \newline
    z &= \frac{nf}{(f-n)\cdot depth-f} \qquad \qquad \text{\color{blue}(4)}
\end{aligned}
$$

ここで式（１）と比べると

$$
  viewZ = \frac{nf}{(f-n)\times invClipZ-f}
$$

一致していますね．よって，**invClipZ**には**depth**を渡せばいいことになります．そして，**perspectiveDepthToViewZ**の逆関数**viewZToPerspectiveDepth**は**depth**について解けば式が得られます．式（３）から

$$
  depth = \frac{fz+nf}{(f-n)z} = \frac{(n+z)f}{(f-n)z}
$$

となって，**viewZToPerspectiveDepth**の実装と同じ式になっていることがわかります．今度は**orthographicDepthToViewZ**を見てみると

$$
  viewZ = linearClipZ * (n-f) - n
  \tag{5}
$$

となっています．こちらも$n$と$f$は正の値なので

$$
\begin{aligned}
  p \_ {z}' &= az+b = \frac{2}{n-f}z + \frac{n+f}{n-f} \newline
  a &= \frac{2}{n-f} \newline
  b &= \frac{n+f}{n-f}
\end{aligned}
$$

正規化デバイス座標の$z \_ {ndc}$は

$$
  z \_ {ndc} = \frac{p \_ {z}'}{p \_ {w}'} = \frac{p \_ {z}'}{1} = p \_ {z}'
  \tag{6}
$$

深度値$depth$は

$$
  depth = \frac{z \_ {ndc}}{2}+\frac{1}{2}, \qquad \therefore z \_ {ndc} = 2\cdot depth - 1
$$

これらの式から

$$
\begin{aligned}
  2\cdot depth - 1 &= \frac{2}{n-f}z + \frac{n+f}{n-f} \newline
  \frac{2}{n-f}z &= 2\cdot depth - 1 - \frac{n+f}{n-f} \newline
    &= \frac{2\cdot depth\cdot (n-f)}{n-f} - \frac{n-f}{n-f} - \frac{n+f}{n-f} \newline
    &= \frac{2\cdot depth\cdot (n-f)-n+f-n-f}{n-f} = \frac{2\cdot depth\cdot (n-f)-2n}{n-f} \newline
  2z &= 2\cdot depth\cdot (n-f)-2n \newline
   z &= depth\cdot (n-f)-n \qquad \qquad \text{\color{blue}(7)}
\end{aligned}
$$

となります．これは式（５）と一致します．また，**orthographicDepthToViewZ**の逆関数**viewZToOrthographicDepth**は

$$
\begin{aligned}
  depth\cdot(n-f)-n &= z \newline
  depth\cdot(n-f) &= z+n \newline
  depth &= \frac{z+n}{n-f}
\end{aligned}
$$

となります．

### 線形（リニア）深度

一般的に透視投影の深度は線形ではありません．これだと扱いづらいので，線形深度に変換して使用します．透視投影では深度が線形ではありませんが，正投影では線形深度になっています．

![1559404608_half](https://storage.googleapis.com/zenn-user-upload/2gwgrizz07hnzji81xerox4zcu0f)
図：透視投影の深度

![1559404642_half](https://storage.googleapis.com/zenn-user-upload/28pffrspdpvgqe2d5gvzgp736m0h)
図：正投影の深度

Three.jsでは**perspectiveDepthToViewZ**と**viewZToOrthographicDepth**を使って次のように線形深度に変換することができます．

```glsl
float getLinearDepth(float invClipZ, float near, float far)
{
  float viewZ = perspectiveDepthToViewZ(invClipZ, near, far);
  return viewZToOrthographicDepth(viewZ);
}
```

またperspectiveDepthをdepth，orthographicDepthをlinearDepthとおくと

$$
  linearDepth = \frac{z+n}{n-f}, \qquad 
  z = \frac{nf}{(f-n)\cdot depth-f}
$$

linearDepthについて解くと

$$
\begin{aligned}
linearDepth &= \frac{z+n}{n-f} \newline
(n-f)\cdot linearDepth &= z+n \newline
  &= \frac{nf}{(f-n)\cdot depth-f}+n \newline
  &= \frac{nf}{(f-n)\cdot depth-f} + \frac{\{(f-n)\cdot depth-f\}\cdot n}{(f-n)\cdot depth-f} \newline
  &= \frac{nf+n(f-n)\cdot depth-nf}{(f-n)\cdot depth-f} \newline
  &= \frac{n(f-n)\cdot depth}{(f-n)\cdot depth-f} \newline
-(f-n)\cdot linearDepth &= \frac{n(f-n)\cdot depth}{(f-n)\cdot depth-f} \newline
linearDepth &= \frac{-n\cdot depth}{(f-n)\cdot depth-f} \newline
  &= \frac{-n\cdot depth}{f\cdot depth - n\cdot depth - f} \newline
  &= \frac{-n\cdot depth}{f(depth-1) - n\cdot depth} 
\end{aligned}
$$

となります．よって，getLinearDepth関数は次のように書きかえることができます．

```glsl
  float getLinearDepth(float depth, float near, float far)
  {
    float nz = near * depth;
    return -nz / (far * (depth-1.0) - nz);
  }
```

## 参考文献

- CG-ARTS協会「コンピュータグラフィックス」CG-ARTS協会，2015
- 久富木隆一「ゲームアプリの数学　Unityで学ぶ基礎からシェーダまで」SBクリエイティブ株式会社，2015
- Yuki Ozawa「[深度バッファのレンジと精度を最大化する](https://qpp.bitbucket.io/translation/maximizing_depth_buffer_range_and/)」
- Brano Kemen「[Maximizing Depth Buffer Range and Precision](http://outerra.blogspot.com.ar/2012/11/maximizing-depth-buffer-range-and.html)
- 「[Three.js](https://threejs.org/)」
