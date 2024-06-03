import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'
import { searchProPlugin } from 'vuepress-plugin-search-pro';
import { navbar } from './config/navbar';
import { sidebar } from './config/sidebar';

export default defineUserConfig({
  lang: 'zh-CN',
  title: 'bestvist blog',
  description: 'bestvist blog',
  theme: defaultTheme({
    logo: '/images/hero.png',
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
