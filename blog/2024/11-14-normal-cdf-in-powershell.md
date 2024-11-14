---
title: PowerShellで標準正規分布の累積密度関数の値を計算する
description: PowerShellで標準正規分布の累積密度関数(CDF)の値を計算する方法
keywords:
  - PowerShell
  - Statistics
category: note
authors: [mebiusbox]
tags: [powershell]
image: https://og-image-mebiusbox.vercel.app/api/og?title=PowerShell%e3%81%a7%e6%a8%99%e6%ba%96%e6%ad%a3%e8%a6%8f%e5%88%86%e5%b8%83%e3%81%ae%e7%b4%af%e7%a9%8d%e5%af%86%e5%ba%a6%e9%96%a2%e6%95%b0%e3%81%ae%e5%80%a4%e3%82%92%e8%a8%88%e7%ae%97%e3%81%99%e3%82%8b&subtitle=PowerShell%e3%81%a7%e6%a8%99%e6%ba%96%e6%ad%a3%e8%a6%8f%e5%88%86%e5%b8%83%e3%81%ae%e7%b4%af%e7%a9%8d%e5%af%86%e5%ba%a6%e9%96%a2%e6%95%b0(CDF)%e3%81%ae%e5%80%a4%e3%82%92%e8%a8%88%e7%ae%97%e3%81%99%e3%82%8b%e6%96%b9%e6%b3%95&date=2024%2F11%2F14&tags=powershell
---

PowerShellで標準正規分布の累積密度関数を求める方法（近似）を紹介します．

<!-- truncate -->

検索してみると、「[Math.Net Numerics](https://numerics.mathdotnet.com/)」を使う方法が見つかりますが、今回は、外部モジュールに依存しないかたちで実装します．

ここでは、標準正規分布の累積密度関数を求めるために、誤差関数を使います．そして、誤差関数は近似式を使って実装します．

```powershell
function Get-ErrorFunction() {
  [CmdletBinding()]
  param(
    [double]$x
  )

  # https://en.wikipedia.org/wiki/Error_function
  $a1 = 0.254829592
  $a2 = -0.284496736
  $a3 = 1.421413741
  $a4 = -1.453152027
  $a5 = 1.061405429
  $p = 0.3275911

  $sign = [Math]::Sign($x)
  $x = [Math]::Abs($x)

  $t = 1.0 / (1.0 + $p * $x)
  $t2 = $t*$t
  $t3 = $t2*$t
  $t4 = $t3*$t
  $t5 = $t4*$t
  $y = ($a1*$t + $a2*$t2 + $a3*$t3 + $a4*$t4 + $a5*$t5)
  return $sign * (1.0 - $y * [Math]::Exp(-$x*$x))
}
```

この近似式については「[Wikipedia](https://en.wikipedia.org/wiki/Error_function)」を参照してください．
また、この近似式による計算誤差は最大で $1.5\times 10^\{-7\}$ ということです．
あとは、この誤差関数を使って累積密度関数の値を計算します．

```powershell
function Get-NormalCDF() {
    [CmdletBinding()]
    param(
        [double]$x
    )

    # https://en.wikipedia.org/wiki/Normal_distribution
    return 0.5 * (1.0 + (Get-ErrorFunction($x / [Math]::Sqrt(2))))
}
```

この計算式については、「[Wikipedia](https://en.wikipedia.org/wiki/Normal_distribution)」を参照してください．
テストコードと結果は次のようになりました．

```powershell
function Test-ErrorFunction() {
    $testValues = @(0.0, 0.2, 0.5, 0.75, 1.0)
    $expectValues = @(0.0, 0.222702, 0.520499, 0.711155, 0.842700)
    $i = 0
    foreach ($value in $testValues) {
        $result = Get-ErrorFunction $value
        $expect = $expectValues[$i]
        Write-Host "P(X ≤ $value) = $result (expect = $expect)"
        $i++
    }
}

function Test-NormalCDF() {
    $testValues = @(0.0, 0.5, 1.0, 1.333333, 1.5, 2.0)
    $expectValues = @(0.0, 0.1915, 0.3413, 0.408788726, 0.4332, 0.4773)
    $i = 0
    foreach ($value in $testValues) {
        $result = Get-NormalCDF $value
        $expect = $expectValues[$i] + 0.5
        Write-Host "P(X ≤ $value) = $result (expect = $expect)"
        $i++
    }
}
```

```powershell
PS > Test-ErrorFunction
P(X ≤ 0) = 0 (expect = 0)
P(X ≤ 0.2) = 0.222702457858316 (expect = 0.222702)
P(X ≤ 0.5) = 0.520500016304747 (expect = 0.520499)
P(X ≤ 0.75) = 0.711155569636656 (expect = 0.711155)
P(X ≤ 1) = 0.84270068974759 (expect = 0.8427)

PS > Test-NormalCDF
P(X ≤ 0) = 0.5 (expect = 0.5)
P(X ≤ 0.5) = 0.691462462723994 (expect = 0.6915)
P(X ≤ 1) = 0.841344736167636 (expect = 0.8413)
P(X ≤ 1.333333) = 0.908788660560468 (expect = 0.908788726)
P(X ≤ 1.5) = 0.933192769023498 (expect = 0.9332)
P(X ≤ 2) = 0.977249937112744 (expect = 0.9773)
```

以上です．
