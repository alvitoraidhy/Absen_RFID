#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128  
#define SCREEN_HEIGHT 64  
#define OLED_RESET -1
#define SCREEN_ADDRESS 0x3C
Adafruit_SSD1306 konten(128, 64, &Wire, -1);

void setup() {
  konten.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  //buat nampilin text
  konten.clearDisplay();
  konten.setTextColor(WHITE);
  konten.setCursor(10, 20);
  konten.setTextSize(2);
  konten.print("tes123");
  konten.display();
  //buat nampilin text
}

void loop() {
  // put your main code here, to run repeatedly:
}
