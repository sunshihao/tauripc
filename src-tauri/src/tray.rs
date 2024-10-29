use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, TrayIconBuilder, TrayIconEvent},
    Emitter, Manager, Runtime,
};

// 托盘菜单定义设置
pub fn create_tray<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
    let quit_st = MenuItem::with_id(app, "trun_on_flashing", "开启闪烁", true, None::<&str>)?;
    let quit_sp = MenuItem::with_id(app, "trun_off_flashing", "关闭闪烁", true, None::<&str>)?;
    let quit_sw = MenuItem::with_id(app, "show", "显示", true, None::<&str>)?;
    let quit_he = MenuItem::with_id(app, "hide", "隐藏", true, None::<&str>)?;
    let quit_qe = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&quit_st, &quit_sp, &quit_sw, &quit_he, &quit_qe])?;
    // 创建托盘图标
    let _ = TrayIconBuilder::with_id("tray")
        .menu(&menu)
        .tooltip("tauri")
        // 托盘图标
        .icon(app.default_window_icon().unwrap().clone())
        .on_menu_event(move |app, event| match event.id.as_ref() {
            "quit" => {
                app.exit(0);
            }
            "show" => {
                let window = app.get_webview_window("main").unwrap();
                let _ = window.show();
            }
            "hide" => {
                let window = app.get_webview_window("main").unwrap();
                let _ = window.hide();
            }
            "trun_on_flashing" => {
                println!("trun_on_flashing");
            }
            "trun_off_flashing" => {
                println!("trun_off_flashing");
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
