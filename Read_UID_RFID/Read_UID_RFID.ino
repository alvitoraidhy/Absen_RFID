#include <MFRC522v2.h>
#include <MFRC522DriverSPI.h>
#include <MFRC522DriverPinSimple.h>

MFRC522DriverPinSimple ss_pin(5); 
MFRC522DriverPinSimple rst_pin(17);

MFRC522DriverSPI driver{ss_pin}; 
MFRC522 mfrc522{driver}; 

void setup() {
  Serial.begin(115200);  
  mfrc522.PCD_Init();  
  Serial.println(F("Scan PICC to see UID..."));
}

void loop() {
	if (!mfrc522.PICC_IsNewCardPresent()) {
		return;
	}

	if (!mfrc522.PICC_ReadCardSerial()) {
		return;
	}

	// Convert UID to a single hex string
	String uidHex = "";
	for (byte i = 0; i < mfrc522.uid.size; i++) {
		if (mfrc522.uid.uidByte[i] < 0x10) {
			uidHex += "0"; 
		}
		uidHex += String(mfrc522.uid.uidByte[i], HEX);
	}
	uidHex.toUpperCase(); 
	
  Serial.print(F("Card UID (Hex): "));
	Serial.println(uidHex);
  //variabel nya kesimpen di string "uidHex"//
  
	mfrc522.PICC_HaltA();
}
