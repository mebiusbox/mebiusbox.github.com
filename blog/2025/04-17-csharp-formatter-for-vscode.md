---
title: Visual Studio CodeのC#フォーマッタ設定
description: Visual Studio Code のフォーマット設定について
keywords:
  - Visual Studio Code
  - csharp
  - formatter
  - editorconfig
category: note
authors: [mebiusbox]
tags: [VS Code,C#]
image: https://og-image-mebiusbox.vercel.app/api/og?title=Visual+Studio+Code%e3%81%aeC%23%e3%83%95%e3%82%a9%e3%83%bc%e3%83%9e%e3%83%83%e3%82%bf%e8%a8%ad%e5%ae%9a&subtitle=Visual+Studio+Code+%e3%81%ae%e3%83%95%e3%82%a9%e3%83%bc%e3%83%9e%e3%83%83%e3%83%88%e8%a8%ad%e5%ae%9a%e3%81%ab%e3%81%a4%e3%81%84%e3%81%a6&date=2025%2F04%2F17&tags=VSCode,C%23
---

Visual Studio Code のC#フォーマッタの設定について解説します．

<!-- truncate -->

これまでは主にC#を使った開発は Visual Studio を使っていましたが、Visual Studio CodeでもC#のコードを書けるようにしたいです．
そこで、Visual Studio CodeでのC#フォーマッタについて備忘録として残しておきます．ただ、きちんと調べたわけではなく、正確な情報とは言えませんので注意してください．

## フォーマッタ

Visual Studio Code の拡張機能 [C#](https://marketplace.visualstudio.com/items/?itemName=ms-dotnettools.csharp) に入っています．
フォーマットしようとしたときに、標準のフォーマッタが指定されていないと表示されたら、以下の設定を追加します．

```json
"[csharp]": {
  "editor.defaultFormatter": "ms-dotnettools.csharp",
  "editor.formatOnSave": true
},
```

`editor.formatOnSave` を `true` に設定することで保存時にフォーマッタが実行されるようにしています．

ちなみに、コマンドラインからフォーマッタを実行する `dotnet-format` というツールもありますが、私が試したところ、あまり意図したフォーマットにならなかったり、ちょっと使いづらい印象でした．

## 設定

C#拡張機能にあるフォーマッタは `.editorconfig` ファイルを参照してくれます．なので、設定は `.editorconfig` ファイルに記述します．

### 基本設定

あらかじめ用意されている設定については [C# 書式設定オプション](https://learn.microsoft.com/ja-jp/dotnet/fundamentals/code-analysis/style-rules/csharp-formatting-options) を参照してください．以下は一例です．

```toml
[*.{cs,csx}]
# New Line Options
csharp_new_line_before_open_brace = none # "{"を新しい行に配置するか
csharp_new_line_before_else = false # "else"を新しい行に配置するか
csharp_new_line_before_catch = false # "catch"を新しい行に配置するか
csharp_new_line_before_finally = false # "finally"を新しい行に配置するか
csharp_new_line_before_members_in_object_initializers = true # オブジェクト初期化子のメンバーを別の行に配置するか
csharp_new_line_before_members_in_anonymous_types = true # 匿名型のメンバーを別の行に配置するか
csharp_new_line_between_query_expression_clauses = true # クエリ式の句の要素を別の行に配置するか

# Indentation Options
csharp_indent_block_contents = true # ブロックの内容をインデントするか
csharp_indent_braces = false # "{}"をインデントするか
csharp_indent_switch_labels = false # "switch" ラベルにインデントを付けるか
csharp_indent_case_contents = true # "switch" ケースにインデントを付けるか
csharp_indent_case_contents_when_block = false # "switch" ケースでのブロックをインデントするか
csharp_indent_labels = one_less_than_current # ラベルの配置位置

# Spacing Options
csharp_space_before_comma = false # コンマの前
csharp_space_after_comma = true # コンマの後
csharp_space_before_dot = false # ドットの前
csharp_space_after_dot = false # ドットの後
csharp_space_between_parentheses = false # "()"間
csharp_space_around_binary_operators = before_and_after # バイナリ演算子の前後
csharp_space_before_open_square_brackets = false # "["の前
csharp_space_between_square_brackets = false # "[]"の間
csharp_space_between_empty_square_brackets = false # 空の"[]"の間
csharp_space_after_cast = false # キャストの間
csharp_space_after_keywords_in_control_flow_statements = true # 制御フローステートメント(forなど)の後
csharp_space_before_semicolon_in_for_statement = false # forステートメントのセミコロンの前
csharp_space_after_semicolon_in_for_statement = true # forステートメントのセミコロンの後
csharp_space_around_declaration_statements = false # 宣言ステートメントの余計な空白文字. "false"なら削除
csharp_space_between_method_declaration_name_and_open_parenthesis = false # メソッド宣言のメソッド名と始め括弧の間
csharp_space_between_method_declaration_parameter_list_parentheses = false # メソッド宣言パラメータのリスト始めと終わり
csharp_space_between_method_declaration_empty_parameter_list_parentheses = false # メソッド宣言の空パラメータのリスト始めと終わり
csharp_space_between_method_call_name_and_opening_parenthesis = false # メソッド呼び出し名と始め括弧の間
csharp_space_between_method_call_parameter_list_parentheses = false # メソッド呼び出しの始め括弧と終わり括弧
csharp_space_between_method_call_empty_parameter_list_parentheses = false # 空パラメータのメソッド呼び出しの始め括弧と終わり括弧
csharp_space_before_colon_in_inheritance_clause = true # 型宣言の":"前
csharp_space_after_colon_in_inheritance_clause = true # 型宣言の":"後

# Wrap Options
csharp_preserve_single_line_statements = false # 1行に複数のステートメントとメンバー宣言を表示
csharp_preserve_single_line_blocks = true # コードブロックを単一行に配置
```

### 命名規則の拡張

整形以外に、命名規則のルールを設定できます．設定は `.editorconfig` に記述します．命名規則のルールを追加するには、3つのエンティティ（スタイル・シンボル・ルール）を記述する必要があります．詳しくは [コードスタイルの名前付けルール](https://learn.microsoft.com/ja-jp/dotnet/fundamentals/code-analysis/style-rules/naming-rules) にあります．スタイルで、PascalCaseやcamelCase、アンダースコアなどを指定します．シンボルではルールを適用するシンボルの種類を指定します．そして、ルールでスタイルとシンボルを指定することで命名規則ルールが適用されます．

エンティティは `AAA.BBB.CCC` という形で指定します．`AAA`はどのエンティティかを指定します．

| 名前                  | エンティティ |
| --------------------- | ------------ |
| dotnet_naming_style   | スタイル     |
| dotnet_naming_symbols | シンボル     |
| dotnet_naming_rule    | ルール       |

次に `BBB` はエンティティ名となります．好きな名前を指定できます．たとえば、`dotnet_naming_style.pascal_case` としたら、`pascal_case`という名前のスタイルになります．

そして、`CCC`でそれぞれのカテゴリに関するプロパティを設定します．たとえば、`PascalCase`のスタイルを指定する場合

```toml
dotnet_naming_style.pascal_case.capitalization = pascal_case
```

という様になります．`camelCase`なら

```toml
dotnet_naming_style.camel_case.capitalization = camel_case
```

となります．また、アンダースコア（`_`）と`camelCase`を組み合わせる場合は次のようになります．

```toml
dotnet_naming_style.camel_case_and_prefix_with_underscore.required_prefix = _
dotnet_naming_style.camel_case_and_prefix_with_underscore.capitalization = camel_case
```

他にインターフェイスクラスで接頭辞を`I`、`PascalCase`にしたい場合は次のようになります．

```toml
dotnet_naming_style.pascal_case_and_prefix_with_I.required_prefix = I
dotnet_naming_style.pascal_case_and_prefix_with_I.capitalization = pascal_case
```

以下はスタイルの設定例です．

```toml
dotnet_naming_style.camel_case.capitalization = camel_case
dotnet_naming_style.pascal_case.capitalization = pascal_case
dotnet_naming_style.camel_case_and_prefix_with_underscore.required_prefix = _
dotnet_naming_style.camel_case_and_prefix_with_underscore.capitalization = camel_case
dotnet_naming_style.pascal_case_and_prefix_with_I.required_prefix = I
dotnet_naming_style.pascal_case_and_prefix_with_I.capitalization = pascal_case
dotnet_naming_style.pascal_case_and_prefix_with_T.required_prefix = T
dotnet_naming_style.pascal_case_and_prefix_with_T.capitalization = pascal_case
```

次に、シンボルでは `applicable_kinds`、`applicable_accessibilities`、`required_modifiers` などを指定します．以下は一例です．

```toml
# Naming Symbols

# Interfaces
dotnet_naming_symbols.interface.applicable_kinds = interface
dotnet_naming_symbols.interface.applicable_accessibilities = *

# Type parameters
dotnet_naming_symbols.type_parameter_symbols.applicable_kinds = type_parameter
dotnet_naming_symbols.type_parameter_symbols.applicable_accessibilities = *

# Constants
dotnet_naming_symbols.constant.applicable_kinds = field
dotnet_naming_symbols.constant.required_modifiers = const
dotnet_naming_symbols.constant.applicable_accessibilities = *

# Pascal most of the things
dotnet_naming_symbols.pascal.applicable_kinds = class, struct, enum, property, method, event, namespace, delegate, local_function
dotnet_naming_symbols.pascal.applicable_accessibilities = *

# Parameters, locals
dotnet_naming_symbols.locals_and_parameters.applicable_kinds = parameter, local
dotnet_naming_symbols.locals_and_parameters.applicable_accessibilities = *

# Private fields
dotnet_naming_symbols.private_or_internal_field.applicable_kinds = field
dotnet_naming_symbols.private_or_internal_field.applicable_accessibilities = internal, private
dotnet_naming_symbols.private_or_internal_field.required_modifiers =

# Public fields
dotnet_naming_symbols.public_field.applicable_kinds = field
dotnet_naming_symbols.public_field.applicable_accessibilities = public, internal, friend, protected, protected_internal, protected_friend, private_protected
```

これまで定義したスタイルとシンボルを組合せてルールを定義します．たとえば、インターフェイスクラスの命名規則として `I` + `PascalCase` を指定する場合は次のようになります．

```toml
dotnet_naming_rule.interfaces_must_be_pascal_cased_and_prefixed_with_I.symbols = interface
dotnet_naming_rule.interfaces_must_be_pascal_cased_and_prefixed_with_I.style = pascal_case_and_prefix_with_I
dotnet_naming_rule.interfaces_must_be_pascal_cased_and_prefixed_with_I.severity = warning
```

`severity` は重要度で警告やエラーなどを指定できます．

| 重要度     | 動作                                        |
| ---------- | ------------------------------------------- |
| error      | エラー                                      |
| warning    | 警告                                        |
| suggestion | メッセージ．IDEでは修正候補として表示される |
| silent     | 非表示                                      |
| none       | 無視                                        |
| default    | 既定の動作                                  |

以下はルールの一例です．

```toml
# Naming Rules

# Interfaces
dotnet_naming_rule.interfaces_must_be_pascal_cased_and_prefixed_with_I.symbols = interface
dotnet_naming_rule.interfaces_must_be_pascal_cased_and_prefixed_with_I.style = pascal_case_and_prefix_with_I
dotnet_naming_rule.interfaces_must_be_pascal_cased_and_prefixed_with_I.severity = warning

# Type parameters
dotnet_naming_rule.type_parameters_must_be_pascal_cased_and_prefixed_with_T.symbols = type_parameter
dotnet_naming_rule.type_parameters_must_be_pascal_cased_and_prefixed_with_T.style = pascal_case_and_prefix_with_T
dotnet_naming_rule.type_parameters_must_be_pascal_cased_and_prefixed_with_T.severity = warning

# Pascal most of the things
dotnet_naming_rule.externally_visible_members_must_be_pascal_cased.symbols = pascal
dotnet_naming_rule.externally_visible_members_must_be_pascal_cased.style = pascal_case
dotnet_naming_rule.externally_visible_members_must_be_pascal_cased.severity = warning

# Parameters, locals
dotnet_naming_rule.parameters_must_be_camel_cased.symbols = locals_and_parameters
dotnet_naming_rule.parameters_must_be_camel_cased.style = camel_case
dotnet_naming_rule.parameters_must_be_camel_cased.severity = warning

# Constants
dotnet_naming_rule.constants_must_be_pascal_cased.symbols = constant
dotnet_naming_rule.constants_must_be_pascal_cased.style = pascal_case
dotnet_naming_rule.constants_must_be_pascal_cased.severity = warning

# Public fields
dotnet_naming_rule.public_instance_fields_must_be_camel_cased_and_prefixed_with_underscore.symbols = public_field
dotnet_naming_rule.public_instance_fields_must_be_camel_cased_and_prefixed_with_underscore.style = pascal_case
dotnet_naming_rule.public_instance_fields_must_be_camel_cased_and_prefixed_with_underscore.severity = warning

# Private fields
dotnet_naming_rule.private_instance_fields_must_be_camel_cased_and_prefixed_with_underscore.symbols = private_or_internal_field
dotnet_naming_rule.private_instance_fields_must_be_camel_cased_and_prefixed_with_underscore.style = camel_case_and_prefix_with_underscore
dotnet_naming_rule.private_instance_fields_must_be_camel_cased_and_prefixed_with_underscore.severity = warning
```

実際の `.editorconfig` については [こちら](https://gist.github.com/mebiusbox/c660eee4639989e8f1ebe1a3b80e5ade)を参照してください．

## コード分析の設定

余談ですが、他にもコード分析の設定を `.editorconfig` に記述できます．詳しくは [コード分析の構成オプション](https://learn.microsoft.com/ja-jp/dotnet/fundamentals/code-analysis/configuration-options#severity-level) を参照してください．たとえば、[IDE0044](https://learn.microsoft.com/ja-jp/dotnet/fundamentals/code-analysis/style-rules/ide0044)を無効にしたい場合、次のように指定します．

```toml
dotnet_diagnostic.IDE0044.severity = none
```

以上です．
