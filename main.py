import RPi.GPIO as GPIO
import asyncio
import websockets
import json

LEFT_GPIO_PIN=12
RIGHT_GPIO_PIN=13
PORT=8765

# https://subscription.packtpub.com/book/iot_and_hardware/9781788290524/1/ch01lvl1sec03/raspberry-pi-zero-w
# https://docs.quanser.com/quarc/documentation/raspberry_pi_0.html

GPIO.setmode(GPIO.BCM)
GPIO.setup(LEFT_GPIO_PIN, GPIO.OUT)
GPIO.setup(RIGHT_GPIO_PIN, GPIO.OUT)

left_pwm = GPIO.PWM(LEFT_GPIO_PIN, 50)
right_pwm = GPIO.PWM(RIGHT_GPIO_PIN, 50)

prev_left_pwm = 0
prev_right_pwm = 0

left_jolt = 66
right_jolt = 60

def write_pwm(pwm_left, pwm_right):
    print(f"left: {pwm_left}, right: {pwm_right}")
    global prev_left_pwm
    global prev_right_pwm
    if prev_left_pwm == 0:
        left_pwm.ChangeDutyCycle(pwm_left)
    else:
        left_pwm.ChangeDutyCycle(min(max(0, pwm_left), 255))

    if prev_right_pwm == 0:
        right_pwm.ChangeDutyCycle(pwm_right)
    else:
        right_pwm.ChangeDutyCycle(min(max(0, pwm_right), 255))
    prev_left_pwm = pwm_left
    prev_right_pwm = pwm_right
    
def start(pwm=0):
    print(f"start: {pwm}")
    left_pwm.start(pwm)
    right_pwm.start(pwm)
    
async def handler(websocket):
    async for message in websocket:
        payload = json.loads(message)
        type = payload["type"]
        if type == "set_pwm":
            left = payload["left"]
            right = payload["right"]
            write_pwm(left, right)
        await websocket.send("ok")
    
async def main():
    print(f"initialized GPIO on pins left: {LEFT_GPIO_PIN}, right: {RIGHT_GPIO_PIN}")
    print(f"listening on port: {PORT}")
    async with websockets.serve(handler, "0.0.0.0", PORT):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    try:
        start()
        asyncio.run(main())
    finally:
        print("cleaning up GPIO")
        left_pwm.stop()
        right_pwm.stop()
        GPIO.cleanup()