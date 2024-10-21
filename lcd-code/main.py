import sys
import os
from waveshare_OLED import OLED_1in5
from PIL import Image,ImageDraw,ImageFont
import socket
from lcd import OLED
import _thread
import queue
import time
import json

pixel_queue = queue.Queue()
lcd = OLED()


def get_pixel_arr(pixel_access):
    height = lcd.disp.height
    width = lcd.disp.width
    return [[pixel_access[x, y] for x in range(width)] for y in range(height)]


def start_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    server_socket.bind(('192.168.1.169', 65432))
    print("UDP server listening on port 65432")
    _thread.start_new_thread(process_queue, ())

    try:
        while True:
            data, addr = server_socket.recvfrom(1024)
            if data == b"GET":
                pixels_arr = get_pixel_arr(lcd.pixels)
                server_socket.sendto(json.dumps(pixels_arr).encode(), addr)
            elif data == b"CLEAR":
                lcd.clear()
                pixel_queue.queue.clear()
            else:
                x, y, pixel = map(int, data.decode().split(','))
                pixel_queue.put((x, y, pixel))
    except KeyboardInterrupt:
        print("Closing server")
        server_socket.close()


def process_queue():
    pixels_drawn_count = 0
    while True:
        if not pixel_queue.empty():
            x, y, pixel = pixel_queue.get()
            lcd.set_pixel(x, y, pixel)
            pixels_drawn_count += 1
            if pixels_drawn_count >= 15:
                lcd.show()
                pixels_drawn_count = 0
        else:
            if pixels_drawn_count > 0:
                lcd.show()
                pixels_drawn_count = 0
            time.sleep(0.1)


start_server()
