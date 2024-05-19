#include <stdio.h>
#include <string.h>

#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <freertos/event_groups.h>
#include <freertos/semphr.h>

#include <esp_log.h>
#include <esp_wifi.h>
#include <esp_event.h>
#include <nvs_flash.h>
#include <driver/gpio.h>
#include <esp_system.h>

// #include "wifi_ble_pro.h"
#include "wifi_softap_pro.h"
#include "MQTT_lib.h"
#include "local_control.h"
#include "peripheral_lib.h"
#include "ble_mesh_client_lib.h"
#include "ble_mesh_server_lib.h"

// Chân GPIO 13 là chân thực hiện reset toàn mạng ( chọn mode )

// Chân GPIO 14 là chân chọn mode client hoặc server ( sử dụng thanh gạt )

// Chân GPIO 18 là chân để báo báo hiệu kết nối WIFI(nối với led xanh lá )
//-> tắt là đang không kết nối wifi, bật xanh lá cây là kết nối wifi, chỉ tồn tại ở client

// Chân GPIO 4 là chân để báo hiệu trường hợp client đang mất kết nối wifi ( sử dụng led đỏ )
// ví dụ người dùng nhập sai SSID hoặc password, để người dùng biết và thực hiện reset lại

// Chân GPIO 18 là chân để báo hiệu client || server tham gia mạng BLE MESH thành công (nối với led xanh nước biển)
// -> tắt là chưa join vào mạng, bật xanh nước biển là join vào mạng mesh thành công 

#define RESET_WIFI_AND_BLE_MESH_PIN GPIO_NUM_13
#define MODE_CLIENT_OR_SERVER_PIN GPIO_NUM_14
#define WIFI_STATUS GPIO_NUM_4
#define BLE_MESH_INITIALIZED_PIN GPIO_NUM_16
#define BUTTON_1 GPIO_NUM_18
#define BUTTON_2 GPIO_NUM_19
#define RELAY_1 GPIO_NUM_17
#define RELAY_2 GPIO_NUM_22
#define V_RELAY_1 GPIO_NUM_25
#define V_RELAY_2 GPIO_NUM_26


SemaphoreHandle_t Delete_flash_semaphore;

void button_handle(int gpio_num, uint64_t tick){
    int press = 0;
    if(gpio_num == RESET_WIFI_AND_BLE_MESH_PIN){
    press = tick*portTICK_PERIOD_MS;
    // output_toggle_pin(GPIO_NUM_2);
    if(press > 5000){
    BaseType_t xHigherPriorityTaskWoken = pdFALSE;

    // RESET ALL
    xSemaphoreGiveFromISR(Delete_flash_semaphore,&xHigherPriorityTaskWoken);
    }
}
else if(gpio_num == BUTTON_1){
    output_toggle_pin(RELAY_1);
}
else if(gpio_num == BUTTON_2){
    output_toggle_pin(RELAY_2);
}
}


// Nếu muốn chuyển mode, chuyển thanh gạt và reset
void app_main(void){
/* Initialize NVS partition */
    esp_err_t ret = nvs_flash_init();

    if (ret == ESP_ERR_NVS_NO_FREE_PAGES) {
        /* NVS partition was truncated
         * and needs to be erased */
        ESP_ERROR_CHECK(nvs_flash_erase());

        /* Retry nvs_flash_init */
        ESP_ERROR_CHECK(nvs_flash_init());
    }
    
   //test only
   output_io_create(GPIO_NUM_2);
    // Input initialize
     input_io_create(RESET_WIFI_AND_BLE_MESH_PIN,GPIO_INTR_ANYEDGE);
     input_callback_register(button_handle);
     input_io_create(MODE_CLIENT_OR_SERVER_PIN,GPIO_INTR_ANYEDGE);

     Delete_flash_semaphore = xSemaphoreCreateBinary();
     // CHOOSE MODE CLIENT 
     if(gpio_get_level(MODE_CLIENT_OR_SERVER_PIN) == 1){
     ESP_LOGI("SMART HOME", "CLIENT MODE");

     // output init
     output_io_create(WIFI_STATUS);
     output_io_create(BLE_MESH_INITIALIZED_PIN);

     // input init
     input_io_create(BUTTON_1, GPIO_INTR_falling);
     input_io_create(BUTTON_2, GPIO_INTR_falling);

    // BLE MESH CLIENT INIT
     ble_mesh_client_init();
     // WIFI PROVISIONING INIT
     wifi_provisioning_softap_init();

     xSemaphoreTake(Delete_flash_semaphore,portMAX_DELAY);
     nvs_flash_erase();
     esp_restart();
     }

    // CHOOSE MODE SERVER
    else if ( gpio_get_level(MODE_CLIENT_OR_SERVER_PIN) == 0){
     ESP_LOGI("SMART HOME", "SERVER MODE");

    // output init 
    output_io_create(RELAY_1);
    output_io_create(RELAY_2);
    output_io_create(V_RELAY_1);
    output_io_create(V_RELAY_2);
     
    //  wifi_provisioning_init(); -> Take a role as server, no need wifi
     ble_mesh_server_init();
     xSemaphoreTake(Delete_flash_semaphore,portMAX_DELAY);
     nvs_flash_erase();
     esp_restart();
    }
 
}

