import socket
from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)


class PixelGrid:
    '''Class representing webpage pixel grid and map to the lcd's pixels'''
    def __init__(self, size):
        self.pixels = [[0] * size for _ in range(size)]
        self.size = size

    def refresh(self):
        '''Get the pixels from the lcd and update the webpage's pixel grid'''
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.sendto("GET".encode(), ('192.168.1.169', 65432))
            data, _ = s.recvfrom(65536)
            self.pixels = json.loads(data.decode())

    def set_pixel(self, x, y, value):
        '''Set a pixel on the webpage and update the lcd'''
        self.pixels[y][x] = value
        self.send_pixel_to_lcd(x, y, value)

    def send_to_lcd(self, message):
        '''Send a message to the lcd'''
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.sendto(message.encode(), ('192.168.1.169', 65432))

    def send_pixel_to_lcd(self, x, y, pixel):
        '''Send a pixel to the lcd'''
        message = f"{x},{y},{pixel}"
        self.send_to_lcd(message)

    def __len__(self):
        return self.size**2


pixel_grid = PixelGrid(128)


@app.route('/')
def home():
    '''Homepage controller'''
    pixel_grid.refresh()
    return render_template('index.html', pixels=pixel_grid.pixels)


@app.route('/submit', methods=['POST'])
def submit():
    '''Controller for handling pixel data from the webpage'''
    pixels = request.get_json()
    for pixel in pixels:
        x, y, colour = int(pixel.get('x')), \
                       int(pixel.get('y')), \
                       pixel.get('colour')
        pixel_grid.set_pixel(x, y, colour)

    return jsonify({'status': 'success',
                    'pixel': f"{colour}", 'x': x, 'y': y})


@app.route('/clear', methods=['POST'])
def clear():
    '''Controller for clearing the pixel grid'''
    pixel_grid.send_to_lcd("CLEAR")

    return jsonify({'status': 'success'})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
