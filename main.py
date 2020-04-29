import numpy as np
from filters import image_filter
from filters import canny_filter
from filters import cartoon_filter
from virtual_webcam_writer import VirtualWebcamWriter
import cv2


current_filter = canny_filter.CannyFilter()
cnn_style_ix = 0
CNN_STYLES = ['Hayao', 'Hosoda', 'Paprika', 'Shinkai']
_current_key = None

WIDTH = 1920
HEIGHT = 1080
DIMENSIONS = (WIDTH, HEIGHT)

# Virtual webcam
virtual_loopback_write_device_name = '/dev/video4'
virtual_loopback_read_device_name = '/dev/video5'
ENABLE_VIRTUAL_WRITER = True
ENABLE_VIRTUAL_READER = False
CAM_DEVICE = '/dev/video0'


def handle_key(key):
    if key == -1:
        return

    global current_filter, cnn_style_ix, _current_key, CNN_STYLES
    if _current_key is not None and _current_key != key:
        print('Unregistering because current key is {} and key is {}'.format(_current_key, key))
        if current_filter is not None:
            current_filter.unregister()

    # Copy _current_key in case it's not handled
    old_key = _current_key
    _current_key = key

    if key == 48:  # 0
        current_filter = None
    elif key == 49:  # 1
        current_filter = canny_filter.CannyFilter(dimensions=DIMENSIONS) if not isinstance(current_filter, canny_filter.CannyFilter) else current_filter
    elif key == 50:  # 2
        if isinstance(current_filter, cartoon_filter.CartoonGan):
            cnn_style_ix += 1
            new_style = CNN_STYLES[cnn_style_ix % len(CNN_STYLES)]
            print('Switching style to', new_style)
            current_filter.change_style(new_style)
        else:
            current_filter = cartoon_filter.CartoonGan(dimensions=DIMENSIONS, gpu=True)
    else:
        # Revert back _current_key
        _current_key = old_key
        print(f'Key {key} not supported')


def transform_frame(frame):
    global current_filter
    return current_filter.process_frame(frame) if current_filter is not None else frame


def configure_video_options(capture_device, width, height):
    success = capture_device.set(cv2.CAP_PROP_FRAME_WIDTH, width)
    success = success and capture_device.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
    if not success:
        raise Exception('Failed to set correct width and height')


def start_virtual_webcam_loop():
    # Input device
    cv2.namedWindow("Input image")
    vc = cv2.VideoCapture(CAM_DEVICE)
    configure_video_options(vc, WIDTH, HEIGHT)

    # Filter output
    cv2.namedWindow("Filter result")
    
    # Writer
    virtual_writer = None
    if ENABLE_VIRTUAL_WRITER:
        virtual_writer = VirtualWebcamWriter(virtual_loopback_write_device_name, WIDTH, HEIGHT)


    # Virtual webcam reader
    if ENABLE_VIRTUAL_READER:
        virtual_reader = cv2.VideoCapture(virtual_loopback_read_device_name)
        virtual_window_output = 'Virtual device output'
        cv2.namedWindow(virtual_window_output)


    if vc.isOpened(): # try to get the first frame
        rval, frame = vc.read()
    else:
        rval = False

    while rval:
        rval, frame = vc.read()

        if ENABLE_VIRTUAL_READER:
            vwebam_rval, vwebcam_frame = virtual_reader.read()
            if vwebam_rval == -1:
                print('Could not read from virtualwebcam')

        new_frame = transform_frame(frame)

        cv2.imshow("Input image", frame)
        cv2.imshow("Filter result", new_frame)
        
        if ENABLE_VIRTUAL_READER:
            cv2.imshow(virtual_window_output, vwebcam_frame)
        
        if ENABLE_VIRTUAL_WRITER:
            virtual_writer.write(new_frame)


        key = cv2.waitKey(20)
        if key == 27:  # ESC key
            break
        handle_key(key)

    cv2.destroyWindow("Filter result")
    cv2.destroyWindow("Input image")
    if ENABLE_VIRTUAL_WRITER:
        virtual_writer.destroy()
    if ENABLE_VIRTUAL_READER:
        cv2.destroyWindow(virtual_window_output)
        virtual_reader.release()
    vc.release()


if __name__ == "__main__":
    start_virtual_webcam_loop()
