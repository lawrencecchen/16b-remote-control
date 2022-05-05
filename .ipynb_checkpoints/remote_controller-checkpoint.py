import RPi.GPIO as GPIO
import asyncio
import websockets

LEFT_GPIO_PIN=12
RIGHT_GPIO_PIN=13

# https://subscription.packtpub.com/book/iot_and_hardware/9781788290524/1/ch01lvl1sec03/raspberry-pi-zero-w
# https://docs.quanser.com/quarc/documentation/raspberry_pi_0.html

GPIO.setmode(GPIO.BCM)
GPIO.setup(LEFT_GPIO_PIN, GPIO.OUT)
GPIO.setup(RIGHT_GPIO_PIN, GPIO.OUT)

left_pwm = GPIO.PWM(LEFT_GPIO_PIN, 50)
right_pwm = GPIOl.PWM(RIGHT_GPIO_PIN, 50)

def write_pwm(pwm_left, pwm_right):
    left_pwm.ChangeDutyCycle(min(max(0, pwm_left), 255))
    right_pwm.ChangeDutyCycle(min(max(0, right_left), 255))
    
def start(pwm=50):
    left_pwm.start(pwm)
    right_pwm.start(pwm)
    
async def tick(websocket):
    async for message in websocket:
        print(message)
        await websocket.send(message)
    
async def main():
    async with websockets.serve(echo, "localhost", 8765):
        await asyncio.Future()  # run forever

asyncio.run(main())