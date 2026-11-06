# cx-amazon-seller

一个 [pi](https://pi.dev) 包，告诉模型它在和谁对话：一位在亚马逊上做生意的人。

它只有一个扩展。每次运行前，它会在 pi 自己的系统提示词里加入一段以包名命名的内容：

```
<cx-amazon-seller>
The person you talk with runs a business selling on Amazon and comes to you for the work of that business.
</cx-amazon-seller>
```

只有一句话，每次请求都会带上。它不提任何工具、数据源或命令：模型能为这位卖家做什么，取决于和它一起安装的其他包。这段内容通过 pi 的结构化提示词选项加入，所以 pi 自己的各段内容和其他包的内容都保持原样，没有任何强行改动。面向其他电商平台的包会加入以自己命名的一段，不替换任何已有内容。

为什么用一段提示词而不用技能：这段内容从第一条消息起就在提示词里，而技能的正文只有在模型判断相关时才会读取。

## 依赖

只需要 pi。它不联网、不读任何文件，也不保存任何设置。

## 安装

```bash
pi install npm:cx-amazon-seller        # 为你自己安装，写入 ~/.pi/agent/settings.json
pi install -l npm:cx-amazon-seller     # 为单个项目安装，写入 .pi/settings.json
pi remove npm:cx-amazon-seller
```

在 [ComChatX](https://comchatx.com) 上，卖家在「插件」页安装。

## 开发

```bash
npm ci
npm run typecheck
npm test               # 构建 dist/，并用锁定版本的 pi 加载
```

源码在 `src/extensions/`；`npm run build` 把其中每个文件分别打包到 `dist/extensions/`，也就是这个包的 `pi` 清单指定的文件夹；pi 自己的包不打进去，由 pi 提供。测试在 `test/` 下：pi 会加载扩展文件夹中的每个模块，所以构建时会拒绝那里任何不是扩展的文件。

## 许可证

MIT。见 [LICENSE](LICENSE)。
