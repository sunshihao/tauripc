import { ref } from 'vue'
import { WebviewWindow } from '@tauri-apps/api/webviewWindow'
import { emit, listen } from '@tauri-apps/api/event'
import { LogicalPosition } from '@tauri-apps/api/window'
import { TrayIcon } from '@tauri-apps/api/tray'
import { invoke } from '@tauri-apps/api/core'

export let menuBoxWindowWidth = 150
export let menuBoxWindowHeight = JSON.parse(localStorage.getItem('logged')) ? 320 : 45

export default async function CreateTraymenu() {
    let webview = new WebviewWindow("traymenu", {
        url: "/menu",
        title: "通知提醒",
        width: menuBoxWindowWidth,
        height: menuBoxWindowHeight,
        skipTaskbar: true,
        decorations: false,
        center: false,
        resizable: false,
        alwaysOnTop: true,
        focus: true,
        x: window.screen.width + 50,
        y: window.screen.height + 50,
        visible: false
    })

    // 托盘消息事件
    await webview.listen('tauri://window-created', async () => {
        console.log('traymenu create')
    })
    await webview.listen('tauri://blur', async () => {
        console.log('traymenu blur')
        const win = await WebviewWindow.getByLabel('traymenu')
        await win.hide()
    })
    await webview.listen('tauri://error', async(error) => {
        console.log('traymenu error!', error)
    })

    // 监听托盘右键菜单事件
    let trayEnterListen = listen('tray_contextmenu', async (event) => {
        const win = await WebviewWindow.getByLabel('traymenu')
        if(!win) return

        let position = event.payload
        if(win) {
            await win.setAlwaysOnTop(true)
            await win.setFocus()
            await win.setPosition(new LogicalPosition(position.x, position.y - menuBoxWindowHeight))
            await win.show()
        }
    })
}
