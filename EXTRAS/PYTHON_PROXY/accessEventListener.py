from flask import Flask, request
from flask_cors import CORS
import serial
import time

app = Flask(__name__)
CORS(app)

@app.route('/listener', methods=['POST'])
def entranceMiddleware():
    serialCom = serial.Serial("/dev/ttyACM0", 9600, timeout=1)
    time.sleep(1)
    accessCode = request.json.get("eventCode")

    if(accessCode == "OPEN"):
        serialCom.write(bytes("100\n", "utf-8"))
        print(f"Arduino respone: {serialCom.readline().decode('utf-8').strip()}")
    elif(accessCode == "CLOSE"):
        serialCom.write(bytes("0\n", "utf-8"))
        print(f"Arduino respone: {serialCom.readline().decode('utf-8').strip()}")

    serialCom.close()

    print(f"Signal {accessCode} Sent...")
    return "200" 

if __name__ == '__main__':
    app.run()

