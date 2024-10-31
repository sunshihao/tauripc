<!--托盘右键菜单模板-->
<script setup>
	import { ref } from 'vue'
	import { WebviewWindow } from "@tauri-apps/api/webviewWindow"
	import { TrayIcon } from '@tauri-apps/api/tray'
	// import { invoke } from '@tauri-apps/api/core'

    // import { Menu } from '@tauri-apps/api/menu';


    const logged = true

    const handleMainShow = async () => {
        const traywin = await WebviewWindow.getByLabel('traymenu')
        await traywin.hide()

        const homewin = await WebviewWindow.getByLabel('main')
        await homewin.show()
        await homewin.unminimize()
        await homewin.setFocus()
    }
	
	// 设置一个托盘闪烁定时器
    const flashTimer = ref(false)
    const flashTray = async(bool) => {
        let flag = true
        if(bool) {
            TrayIcon.getById('tray').then(async(res) => {
                clearInterval(flashTimer.value)
                flashTimer.value = setInterval(() => {
                    if(flag) {
                        res.setIcon(null)
                    }else {
                        // res.setIcon(defaultIcon)
                        // 支持把自定义图标放在默认icons文件夹，通过如下方式设置图标
                        // res.setIcon('icons/msg.png')
                        // 支持把自定义图标放在自定义文件夹tray，需要配置tauri.conf.json参数 "bundle": {"resources": ["tray"]}
                        res.setIcon('tray/msg.png')
                    }
                    flag = !flag
                }, 500)
            })
        }else {
            clearInterval(flashTimer.value)
            let tray = await TrayIcon.getById("tray")
            tray.setIcon('icons/icon.png')
        }
    }
</script>

<template>
    <div class="traymenu">
        <p class="item">😍 我在线上</p>
        <p class="item">😎 隐身</p>
        <!-- <p class="item">😏 离开</p>
        <p class="item">😱 忙碌</p> -->
        <!-- <p class="item">关闭所有声音</p> -->
        <p class="item" @click="flashTray(true)">开启图标闪烁</p>
        <p class="item" @click="flashTray(false)">关闭图标闪烁</p>
        <p class="item" @click="handleMainShow">👀 打开主面板</p>
        <p class="item">💍 退出</p>
    </div>
</template>
