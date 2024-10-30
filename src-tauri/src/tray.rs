// mod tray_handler;

use std::{thread, time};
use tauri::{
    menu::{Menu, MenuItem},
    tray::{self, MouseButton, TrayIcon, TrayIconBuilder, TrayIconEvent},
    Emitter, Manager, Runtime,
};

// use tray_handler::TrayHandler;

// 托盘菜单定义设置
pub fn create_tray<R: tauri::Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
    // 初始化 TrayHandler 实例
    // let tray_id = "tray".to_string();
    // let tray_handler: TrayHandler = TrayHandler::new(tray_id.clone());

    let quit_st =
        tauri::menu::MenuItem::with_id(app, "trun_on_flashing", "开启闪烁", true, None::<&str>)?;
    let quit_sp =
        tauri::menu::MenuItem::with_id(app, "trun_off_flashing", "关闭闪烁", true, None::<&str>)?;
    let quit_sw = tauri::menu::MenuItem::with_id(app, "show", "显示", true, None::<&str>)?;
    let quit_he = tauri::menu::MenuItem::with_id(app, "hide", "隐藏", true, None::<&str>)?;
    let quit_qe = tauri::menu::MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;

    let menu =
        tauri::menu::Menu::with_items(app, &[&quit_st, &quit_sp, &quit_sw, &quit_he, &quit_qe])?;

    // 创建托盘图标
    let _tray = tauri::tray::TrayIconBuilder::with_id("tray")
        // .menu(&menu)
        .tooltip("tauri")
        .icon(app.default_window_icon().unwrap().clone())
        .on_menu_event(move |app, event| {
            match event.id.as_ref() {
                "quit" => {
                    app.exit(0);
                }
                "show" => {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.show();
                    }
                }
                "hide" => {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.hide();
                    }
                }
                "trun_on_flashing" => {
                    // _tray.set_icon("tray/msg.png").unwrap();
                    // {
                    //     tray_handler::flash_tray(true); // 开始闪烁图标
                    // }
                    // tray::set_icon("tray/msg.png").unwrap();
                }
                "trun_off_flashing" => {
                    // tray.set_icon("tray/msg.png").unwrap();
                    // tray_handler.flash_tray(false); // 停止闪烁图标
                }
                _ => {
                    println!("menu item {:?} not handled", event.id);
                }
            }
        })
        .on_tray_icon_event(|tray, event| match event {
            tauri::tray::TrayIconEvent::Click {
                id: _,
                position,
                button,
                ..
            } => match button {
                tauri::tray::MouseButton::Left => {
                    println!("Left click");
                }
                tauri::tray::MouseButton::Right => {
                    println!("Right click");
                    tray.app_handle()
                        .emit("tray_contextmenu", position)
                        .unwrap();
                }
                _ => {}
            },
            tauri::tray::TrayIconEvent::Enter { position, .. } => {
                tray.app_handle().emit("tray_mouseenter", position).unwrap();
            }
            tauri::tray::TrayIconEvent::Leave { position, .. } => {
                tray.app_handle().emit("tray_mouseleave", position).unwrap();
            }
            _ => {}
        })
        .build(app)?;

    Ok(())
}

// pub struct TrayHandler {
//     flash_timer: Option<thread::JoinHandle<()>>,
//     tray_id: String,
// }

// impl TrayHandler {
//     pub fn new(tray_id: String) -> Self {
//         Self {
//             flash_timer: None,
//             tray_id,
//         }
//     }

//     pub fn flash_tray(&mut self, flag: bool) {
//         if flag {
//             // 清除之前的定时器
//             if let Some(timer) = self.flash_timer.take() {
//                 timer.join().unwrap(); // 确保线程结束
//             }

//             let tray_id = self.tray_id.clone();
//             self.flash_timer = Some(thread::spawn(move || {
//                 let mut toggle = true;
//                 let interval = time::Duration::from_millis(500);

//                 loop {
//                     if let Ok(tray) = tauri::api::tray::TrayIcon::get_by_id(&tray_id) {
//                         if toggle {
//                             tray.set_icon(None).unwrap(); // 清空图标
//                         } else {
//                             tray.set_icon("tray/msg.png").unwrap(); // 自定义图标
//                         }
//                         toggle = !toggle;
//                     }

//                     thread::sleep(interval);
//                 }
//             }));
//         } else {
//             // 清除定时器并设置图标
//             if let Some(timer) = self.flash_timer.take() {
//                 timer.join().unwrap();
//             }

//             if let Ok(tray) = tauri::api::tray::TrayIcon::get_by_id(&self.tray_id) {
//                 tray.set_icon("icons/icon.png").unwrap(); // 设置默认图标
//             }
//         }
//     }
// }
