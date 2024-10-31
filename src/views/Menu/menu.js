import { ref } from "vue";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { emit, listen } from "@tauri-apps/api/event";
import { LogicalPosition } from "@tauri-apps/api/window";
import { TrayIcon } from "@tauri-apps/api/tray";
import { Menu } from "@tauri-apps/api/menu";

export let menuBoxWindowWidth = 150;
export let menuBoxWindowHeight = 320;

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

export async function CreateTraymenu() {
  console.log("---------------");

  let webview = new WebviewWindow("traymenu", {
    url: "/#/menu",
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
    visible: false,
  });

  const menu = await Menu.new({
    items: [
      {
        id: "hide",
        text: "关于金投",
      },
      {
        id: "quit",
        text: "退出金投",
      },
    ],
  });

  //   const options = {
  //     tooltip: "awesome tray tooltip",
  //     menu,
  //     menuOnLeftClick: false,
  //   };

  // tray

  //   TrayIcon.getById("tray").then(async (res) => {
  //     res.setMenu(menu);
  //   });

  // 托盘消息事件

  await webview.once("tauri://created", function () {
    // webview successfully created
    console.log("webview successfully created");
  });

  await webview.listen("tauri://window-created", async () => {
    console.log("traymenu create");
  });
  await webview.listen("tauri://blur", async () => {
    console.log("traymenu blur");
    const win = await WebviewWindow.getByLabel("traymenu");
    await win.hide();
  });
  await webview.listen("tauri://error", async (error) => {
    console.log("traymenu error!", error);
  });

  // 监听托盘右键菜单事件
  let trayEnterListen = listen("tray_contextmenu", async (event) => {
    console.log("托盘图标右键点击---show", event);

    const win = await WebviewWindow.getByLabel("traymenu");
    if (!win) return;

    let position = event.payload;
    if (win) {
      await win.setAlwaysOnTop(true);
      await win.setFocus();
      await win.setPosition(
        new LogicalPosition(position.x / getRatio(), position.y / getRatio() - menuBoxWindowHeight)
      );
      await win.show();
    }
  });

  // 监听托盘左键菜单事件
  listen("tray_mouseleftclick", async (event) => {
    console.log("托盘图标左键点击", event);
  });
}
