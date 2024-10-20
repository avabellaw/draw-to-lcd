import sys
import os
from waveshare_OLED import OLED_1in5
from PIL import Image,ImageDraw,ImageFont
import socket
from lcd import OLED


def start_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    server_socket.bind(('192.168.1.169', 65432))
    print("UDP server listening on port 65432")
    lcd = OLED()

    try:
        while True:
            data, addr = server_socket.recvfrom(1024)
            x, y, pixel = map(int, data.decode().split(','))
            print(f"Received data: x={x}, y={y}, p={pixel}")
            lcd.set_pixel(x, y, pixel)
    except KeyboardInterrupt:
        print("Closing server")
        server_socket.close()


start_server()
