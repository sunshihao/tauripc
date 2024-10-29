// import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Webview } from "@tauri-apps/api/webview";
import { Window } from "@tauri-apps/api/window"

import { emit, listen } from "@tauri-apps/api/event";
import { LogicalPosition } from "@tauri-apps/api/window";

export let messageBoxWindowWidth = 280;
export let messageBoxWindowHeight = 100;

// 闪烁通知
export async function CreateMsgBox() {
  const appWindow = new Window("msgbox");

  console.log("start create msgbox...");

  // let webview = new WebviewWindow("msgbox", {
  //     url: 'https://github.com/tauri-apps/tauri',
  //     title: "消息通知",
  //     width: messageBoxWindowWidth,
  //     height: messageBoxWindowHeight,
  //     skipTaskbar: true,
  //     decorations: false,
  //     center: false,
  //     resizable: false,
  //     alwaysOnTop: true,
  //     focus: true,
  //     x: window.screen.width + 50,
  //     y: window.screen.height + 50,
  //     visible: false
  // })

  const webview = new Webview(appWindow, "theUniqueLabel", {
    url: "msg",
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
    visible: false,
  });

  // const webview = new WebviewWindow("msgbox", {
  //   url: "/msg", // 新窗口加载的页面
  //   title: "消息通知",
  //   width: 800,
  //   height: 600,
  //   skipTaskbar: true,
  //   decorations: false,
  //   center: false,
  //   resizable: false,
  //   alwaysOnTop: true,
  //   focus: true,
  //   x: window.screen.width + 50,
  //   y: window.screen.height + 50,
  //   visible: false,
  // });

  console.log("webview----", webview);

  await webview.listen("tauri://created", function () {
    console.log("新窗口创建成功");
  });

  // 托盘消息事件
  await webview.listen("tauri://window-created", async () => {
    console.log("msgbox create");
  });
  await webview.listen("tauri://blur", async () => {
    console.log("msgbox blur");
    const win = await WebviewWindow.getByLabel("msgbox");
    await win.hide();
  });
  await webview.listen("tauri://error", async (error) => {
    console.log("msgbox error!", error);
  });

  // 监听托盘事件
  let trayEnterListen = listen("tray_mouseenter", async (event) => {
    console.log(event);

    const win = await WebviewWindow.getByLabel("msgbox");
    if (!win) return;

    let position = event.payload;
    if (win) {
      await win.setAlwaysOnTop(true);
      await win.setFocus();
      await win.setPosition(
        new LogicalPosition(
          position.x - messageBoxWindowWidth / 2,
          window.screen.availHeight - messageBoxWindowHeight
        )
      );
      await win.show();
    }
  });
  let trayLeaveListen = listen("tray_mouseleave", async (event) => {
    console.log(event);
    const win = await WebviewWindow.getByLabel("msgbox");

    if (!win) return;
    await win.hide();
  });
}
