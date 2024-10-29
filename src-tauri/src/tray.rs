use std::sync::Arc;
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, TrayIconBuilder, TrayIconEvent},
    Emitter, Manager, Runtime,
};

pub fn create_tray<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
    let quit_st = MenuItem::with_id(app, "start", "开启闪烁", true, None::<&str>)?;
    let quit_sp = MenuItem::with_id(app, "stop", "关闭闪烁", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&quit_st, &quit_sp])?;

    // 状态控制
    let flashing = Arc::new(AtomicBool::new(false));
    let flashing_handle = flashing.clone();

    // 创建托盘图标
    let _ = TrayIconBuilder::with_id("tray")
        .menu(&menu)
        .tooltip("tauri")
        // 托盘图标
        .icon(app.default_window_icon().unwrap().clone())
        .on_menu_event(|_app, event| match event.id.as_ref() {
            "quit" => {
                println!("quit menu item was clicked", _app);
                // app.exit(0);

            }
            _ => {
                println!("menu item {:?} not handled", event.id);
            }
        })
        .on_tray_icon_event(|tray, event| match event {
            TrayIconEvent::Click {
                id: _,
                position,
                rect: _,
                button,
                button_state: _,
            } => match button {
                MouseButton::Left {} => {
                    println!("quit Left");
                }
                MouseButton::Right {} => {
                    println!("quit Right");
                    tray.app_handle()
                        .emit("tray_contextmenu", position)
                        .unwrap();
                }
                _ => {}
            },
            TrayIconEvent::Enter {
                id: _,
                position,
                rect: _,
            } => {
                tray.app_handle().emit("tray_mouseenter", position).unwrap();
            }
            TrayIconEvent::Leave {
                id: _,
                position,
                rect: _,
            } => {
                // sleep(Duration::from_millis(500));
                tray.app_handle().emit("tray_mouseleave", position).unwrap();
            }
            _ => {}
        })
        .build(app);
    Ok(())
}
