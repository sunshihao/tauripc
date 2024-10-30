// mod tray_handler;

// use std::{thread, time};
use tauri::{
    // menu::{Menu, MenuItem},
    // tray::{self, MouseButton, TrayIcon, TrayIconBuilder, TrayIconEvent},
    Emitter,
    Manager,
    Runtime,
};

// use tray_handler::TrayHandler;

// 托盘菜单定义设置
pub fn create_tray<R: tauri::Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
    // 初始化 TrayHandler 实例
    // let tray_id = "tray".to_string();
    // let tray_handler: TrayHandler = TrayHandler::new(tray_id.clone());
    // let quit_st =
    //     tauri::menu::MenuItem::with_id(app, "trun_on_flashing", "开启闪烁", true, None::<&str>)?;
    // let quit_sp =
    //     tauri::menu::MenuItem::with_id(app, "trun_off_flashing", "关闭闪烁", true, None::<&str>)?;
    // let quit_sw = tauri::menu::MenuItem::with_id(app, "show", "显示", true, None::<&str>)?;
    // let quit_he = tauri::menu::MenuItem::with_id(app, "hide", "隐藏", true, None::<&str>)?;
    // let quit_qe = tauri::menu::MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
    // let menu =
    //     tauri::menu::Menu::with_items(app, &[&quit_st, &quit_sp, &quit_sw, &quit_he, &quit_qe])?;

    // 创建托盘图标
    let _tray = tauri::tray::TrayIconBuilder::with_id("tray")
        // .menu(&menu)
        .tooltip("金投")
        .icon(app.default_window_icon().unwrap().clone())
        .on_menu_event(move |app, event| match event.id.as_ref() {
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
            _ => {
                println!("menu item {:?} not handled", event.id);
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
                    tray.app_handle()
                        .emit("tray_mouseleftclick", position)
                        .unwrap();
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
