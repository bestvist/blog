import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'
import { searchProPlugin } from 'vuepress-plugin-search-pro';
import { navbar } from './config/navbar';
import { sidebar } from './config/sidebar';

export default defineUserConfig({
  lang: 'zh-CN',
  title: 'bestvist blog',
  description: '技术小屋',
  head: [
        // 设置 favor.ico，.vuepress/public 下
        [
            'link', { rel: 'icon', href: '/images/logo.png' }
        ]
  ],
  theme: defaultTheme({
    logo: '/images/logo.png',
    navbar,
    sidebar,
  }),
  plugins: [
    searchProPlugin({
      indexContent: true,
      hotReload: true
    })
  ],
  bundler: viteBundler(),
})
