import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
// import { Webview } from "@tauri-apps/api/webview";
import { Window } from "@tauri-apps/api/window";

import { emit, listen } from "@tauri-apps/api/event";
import { LogicalPosition } from "@tauri-apps/api/window";

export let messageBoxWindowWidth = 280;
export let messageBoxWindowHeight = 100;

function getRatio() {
  var ratio = 0;
  var screen = window.screen;
  var ua = navigator.userAgent.toLowerCase();

  if (window.devicePixelRatio !== undefined) {
    ratio = window.devicePixelRatio;
  } else if (~ua.indexOf("msie")) {
    if (screen.deviceXDPI && screen.logicalXDPI) {
      ratio = screen.deviceXDPI / screen.logicalXDPI;
    }
  } else if (
    window.outerWidth !== undefined &&
    window.innerWidth !== undefined
  ) {
    ratio = window.outerWidth / window.innerWidth;
  }

  // if (ratio) {
  //   ratio = Math.round(ratio * 100);
  // }
  return ratio;
}

// 闪烁通知
export async function CreateMsgBox() {
  // const appWindow = new Window("msgbox");

  console.log("start create msgbox...");

  console.log("window.screen.width~~~", window.screen);

  let webview = new WebviewWindow("msgbox", {
    url: "/#/msg",
    title: "消息通知",
    width: messageBoxWindowWidth,
    height: messageBoxWindowHeight,
    skipTaskbar: true,
    decorations: false,
    center: false,
    resizable: false,
    alwaysOnTop: true,
    focus: true,
    x: 50,
    y: 50,
    visible: false,
  });

  const sysRatio = getRatio()

  console.log("getRatiogetRatio----", sysRatio);

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

    console.log("position---", position);
    console.log("position---11", position.x - messageBoxWindowWidth / 2);
    console.log(
      "position---22",
      window.screen.availHeight - messageBoxWindowHeight
    );

    if (win) {
      await win.setAlwaysOnTop(true);
      await win.setFocus();
      // TODO
      await win.setPosition(
        new LogicalPosition(
          position.x / 1.5 - messageBoxWindowWidth / 2,
          window.screen.availHeight - messageBoxWindowHeight
        )
      );
      console.log("弹窗展示");
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
