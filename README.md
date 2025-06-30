# Mebiusbox Software

Mebiusbox Software website (https://mebiusbox.github.io/) is built using [Docusaurus v3](https://docusaurus.io/).

## Swizzle

| Component           | Eject  |
| ------------------- | ------ |
| BlogPostItem/Footer | Unsafe |
| DocCard             | Unsafe |
| DocItem/Footer      | Unsafe |
| NotFound            | Safe   |

```shell
yarn swizzle @docusaurus/theme-classic --eject
```

## Note

### Error: Can't render static file for pathname XXX

Docusaurusをバージョンアップしてビルドすると表示されることがある．swizzleしたコンポーネントがあるかどうか確認．swizzleしたコンポーネントも最新にアップデートしないとビルドに失敗する．

It can sometimes appear when you upgrade Docusaurus and build. Check if there are any swizzled components. The build will fail if you don't update the swizzled components to the latest version as well.
