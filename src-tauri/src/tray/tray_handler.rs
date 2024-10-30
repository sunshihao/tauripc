use std::{thread, time};
// use tauri::{Manager, WebviewWindow, Window};

// 定义 TrayHandler 结构体
pub struct TrayHandler {
    flash_timer: Option<thread::JoinHandle<()>>,
    tray_id: String,
}

impl TrayHandler {
    pub fn new(tray_id: String) -> Self {
        Self {
            flash_timer: None,
            tray_id,
        }
    }

    pub fn flash_tray(&mut self, flag: bool) {
        if flag {
            // 清除之前的定时器
            if let Some(timer) = self.flash_timer.take() {
                timer.join().unwrap(); // 确保线程结束
            }

            let tray_id = self.tray_id.clone();
            self.flash_timer = Some(thread::spawn(move || {
                let mut toggle = true;
                let interval = time::Duration::from_millis(500);

                loop {
                    if let Ok(tray) = tauri::api::tray::TrayIcon::get_by_id(&tray_id) {
                        if toggle {
                            tray.set_icon(None).unwrap();
                        } else {
                            // 设置自定义图标
                            tray.set_icon("tray/msg.png").unwrap();
                        }
                        toggle = !toggle;
                    }

                    thread::sleep(interval);
                }
            }));
        } else {
            // 清除定时器并设置图标
            if let Some(timer) = self.flash_timer.take() {
                timer.join().unwrap();
            }

            if let Ok(tray) = tauri::api::tray::TrayIcon::get_by_id(&self.tray_id) {
                tray.set_icon("icons/icon.png").unwrap();
            }
        }
    }
}
