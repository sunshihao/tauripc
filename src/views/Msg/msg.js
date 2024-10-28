import { WebviewWindow } from '@tauri-apps/api/webviewWindow'
import { emit, listen } from '@tauri-apps/api/event'
import { LogicalPosition } from '@tauri-apps/api/window'

export let messageBoxWindowWidth = 280
export let messageBoxWindowHeight = 100

export default async function CreateMsgBox() {
    console.log('start create msgbox...')

    let webview = new WebviewWindow("msgbox", {
        url: "/msg",
        title: "消息通知",
        width: messageBoxWindowWidth,
        height: messageBoxWindowHeight,
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
        console.log('msgbox create')
    })
    await webview.listen('tauri://blur', async () => {
        console.log('msgbox blur')
        const win = await WebviewWindow.getByLabel('msgbox')
        await win.hide()
    })
    await webview.listen('tauri://error', async(error) => {
        console.log('msgbox error!', error)
    })


    // 监听托盘事件
    let trayEnterListen = listen('tray_mouseenter', async (event) => {
        // console.log(event)

        const win = await WebviewWindow.getByLabel('msgbox')
        if(!win) return

        let position = event.payload
        if(win) {
            await win.setAlwaysOnTop(true)
            await win.setFocus()
            await win.setPosition(new LogicalPosition(position.x - messageBoxWindowWidth / 2, window.screen.availHeight - messageBoxWindowHeight))
            await win.show()
        }
    })
    let trayLeaveListen = listen('tray_mouseleave', async (event) => {
        console.log(event)
        const win = await WebviewWindow.getByLabel('msgbox')
        await win.hide()
    })
}