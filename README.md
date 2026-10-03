# rdcamelot 的个人主页

[Home](https://rdcamelot.github.io/) · [Academic](https://rdcamelot.github.io/academic.html)

个人介绍、兴趣与外部链接，以及独立的学术主页。当前页面使用原生 HTML、CSS 和 JavaScript，无构建步骤，也不需要 npm、PHP 或数据库。页面样式、脚本和图片均从本站加载；GitHub、Blog、Google Scholar 是外部导航链接，不是页面运行依赖。

两个页面共享深浅色偏好，默认使用深色主题。学术主页保留连续正文与 Publications，论文列表从本地 JSON 文件读取。

## 内容维护

| 要修改的内容 | 文件 |
| --- | --- |
| 首页介绍、名字的由来、兴趣和链接 | `index.html` |
| 学术简介、头像、所在地、Google Scholar 链接 | `academic.html` |
| 论文条目 | `static/data/academic.json` 的 `publications` 数组 |
| 首页布局、字体、配色与动效 | `static/home.css` |
| 学术页布局、字体与两套主题配色 | `static/academic.css` |
| 主题切换、导航高亮、入场动效与论文加载 | `static/home.js` |
| 头像与首页封面 | `static/images/icon.jpg`、`static/images/marlin.png` |

只调整介绍文字时，修改对应 HTML 即可。图片保持原始清晰度；替换图片后，应同步检查桌面与手机上的裁切位置。

### 添加论文

目前 `publications` 为空，页面显示“暂无公开论文”。有正式条目后，按显示顺序添加到数组中；页面不会自动排序，也不会从 Google Scholar 抓取内容。`news` 是旧版保留数据，当前页面不展示，无须维护。

下面仅为字段模板，不是实际论文；将占位内容替换为真实信息后再加入数组：

```json
{
  "year": "20XX",
  "title": "论文标题",
  "authors": "作者一，作者二",
  "description": "会议或期刊名称；简要介绍论文的贡献。",
  "links": [
    { "label": "PDF", "url": "" },
    { "label": "Code", "url": "" }
  ]
}
```

`authors` 为普通文本，正文中的 HTML 不会被解析。`links` 可留空数组；有链接时填写完整的 `https://` 地址或本站相对路径。空地址仅显示文字，不产生可点击链接。

## 本地预览

在仓库根目录运行任意静态 HTTP 服务器。例如，已安装 Python 3 时：

```sh
python -m http.server 8000 --bind 127.0.0.1
```

打开 [首页预览](http://127.0.0.1:8000/index.html) 或 [学术页预览](http://127.0.0.1:8000/academic.html)。端口被占用时换用其他端口。也可以使用 VS Code 的 Live Server。

直接打开 HTML 可查看基本页面，但浏览器可能阻止 `file://` 下的 JSON 请求，导致论文列表停留在 HTML 的默认提示。核对论文数据时请使用 HTTP 预览。

## 发布

站点由 GitHub Pages 发布，当前发布分支为 `master`。提交并推送站点变更后，在仓库的 Actions 中确认 Pages 部署成功，再检查线上页面。无需生成 `dist` 或上传构建产物。

发布前检查：

- 首页与 Academic 能互相跳转，外部链接指向正确地址。
- 深浅色主题切换正常，手机页面没有横向溢出。
- 头像、封面和论文列表正常加载，浏览器没有资源 404 或脚本错误。
- `static/data/academic.json` 是有效 JSON，论文与个人资料没有占位信息。

## 来源与旧版资源

Academic 手机端正文使用本站提供的 Noto Sans SC，字重为 350。字体分片按需加载，修改简介时不需要重新生成字体；来源与 SIL Open Font License 见 [static/fonts/noto-sans-sc/README.md](static/fonts/noto-sans-sc/README.md)。

项目最初基于 [KZHomePage](https://github.com/kaygb/KZHomePage)，保留原有 [MIT 许可证](LICENSE) 与作者署名。主题切换图标使用 Lucide，许可见 [static/icons/LICENSE.lucide.txt](static/icons/LICENSE.lucide.txt)。

当前发布版本已移除不再引用的 APlayer、Meting、layer、旧版样式和点击特效脚本，不再使用旧版的音乐、弹窗或远程语句接口。历史实现仍可在 Git 历史中查阅。原有图片与视频素材保留，不压缩、不随依赖清理删除。
