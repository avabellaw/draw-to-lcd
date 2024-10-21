import sys
import os
from waveshare_OLED import OLED_1in5
from PIL import Image,ImageDraw,ImageFont
import socket
from lcd import OLED
import _thread
import queue
import time

pixel_queue = queue.Queue()


def start_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    server_socket.bind(('192.168.1.169', 65432))
    print("UDP server listening on port 65432")
    _thread.start_new_thread(process_queue, ())

    try:
        while True:
            data, addr = server_socket.recvfrom(1024)
            x, y, pixel = map(int, data.decode().split(','))
            pixel_queue.put((x, y, pixel))
    except KeyboardInterrupt:
        print("Closing server")
        server_socket.close()


def process_queue():
    lcd = OLED()
    while True:
        if not pixel_queue.empty():
            x, y, pixel = pixel_queue.get()
            lcd.set_pixel(x, y, pixel)
        else:
            time.sleep(0.1)


start_server()
