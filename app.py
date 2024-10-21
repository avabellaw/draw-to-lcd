import socket
from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)


class PixelGrid:
    '''Class to represent the webpage's pixel grid and map to the lcd's display pixels'''
    def __init__(self, size):
        self.pixels = [[0] * size for _ in range(size)]
        self.size = size

    def refresh(self):
        '''Get the pixels from the lcd and update the webpage's pixel grid'''
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.sendto("GET".encode(), ('192.168.1.169', 65432))
            data, _ = s.recvfrom(65536)
            print(f"Received data: {data}")
            self.pixels = json.loads(data.decode())

    def set_pixel(self, x, y, value):
        '''Set a pixel on the webpage and update the lcd'''
        self.pixels[y][x] = value
        self.send_to_lcd(x, y, value)

    def send_to_lcd(self, x, y, pixel):
        '''Send a pixel to the lcd'''
        message = f"{x},{y},{pixel}"
        print(f"Sending to LCD: {message}")

        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.sendto(message.encode(), ('192.168.1.169', 65432))

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
    data = request.get_json()
    x, y = int(data.get('x')), int(data.get('y'))

    pixel = 1 if pixel_grid.pixels[y][x] == 0 else 0
    pixel_grid.set_pixel(x, y, pixel)

    return jsonify({'status': 'success',
                    'pixel_value': f"{pixel}", 'x': x, 'y': y})


if __name__ == '__main__':
    app.run(debug=True)
